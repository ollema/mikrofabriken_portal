import { error, fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { redirect } from 'sveltekit-flash-message/server';
import { z } from 'zod';
import { getUser } from '$lib/server/auth.js';
import { getMember, parseMemberList } from '$lib/server/members.js';
import { rfidTagsFormSchema } from './schema.js';
import { parseDate } from '@internationalized/date';
import {
	getPendingUpdateForMember,
	getSuggestChangeOptions,
	suggestChange,
	updateRepo
} from '$lib/server/gitlab.js';
import { env } from '$env/dynamic/private';
import type { Member } from '$lib/types/members.js';

export const load = async ({ locals, url }) => {
	const user = getUser(locals, url);
	const members = parseMemberList();
	let member = getMember(members, user.slackID);

	const pending = await getPendingUpdateForMember(member.crNumber).then(
		({ members, sourceBranch, link }) => {
			return {
				member: members && getMember(members, member.slackID),
				sourceBranch,
				link
			};
		}
	);

	member = pending.member || member;

	return {
		form: await superValidate(populateFromCurrent(member), zod(rfidTagsFormSchema)),
		pending: pending,
		member: member
	};
};

export const actions = {
	default: async ({ locals, url, request, cookies }) => {
		const user = getUser(locals, url);
		await updateRepo(env.UFPERSONSLIST_REPO_PATH);
		let members = parseMemberList();
		let member = getMember(members, user.slackID);
		const redirectUrl = `/membership/profile`;

		const pending = await getPendingUpdateForMember(member.crNumber).then(
			({ members, sourceBranch }) => {
				return {
					members: members,
					member: members && getMember(members, member.slackID),
					sourceBranch
				};
			}
		);

		members = pending.members || members;
		member = pending.member || member;

		const form = await superValidate(request, zod(rfidTagsFormSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		// update member by returning a new member object
		const updatedMember = updateMember(member, form.data);

		if (artifactsDeepEqual(member, updatedMember)) {
			redirect(302, redirectUrl, { type: 'warning', message: 'No changes detected!' }, cookies);
		}

		// get options for merge request while we still have the old member
		const options = getSuggestChangeOptions(member, undefined, pending.sourceBranch);

		// finally update member in place, which will be reflected in the members array
		updateMembersInPlace(member, updatedMember);

		try {
			await suggestChange({ members: members, ...options });
		} catch (e) {
			console.log(e);
			error(500, 'Something went wrong. Check the logs and please try again later.');
		}

		redirect(
			302,
			redirectUrl,
			{
				type: 'success',
				message: 'Change request submitted successfully!'
			},
			cookies
		);
	}
};

function populateFromCurrent(member: Member): z.infer<typeof rfidTagsFormSchema> {
	const artifacts = member.artifacts;

	const rfidTags: z.infer<typeof rfidTagsFormSchema>['rfidTags'] = [];

	artifacts.forEach((artifact) => {
		if (artifact.type === 'rfid') {
			if (artifact.attributes?.data !== undefined && artifact.attributes.codeHash !== undefined) {
				rfidTags.push({
					startDate: artifact.startDate,
					data: artifact.attributes.data,
					codeHash: artifact.attributes.codeHash,
					endDate: artifact.endDate
				});
			} else {
				throw new Error('RFID artifact is missing data or codeHash');
			}
		}
	});

	return {
		rfidTags: rfidTags
	};
}

function updateMember(member: Member, data: z.infer<typeof rfidTagsFormSchema>): Member {
	const updatedArtifacts = [
		...data.rfidTags.map((tag) => ({
			type: 'rfid' as const,
			startDate: tag.startDate,
			endDate: tag.endDate,
			attributes: {
				data: tag.data,
				codeHash: tag.codeHash
			}
		}))
	];

	updatedArtifacts.sort((a, b) => {
		const dateA = parseDate(a.startDate);
		const dateB = parseDate(b.startDate);
		return dateA.compare(dateB);
	});

	const suggestedMember = {
		...member,
		artifacts: updatedArtifacts
	};

	return suggestedMember;
}

function artifactsDeepEqual(a: Member, b: Member) {
	return (
		a.artifacts.length === b.artifacts.length &&
		a.artifacts.every((artifact, index) => {
			const otherArtifact = b.artifacts[index];
			if (artifact.type !== otherArtifact.type) {
				return false;
			}

			if (artifact.startDate !== otherArtifact.startDate) {
				return false;
			}

			if (artifact.endDate !== otherArtifact.endDate) {
				return false;
			}

			if (artifact.type === 'rfid' && otherArtifact.type === 'rfid') {
				return (
					artifact.attributes.data === otherArtifact.attributes.data &&
					artifact.attributes.codeHash === otherArtifact.attributes.codeHash
				);
			} else if (artifact.type === 'key' && otherArtifact.type === 'key') {
				return artifact.attributes.number === otherArtifact.attributes.number;
			}
		})
	);
}

function updateMembersInPlace(member: Member, updatedMember: Member) {
	member.artifacts = updatedMember.artifacts;
}
