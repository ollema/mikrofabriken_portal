import { error, fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { redirect } from 'sveltekit-flash-message/server';
import { z } from 'zod';
import { getUser } from '$lib/server/auth.js';
import { getMember, parseMemberList } from '$lib/server/members.js';
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
	const members = parseMemberList();
	let member = getMember(members, params.slackID);

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
		form: await superValidate(populateFromCurrent(member), zod(commissionsFormSchema)),
		pending: pending,
		member: member
	};
};

export const actions = {
	default: async ({ locals, params, request, cookies }) => {
		const user = getUser(locals);
		await updateRepo(env.UFPERSONSLIST_REPO_PATH);
		let members = parseMemberList();
		let member = getMember(members, params.slackID);
		const admin = getMember(members, user.slackID);
		const redirectUrl = `/admin/members/${member.slackID}`;

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

		const form = await superValidate(request, zod(commissionsFormSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		// update member by returning a new member object
		const updatedMember = updateMember(member, form.data);

		if (agreementsDeepEqual(member, updatedMember)) {
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

function agreementsDeepEqual(a: Member, b: Member) {
	return (
		a.commissions.length === b.commissions.length &&
		a.commissions.every((commission, index) => {
			const otherCommission = b.commissions[index];
			if (commission.type !== otherCommission.type) {
				return false;
			}

			if (commission.startDate !== otherCommission.startDate) {
				return false;
			}

			if (commission.endDate !== otherCommission.endDate) {
				return false;
			}

			return true;
		})
	);
}

function updateMembersInPlace(member: Member, updatedMember: Member) {
	member.commissions = updatedMember.commissions;
}
