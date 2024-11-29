import { error, fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { redirect } from 'sveltekit-flash-message/server';
import { z } from 'zod';
import { getUser } from '$lib/server/auth.js';
import { getMember, parseMemberList } from '$lib/server/members.js';
import { artifactsFormSchema } from './schema.js';
import { parseDate } from '@internationalized/date';
import {
	getPendingUpdateForMember,
	getSuggestChangeOptions,
	suggestChange,
	updateRepo
} from '$lib/server/gitlab.js';
import { env } from '$env/dynamic/private';
import type { Member } from '$lib/types/members.js';

export const load = async ({ locals, params }) => {
	getUser(locals);
	const members = parseMemberList();
	let member = getMember(members, params.slackEmail);

	const pending = await getPendingUpdateForMember(member.crNumber).then(
		({ members, sourceBranch, link }) => {
			return {
				member: members && getMember(members, member.slackEmail),
				sourceBranch,
				link
			};
		}
	);

	member = pending.member || member;

	return {
		form: await superValidate(populateFromCurrent(member), zod(artifactsFormSchema)),
		pending: pending,
		member: member
	};
};

export const actions = {
	default: async ({ locals, params, request, cookies }) => {
		const user = getUser(locals);
		await updateRepo(env.UFPERSONSLIST_REPO_PATH);
		let members = parseMemberList();
		let member = getMember(members, params.slackEmail);
		const admin = getMember(members, user.email);
		const redirectUrl = `/admin/members/${member.slackEmail}`;

		const pending = await getPendingUpdateForMember(member.crNumber).then(
			({ members, sourceBranch }) => {
				return {
					members: members,
					member: members && getMember(members, member.slackEmail),
					sourceBranch
				};
			}
		);

		members = pending.members || members;
		member = pending.member || member;

		const form = await superValidate(request, zod(artifactsFormSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		// update member by returning a new member object
		const updatedMember = updateMember(member, form.data);

		if (rfidArtifactDeepEqual(member, updatedMember)) {
			redirect(302, redirectUrl, { type: 'warning', message: 'No changes detected!' }, cookies);
		}

		// get options for merge request while we still have the old member
		const options = getSuggestChangeOptions(member, admin, pending.sourceBranch);

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

function populateFromCurrent(member: Member): z.infer<typeof artifactsFormSchema> {
	const artifacts = member.artifacts;

	const rfidTags: z.infer<typeof artifactsFormSchema>['rfidTags'] = [];
	const keys: z.infer<typeof artifactsFormSchema>['keys'] = [];
	const legacyKeys: z.infer<typeof artifactsFormSchema>['legacyKeys'] = [];

	artifacts.forEach((artifact) => {
		if (artifact.type === 'rfid') {
			if (artifact.attributes?.data !== undefined && artifact.attributes.codeHash !== undefined) {
				const rfidTag = {
					startDate: artifact.startDate,
					data: artifact.attributes.data,
					codeHash: artifact.attributes.codeHash,
					endDate: artifact.endDate
				};
				rfidTags.push(rfidTag);
			} else {
				throw new Error('RFID artifact is missing data or codeHash');
			}
		} else if (artifact.type === 'key') {
			if (artifact.attributes?.number !== undefined) {
				const key = {
					startDate: artifact.startDate,
					number: artifact.attributes.number,
					endDate: artifact.endDate
				};
				keys.push(key);
			} else {
				throw new Error('Key artifact is missing number');
			}
		} else if (artifact.type === 'legacyKey') {
			if (artifact.attributes?.area !== undefined) {
				const legacyKey = {
					startDate: artifact.startDate,
					area: artifact.attributes.area,
					endDate: artifact.endDate
				};
				legacyKeys.push(legacyKey);
			} else {
				throw new Error('Legacy key artifact is missing area');
			}
		} else {
			throw new Error('Unknown artifact type');
		}
	});

	return {
		rfidTags: rfidTags,
		keys: keys,
		legacyKeys: legacyKeys
	};
}

function updateMember(member: Member, data: z.infer<typeof artifactsFormSchema>): Member {
	const updatedArtifacts = [
		...data.rfidTags.map((tag) => ({
			type: 'rfid' as const,
			startDate: tag.startDate,
			endDate: tag.endDate,
			attributes: {
				data: tag.data,
				codeHash: tag.codeHash
			}
		})),
		...data.keys.map((key) => ({
			type: 'key' as const,
			startDate: key.startDate,
			endDate: key.endDate,
			attributes: {
				number: key.number
			}
		})),
		...data.legacyKeys.map((legacyKey) => ({
			type: 'legacyKey' as const,
			startDate: legacyKey.startDate,
			endDate: legacyKey.endDate,
			attributes: {
				area: legacyKey.area
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

function rfidArtifactDeepEqual(a: Member, b: Member) {
	return (
		a.artifacts.length === b.artifacts.length &&
		a.artifacts.every((artifact, index) => {
			const otherArtifact = b.artifacts[index];
			return (
				artifact.type === otherArtifact.type &&
				artifact.startDate === otherArtifact.startDate &&
				artifact.endDate === otherArtifact.endDate &&
				artifact.attributes?.data === otherArtifact.attributes?.data &&
				artifact.attributes?.codeHash === otherArtifact.attributes?.codeHash &&
				artifact.attributes?.number === otherArtifact.attributes?.number &&
				artifact.attributes?.area === otherArtifact.attributes?.area
			);
		})
	);
}

function updateMembersInPlace(member: Member, updatedMember: Member) {
	member.artifacts = updatedMember.artifacts;
}
