import { error, fail } from '@sveltejs/kit';

import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { redirect } from 'sveltekit-flash-message/server';

import { getUser } from '$lib/server/auth.js';
import { getMember, parseMemberList } from '$lib/server/members.js';
import {
	profileDeepEqual,
	updateMember,
	updateMembersInPlace
} from '$lib/server/profile/helpers.js';
import {
	getPendingUpdateForMember,
	getSuggestChangeOptions,
	suggestChange,
	updateRepo
} from '$lib/server/gitlab.js';

import { adminFormSchema } from '$lib/schemas/members.js';

import { env } from '$env/dynamic/private';

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
		form: await superValidate(member, zod(adminFormSchema)),
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

		const form = await superValidate(request, zod(adminFormSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		// update member by returning a new member object
		const updatedMember = updateMember(member, form.data);

		if (profileDeepEqual(member, updatedMember)) {
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
			error(500, 'Something went wrong when updating your profile. Please try again later.');
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