import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { error } from '@sveltejs/kit';
import git from 'simple-git';
import stringify from 'safe-stable-stringify';

import type { Member } from '$lib/types/members.js';
import type { MergeRequest, MergeRequests } from '$lib/types/gitlab';
import { env } from '$env/dynamic/private';

import { MembersSchema } from '$lib/schemas/members.js';
import { MergeRequestSchema, MergeRequestsSchema } from '$lib/schemas/gitlab';

/**
 * Options for suggesting a change in GitLab.
 */
export type SuggestChangeOptions = {
	/** An array of members to suggest the change to. */
	members: Array<Member>;
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
 * Generates options for suggesting changes to an existing member's information.
 *
 * @param existingMember - The member whose information is being updated
 * @param editor - The member who is making the edit (defaults to existingMember if not provided)
 * @param sourceBranch - Optional branch name to base the changes on
 * @returns An object containing branch name, commit message, MR title and description
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
 * Generates options for suggesting changes to add new members.
 *
 * @param sourceBranch - Optional branch name to base the changes on
 * @returns An object containing branch name, commit message, MR title and description for adding new members
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
 * Determines if a merge request is for a specific member based on their CR number.
 *
 * This function safely extracts the CR number from the merge request title,
 * handling cases where users might try to manipulate the title format.
 *
 * @param title - The title of the merge request
 * @param crNumber - The CR number to check against
 * @returns True if the merge request is for the specified member, false otherwise
 */
function isMergeRequestForMember(title: string, crNumber: string): boolean {
	// the user could try to trick us by adding parentheses to their name
	// therefore we need to extract the crNumber from the end of the title

	// split the title using both '(' and ')' as delimiters
	const splitTitle = title.split(/[()]/);

	// the crNumber should be in the second to last element of the split array,
	const extractedCrNumber = splitTitle[splitTitle.length - 2];

	// check if the extracted crNumber matches the given crNumber
	return extractedCrNumber === crNumber;
}

const BASE_URL = 'https://gitlab.mikrofabriken.se/api/v4';

/**
 * Creates HTTP headers for GitLab API requests.
 *
 * @param token - Optional GitLab personal access token for authentication
 * @returns An object containing the necessary HTTP headers
 */
function headers(token: string | undefined) {
	return {
		Accept: 'application/json',
		'Content-Type': 'application/json',
		...(token ? { Authorization: `Bearer ${token}` } : {})
	};
}

/**
 * Retrieves all open merge requests for a specific GitLab project.
 *
 * @param projectId - The ID of the GitLab project
 * @returns A promise that resolves to an array of merge requests
 * @throws Error if the API request fails
 */
async function getAllOpenMergeRequests(projectId: string) {
	try {
		const response = await fetch(`${BASE_URL}/projects/${projectId}/merge_requests?state=opened`, {
			method: 'GET',
			headers: headers(env.UFDATA_GITLAB_PERSONAL_ACCESS_TOKEN)
		});

		if (!response.ok) {
			throw new Error(`http error: ${response.status} ${response.statusText}`);
		}

		const data = await response.json();
		const mergeRequests = MergeRequestsSchema.parse(data);

		return mergeRequests;
	} catch (e) {
		console.error(`could not fetch merge requests for project ID ${projectId}`);
		throw e;
	}
}

/**
 * Retrieves the raw content of a file from a GitLab repository.
 *
 * @param projectId - The ID of the GitLab project
 * @param file - The path to the file in the repository
 * @returns A promise that resolves to the raw content of the file as a string
 * @throws Error if the API request fails
 */
async function getRawFileContent(projectId: string, file: string, branch: string) {
	try {
		const response = await fetch(
			`${BASE_URL}/projects/${projectId}/repository/files/${file}/raw?ref=${branch}`,
			{
				method: 'GET',
				headers: headers(env.UFDATA_GITLAB_PERSONAL_ACCESS_TOKEN)
			}
		);

		if (!response.ok) {
			throw new Error(`http error: ${response.status} ${response.statusText}`);
		}

		const data = await response.text();

		return data;
	} catch (e) {
		console.error(`could not fetch raw file ${file}`);
		throw e;
	}
}

/**
 * Creates a new merge request in GitLab.
 *
 * @param projectId - The ID of the GitLab project
 * @param options - Configuration options for the merge request
 * @returns A promise that resolves to the created merge request
 * @throws Error if the API request fails
 */
async function createMR(projectId: string, options: MergeRequestOptions) {
	try {
		const response = await fetch(
			`${BASE_URL}/projects/${projectId}/merge_requests?source_branch=${options.branch}&target_branch=${options.target}&title=${options.title}&description=${options.desc}&squash=true&remove_source_branch=true`,
			{
				method: 'POST',
				headers: headers(env.UFDATA_GITLAB_PERSONAL_ACCESS_TOKEN)
			}
		);

		if (!response.ok) {
			throw new Error(`http error: ${response.status} ${response.statusText}`);
		}

		const data = await response.json();
		const mergeRequest = MergeRequestSchema.parse(data);

		return mergeRequest;
	} catch (e) {
		console.error(`could not create merge request for project ID ${projectId}`);
		throw e;
	}
}

/**
 * Retrieves pending merge requests that match a specified filter.
 *
 * @param filter - A function that determines which merge requests to include
 * @returns A promise that resolves to an array of filtered merge requests
 * @throws SvelteKit error with status 500 if the operation fails
 */
export async function getPendingMergeRequests(
	filter: (mr: MergeRequest) => boolean
): Promise<MergeRequests> {
	try {
		const mergeRequests = await getAllOpenMergeRequests(env.UFDATA_GITLAB_PROJECT_ID);

		return mergeRequests.filter(filter);
	} catch (e) {
		console.log(e);
		error(500, `error when trying to find matching open merge requests`);
	}
}

/**
 * Retrieves pending updates for a specific member based on their CR number.
 *
 * This function checks for open merge requests that are updating the specified member
 * and returns the updated member data, source branch, and link to the merge request.
 *
 * @param crNumber - The CR number of the member
 * @returns An object containing members data, source branch, and web URL of the merge request
 */
export async function getPendingUpdateForMember(crNumber: string) {
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

	const fileContent = await getRawFileContent(
		env.UFDATA_GITLAB_PROJECT_ID,
		'members.json',
		sourceBranch
	);

	const members = MembersSchema.parse(JSON.parse(fileContent));

	return { members, sourceBranch, link };
}

/**
 * Retrieves pending updates for new members.
 *
 * This function checks for open merge requests that are adding new members
 * and returns the updated member data, source branch, and link to the merge request.
 *
 * @returns An object containing members data, source branch, and web URL of the merge request
 */
export async function getPendingUpdateForNewMembers() {
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

	const fileContent = await getRawFileContent(
		env.UFDATA_GITLAB_PROJECT_ID,
		'members.json',
		sourceBranch
	);

	const members = MembersSchema.parse(JSON.parse(fileContent));

	return { members, sourceBranch, link };
}

/**
 * Updates a local Git repository to the latest version from the remote.
 *
 * This function fetches all updates from the remote repository and
 * resets the local repository to match the remote master branch.
 *
 * @param repoPath - The file system path to the Git repository
 * @returns A promise that resolves to the hash of the latest commit
 * @throws SvelteKit error with status 500 if the operation fails
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
 * Creates a temporary copy of a directory.
 *
 * This function creates a unique temporary directory and copies the contents
 * of the specified directory into it. The temporary directory name includes
 * a timestamp to ensure uniqueness.
 *
 * @param dir - The path to the directory to copy
 * @returns A promise that resolves to the path of the temporary directory
 * @throws SvelteKit error with status 500 if the operation fails
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
 * Suggests a change to the members file by creating or updating a merge request.
 *
 * This function:
 * 1. Updates the local repository to the latest version
 * 2. Creates a temporary copy of the repository
 * 3. Checks out the appropriate branch
 * 4. Updates the members.json file with the provided members data
 * 5. Commits and pushes the changes
 * 6. Creates a merge request if needed
 * 7. Cleans up the temporary repository
 *
 * @param options - Configuration options for the change
 * @throws SvelteKit error with status 500 if the operation fails
 */
export async function suggestChange(options: SuggestChangeOptions) {
	// start from latest commit on master
	updateRepo(env.UFDATA_REPO_PATH);

	// create temporary copy of repo
	const tempRepoPath = await mktempcp(env.UFDATA_REPO_PATH);
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
			await createMR(env.UFDATA_GITLAB_PROJECT_ID, {
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
