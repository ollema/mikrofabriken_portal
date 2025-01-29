import { error, fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { redirect } from 'sveltekit-flash-message/server';
import { z } from 'zod';
import { getUser } from '$lib/server/auth.js';
import {
	areMembersEqual,
	findMember,
	getMember,
	getMembers,
	validateMember
} from '$lib/server/members.js';
import { getValidWorkPools } from '$lib/server/enums.js';
import { workPoolsFormSchema } from './schema.js';
import {
	getPendingUpdateForMember,
	getSuggestChangeOptions,
	suggestChange,
	updateRepo
} from '$lib/server/gitlab.js';
import { env } from '$env/dynamic/private';
import type { Member } from '$lib/types/members.js';
import { getWorkPoolNames, getWorkPoolsDescriptions } from '$lib/server/workpools.js';

export const load = async ({ locals, url }) => {
	const user = getUser(locals, url);
	let member = getMember(user.slackID);

	const pending = await getPendingUpdateForMember(member.crNumber).then(
		({ members, sourceBranch, link }) => {
			return {
				member: members && findMember(members, member.slackID),
				sourceBranch,
				link
			};
		}
	);

	member = pending.member || member;

	const validWorkPools = getValidWorkPools();

	const workPoolNameMapping = getWorkPoolNames();
	const workPoolDescriptionMapping = getWorkPoolsDescriptions();

	return {
		form: await superValidate(populateFromCurrent(member), zod(workPoolsFormSchema)),
		pending: pending,
		member: member,
		validWorkPools: validWorkPools,
		workPoolNameMapping,
		workPoolDescriptionMapping
	};
};

export const actions = {
	default: async ({ locals, request, cookies, url }) => {
		const user = getUser(locals, url);
		await updateRepo(env.UFPERSONSLIST_REPO_PATH);
		let members = getMembers();
		let member = findMember(members, user.slackID);
		const redirectUrl = `/membership/profile`;

		const pending = await getPendingUpdateForMember(member.crNumber).then(
			({ members, sourceBranch }) => {
				return {
					members: members,
					member: members && findMember(members, member.slackID),
					sourceBranch
				};
			}
		);

		members = pending.members || members;
		member = pending.member || member;

		const form = await superValidate(request, zod(workPoolsFormSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		const updatedMember = updateMember(member, form.data);

		try {
			validateMember(updatedMember);
		} catch (e) {
			console.log(e);
			return fail(400, { form });
		}

		if (areMembersEqual(member, updatedMember)) {
			redirect(302, redirectUrl, { type: 'warning', message: 'No changes detected!' }, cookies);
		}

		const options = getSuggestChangeOptions(member, undefined, pending.sourceBranch);

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

function populateFromCurrent(member: Member): z.infer<typeof workPoolsFormSchema> {
	return {
		workPools: member.workPools
	};
}

function updateMember(member: Member, data: z.infer<typeof workPoolsFormSchema>): Member {
	return {
		...member,
		workPools: data.workPools
	};
}

function updateMembersInPlace(member: Member, updatedMember: Member) {
	member.workPools = updatedMember.workPools;
}
