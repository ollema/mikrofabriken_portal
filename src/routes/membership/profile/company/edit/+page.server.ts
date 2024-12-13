import { error, fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { redirect } from 'sveltekit-flash-message/server';
import { z } from 'zod';
import { getUser } from '$lib/server/auth.js';
import { getMember, parseMemberList } from '$lib/server/members.js';
import { companyFormSchema } from './schema.js';
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

	const pending = await getPendingUpdateForMember(member.crNumber).then(({ members }) => {
		return {
			member: members && getMember(members, member.slackID)
		};
	});

	member = pending.member || member;

	return {
		form: await superValidate(populateFromCurrent(member), zod(companyFormSchema)),
		pending: pending
	};
};

export const actions = {
	edit: async ({ locals, url, request, cookies }) => {
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

		const form = await superValidate(request, zod(companyFormSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		// update member by returning a new member object
		const updatedMember = updateMember(member, form.data);

		if (companyDeepEqual(member, updatedMember)) {
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
			error(500, 'Something went wrong when updating your company. Please try again later.');
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
	},

	delete: async ({ locals, url, cookies }) => {
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

		const options = getSuggestChangeOptions(member, undefined, pending.sourceBranch);

		const updatedMember = {
			...member,
			company: undefined
		};

		if (companyDeepEqual(member, updatedMember)) {
			redirect(302, redirectUrl, { type: 'warning', message: 'No changes detected!' }, cookies);
		}

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
	return member.company;
}

function updateMember(member: Member, data: z.infer<typeof companyFormSchema>): Member {
	const suggestedMember = {
		...member,
		company: data
	};

	return suggestedMember;
}

function arrayEquals(a: string[], b: string[]) {
	return a.length === b.length && a.every((v, i) => v === b[i]);
}

function companyDeepEqual(a: Member, b: Member) {
	return (
		a.company !== undefined &&
		b.company !== undefined &&
		a.company.name === b.company.name &&
		a.company.postalAdress === b.company.postalAdress &&
		a.company.postalCode === b.company.postalCode &&
		a.company.postalCity === b.company.postalCity &&
		a.company.email === b.company.email &&
		a.company.orgNum === b.company.orgNum &&
		a.company?.invoiceDefaultTo === b.company?.invoiceDefaultTo &&
		arrayEquals(
			a.company?.invoiceExcludeCategoriesFromDefault ?? [],
			b.company?.invoiceExcludeCategoriesFromDefault ?? []
		)
	);
}

function updateMembersInPlace(member: Member, updatedMember: Member) {
	if (!updatedMember.company) {
		member.company = undefined;
	} else {
		member.company = updatedMember.company;
	}
}
