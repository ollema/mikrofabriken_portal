import { error, fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { redirect } from 'sveltekit-flash-message/server';
import { z } from 'zod';
import { getUser } from '$lib/server/auth.js';
import { areMembersEqual, findMember, getMember, getMembers } from '$lib/server/members.js';
import { getValidCommissions } from '$lib/server/enums.js';
import { commissionsFormSchema } from './schema.js';
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
	let member = getMember(params.slackID);

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

	const validCommissions = getValidCommissions();

	return {
		form: await superValidate(populateFromCurrent(member), zod(commissionsFormSchema)),
		pending: pending,
		member: member,
		validCommissions: validCommissions
	};
};

export const actions = {
	default: async ({ locals, params, request, cookies }) => {
		const user = getUser(locals);
		await updateRepo(env.UFPERSONSLIST_REPO_PATH);
		let members = getMembers();
		let member = findMember(members, params.slackID);
		const admin = findMember(members, user.slackID);
		const redirectUrl = `/admin/members/${member.slackID}`;

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

		const form = await superValidate(request, zod(commissionsFormSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		// TODO: let's break this out into a separate validation function
		// which will also valiate other dynamic enum fields
		// validate commissions
		const validCommissions = getValidCommissions();
		const invalidCommissions = form.data.commissions.filter(
			(commission) => !validCommissions.includes(commission.type)
		);
		if (invalidCommissions.length > 0) {
			console.log('invalidCommissions', invalidCommissions);
			return fail(400, { form });
		}

		// update member by returning a new member object
		const updatedMember = updateMember(member, form.data);

		if (areMembersEqual(member, updatedMember)) {
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

function populateFromCurrent(member: Member): z.infer<typeof commissionsFormSchema> {
	return {
		commissions: member.commissions
	};
}

function updateMember(member: Member, data: z.infer<typeof commissionsFormSchema>): Member {
	const updatedCommissions = [
		...data.commissions.map((commission) => {
			return {
				type: commission.type,
				startDate: commission.startDate,
				endDate: commission.endDate
			};
		})
	];

	updatedCommissions.sort((a, b) => {
		const dateA = parseDate(a.startDate);
		const dateB = parseDate(b.startDate);
		return dateA.compare(dateB);
	});

	const suggestedMember = {
		...member,
		commissions: updatedCommissions
	};

	return suggestedMember;
}

function updateMembersInPlace(member: Member, updatedMember: Member) {
	member.commissions = updatedMember.commissions;
}
