import { error, fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { redirect } from 'sveltekit-flash-message/server';
import { profileFormSchema } from './schema.js';
import type { z } from 'zod';
import type { Member } from '$lib/types/members.js';
import { getUser } from '$lib/server/auth.js';
import { areMembersEqual, findMember, getMember, getMembers } from '$lib/server/members.js';
import {
	getPendingUpdateForMember,
	getSuggestChangeOptions,
	suggestChange,
	updateRepo
} from '$lib/server/gitlab.js';
import { env } from '$env/dynamic/private';

export const load = async ({ locals, url }) => {
	const user = getUser(locals, url);
	let member = getMember(user.slackID);

	const pending = await getPendingUpdateForMember(member.crNumber).then(({ members }) => {
		return {
			member: members && findMember(members, member.slackID)
		};
	});

	member = pending.member || member;

	return {
		form: await superValidate(populateFromCurrent(member), zod(profileFormSchema)),
		pending: pending
	};
};

export const actions = {
	default: async ({ locals, url, request, cookies }) => {
		const user = getUser(locals, url);
		await updateRepo(env.UFDATA_REPO_PATH);
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

		const form = await superValidate(request, zod(profileFormSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		// update member by returning a new member object
		const updatedMember = updateMember(member, form.data);

		if (areMembersEqual(member, updatedMember)) {
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

function populateFromCurrent(member: Member) {
	return member;
}

function updateMember(member: Member, data: z.infer<typeof profileFormSchema>): Member {
	const suggestedMember = {
		...member,
		...data
	};

	return suggestedMember;
}

function updateMembersInPlace(member: Member, updatedMember: Member) {
	member.name = updatedMember.name;
	member.postalAdress = updatedMember.postalAdress;
	member.postalCode = updatedMember.postalCode;
	member.postalCity = updatedMember.postalCity;
	member.email = updatedMember.email;
	member.phone = updatedMember.phone;
}
