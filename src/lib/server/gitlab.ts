import { error } from '@sveltejs/kit';
import git from 'simple-git';
import fs from 'fs/promises';
import stringify from 'safe-stable-stringify';
import path from 'path';
import os from 'os';
import { Gitlab, type MergeRequestSchemaWithBasicLabels } from '@gitbeaker/rest';

import { env } from '$env/dynamic/private';

import type { Member } from '$lib/types/members';
import { MembersSchema } from '$lib/schemas/members';

/**
 * Options for suggesting a change in GitLab.
 */
export type SuggestChangeOptions = {
	/** An array of members to suggest the change to. */
	members: Member[];
	/** The name of the branch to create the change on. */
	branch: string;
	/** The name of the branch to base the change on. */
	sourceBranch?: string;
	/** The commit message for the change. */
	message: string;
	/** The title of the merge request for the change. */
	title: string;
	/** The description of the merge request for the change. */
	desc: string;
};

/**
 * Options for creating a merge request.
 */
export type MergeRequestOptions = Pick<SuggestChangeOptions, 'branch' | 'title' | 'desc'> & {
	/**
	 * The target branch for the merge request.
	 */
	target: string;
};

/**
 * Returns an object containing options for updating information about a member.
 * @param existingMember - The member whose information is being updated.
 * @param editor - The member who submitted the change request. Defaults to `existingMember`.
 * @param sourceBranch - The name of the branch to base the change on. Defaults to `undefined`.
 * @returns An object containing the branch name,source branch name, commit message, merge request title, and description.
 */
export function getSuggestChangeOptions(
	existingMember: Member,
	editor: Member | undefined = undefined,
	sourceBranch: string | undefined = undefined
): Omit<SuggestChangeOptions, 'members'> {
	if (!editor) {
		editor = existingMember;
	}
	const randomString = Math.random().toString(36).substring(2, 15);
	const branch = `update-${existingMember.crNumber}-${randomString}`;
	const title = `Portal: update ${existingMember.name} (${existingMember.crNumber})`;
	const message = `Portal: update ${existingMember.name}`;
	const desc = `This merge request was automatically created by the membership portal when ${editor.name} submitted a change request.`;
	return { branch, sourceBranch, message, title, desc };
}

/**
 * Returns an object containing options for adding new members.
 * @param editor - The member who submitted the change request.
 * @returns An object containing the branch name, commit message, merge request title, and description.
 */
export function getNewMemberOptions(
	sourceBranch: string | undefined = undefined
): Omit<SuggestChangeOptions, 'members'> {
	const branch = `new-members`;
	const title = `Portal: add new members`;
	const message = `Portal: add new members`;
	const desc = `This merge request was automatically created by the membership portal.`;

	return { branch, sourceBranch, message, title, desc };
}

/**
 * Checks if a merge request title contains a specific CR number (SSN).
 * @param title - The title of the merge request.
 * @param crNumber - The CR number to check for.
 * @returns True if the merge request title contains the given CR number, false otherwise.
 */
function isMergeRequestForMember(title: string, crNumber: string): boolean {
	// the user could try to trick us by adding parantheses to their name
	// therefore we need to extract the crNumber from the end of the title

	// split the title using both '(' and ')' as delimiters
	const splitTitle = title.split(/[()]/);

	// the crNumber should be in the second to last element of the split array,
	const extractedCrNumber = splitTitle[splitTitle.length - 2];

	// check if the extracted crNumber matches the given crNumber
	return extractedCrNumber === crNumber;
}

export async function getPendingMergeRequests(
	filter: (mr: MergeRequestSchemaWithBasicLabels) => boolean
): Promise<MergeRequestSchemaWithBasicLabels[]> {
	try {
		const gitlab = new Gitlab({
			host: `http://${env.GITLAB_HOST}`,
			token: env.UFPERSONSLIST_GITLAB_PERSONAL_ACCESS_TOKEN
		});

		const mergeRequests = await gitlab.MergeRequests.all({
			projectId: env.UFPERSONSLIST_GITLAB_PROJECT_ID,
			state: 'opened'
		});

		return mergeRequests.filter(filter);
	} catch (e) {
		console.log(e);
		error(500, `error when trying to find matching open merge requests`);
	}
}

export async function getPendingUpdateForMember(crNumber: string) {
	const gitlab = new Gitlab({
		host: `http://${env.GITLAB_HOST}`,
		token: env.UFPERSONSLIST_GITLAB_PERSONAL_ACCESS_TOKEN
	});

	const pendingMergeRequests = await getPendingMergeRequests((mr) =>
		isMergeRequestForMember(mr.title, crNumber)
	);

	if (pendingMergeRequests.length === 0) {
		return {
			members: undefined,
			sourceBranch: undefined,
			link: undefined
		};
	}

	// TODO: handle multiple pending merge requests
	const mergeRequest = pendingMergeRequests[0];
	const sourceBranch = mergeRequest.source_branch;
	const link = mergeRequest.web_url;

	const fileContent = (await gitlab.RepositoryFiles.showRaw(
		env.UFPERSONSLIST_GITLAB_PROJECT_ID,
		'members.json',
		sourceBranch
	)) as string;

	const members = MembersSchema.parse(JSON.parse(fileContent));

	return { members, sourceBranch, link };
}

export async function getPendingUpdateForNewMembers() {
	const gitlab = new Gitlab({
		host: `http://${env.GITLAB_HOST}`,
		token: env.UFPERSONSLIST_GITLAB_PERSONAL_ACCESS_TOKEN
	});

	const pendingMergeRequests = await getPendingMergeRequests(
		(mr) => mr.title === 'Portal: add new members'
	);

	if (pendingMergeRequests.length === 0) {
		return {
			members: undefined,
			sourceBranch: undefined,
			link: undefined
		};
	}

	// TODO: handle multiple pending merge requests
	const mergeRequest = pendingMergeRequests[0];
	const sourceBranch = mergeRequest.source_branch;
	const link = mergeRequest.web_url;

	const fileContent = (await gitlab.RepositoryFiles.showRaw(
		env.UFPERSONSLIST_GITLAB_PROJECT_ID,
		'members.json',
		sourceBranch
	)) as string;

	const members = MembersSchema.parse(JSON.parse(fileContent));

	return { members, sourceBranch, link };
}

/**
 * Updates the Git repository located at the specified path to the latest version of the master branch.
 * @param repoPath The path to the Git repository to update.
 * @returns The hash of the latest commit after the update.
 * @throws An error with status code 500 if the repository could not be updated.
 */
export async function updateRepo(repoPath: string) {
	try {
		const repo = git(repoPath);
		await repo.fetch(['--all']);
		await repo.reset(['--hard', 'origin/master']);
		const latestCommit = await repo.revparse(['HEAD']);
		return latestCommit;
	} catch (e) {
		// log error on server but do not leak information to client
		console.log(e);
		error(500, `Could not update memberlist repo`);
	}
}

/**
 * Creates a temporary directory and copies the contents of the specified directory to it.
 * @param dir The directory to copy.
 * @returns The path to the temporary directory.
 * @throws An error if the temporary directory could not be created.
 */
async function mktempcp(dir: string) {
	try {
		const tmpPath = path.join(
			os.tmpdir(),
			new Date().toISOString().replace(/[^0-9]/g, ''),
			'memberlist'
		);
		await fs.mkdir(tmpPath, { recursive: true });
		await fs.cp(dir, tmpPath, { recursive: true });
		return tmpPath;
	} catch (e) {
		// log error on server but do not leak information to client
		console.log(e);
		error(500, `Could not create temporary directory`);
	}
}

/**
 * Creates a new merge request in GitLab.
 *
 * @param options - The options for the merge request.
 * @returns A Promise that resolves when the merge request has been created.
 */
async function createMergeRequest(options: MergeRequestOptions) {
	const gitlab = new Gitlab({
		host: `http://${env.GITLAB_HOST}`,
		token: env.UFPERSONSLIST_GITLAB_PERSONAL_ACCESS_TOKEN
	});

	await gitlab.MergeRequests.create(
		env.UFPERSONSLIST_GITLAB_PROJECT_ID,
		options.branch,
		options.target,
		options.title,
		{
			description: options.desc,
			squash: true,
			removeSourceBranch: true
		}
	);
}

/**
 * Suggests a change to the members file by creating a new branch, updating the members file,
 * committing and pushing the changes, and creating a merge request.
 *
 * @param options - The options for suggesting the change.
 * @param options.branch - The name of the new branch to create.
 * @param options.members - The updated members object to write to the members file.
 * @param options.message - The commit message for the change.
 * @param options.title - The title of the merge request.
 * @param options.desc - The description of the merge request.
 * @throws Will throw an error if the change could not be suggested.
 */
export async function suggestChange(options: SuggestChangeOptions) {
	// start from latest commit on master
	updateRepo(env.UFPERSONSLIST_REPO_PATH);

	// create temporary copy of repo
	const tempRepoPath = await mktempcp(env.UFPERSONSLIST_REPO_PATH);
	const tempRepoMembersFilePath = path.join(tempRepoPath, 'members.json');
	const repo = git(tempRepoPath);

	try {
		if (options.sourceBranch) {
			// checkout existing branch
			await repo.checkoutBranch(options.sourceBranch, 'origin/' + options.sourceBranch);
		} else {
			// checkout new branch based on master
			await repo.checkoutLocalBranch(options.branch);
		}

		// update members file
		await fs.writeFile(tempRepoMembersFilePath, stringify(options.members, null, 2) + '\n');

		// stage, commit and push changes
		await repo
			.add(tempRepoMembersFilePath)
			.commit(options.message, {
				'--author': `Portal <no-reply+portal@mikrofabriken.se>`
			})
			.push('origin', options.sourceBranch || options.branch);

		// create merge request if needed
		if (!options.sourceBranch) {
			createMergeRequest({
				branch: options.branch,
				target: 'master',
				title: options.title,
				desc: options.desc
			});
		}
	} catch (e) {
		console.log(e);
		error(500, `Could not suggest change to members file`);
	} finally {
		if (tempRepoPath) {
			await fs.rm(tempRepoPath, { recursive: true, force: true }).catch((e) => console.error(e));
		}
	}
}
