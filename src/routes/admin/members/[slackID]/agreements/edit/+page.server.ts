import { error, fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { redirect } from 'sveltekit-flash-message/server';
import { z } from 'zod';
import { getUser } from '$lib/server/auth.js';
import { areMembersEqual, findMember, getMember, getMembers } from '$lib/server/members.js';
import { agreementsFormSchema } from './schema.js';
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

	return {
		form: await superValidate(populateFromCurrent(member), zod(agreementsFormSchema)),
		pending: pending,
		member: member
	};
};

export const actions = {
	default: async ({ locals, params, request, cookies }) => {
		const user = getUser(locals);
		await updateRepo(env.UFDATA_REPO_PATH);
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

		const form = await superValidate(request, zod(agreementsFormSchema));
		if (!form.valid) {
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

function populateFromCurrent(member: Member): z.infer<typeof agreementsFormSchema> {
	const agreements = member.agreements;

	const memberships: z.infer<typeof agreementsFormSchema>['memberships'] = [];
	const asylums: z.infer<typeof agreementsFormSchema>['asylums'] = [];
	const pallets: z.infer<typeof agreementsFormSchema>['pallets'] = [];

	agreements.forEach((agreement) => {
		if (agreement.type === 'membership') {
			memberships.push({
				type: 'membership' as const,
				startDate: agreement.startDate,
				endDate: agreement.endDate
			});
		} else if (agreement.type === 'investment') {
			memberships.push({
				type: 'investment' as const,
				startDate: agreement.startDate,
				endDate: agreement.endDate
			});
		} else if (agreement.type === 'passive') {
			memberships.push({
				type: 'passive' as const,
				startDate: agreement.startDate,
				endDate: agreement.endDate
			});
		} else if (agreement.type === 'asylumInside') {
			if (agreement.attributes?.size !== undefined) {
				asylums.push({
					type: 'asylumInside' as const,
					startDate: agreement.startDate,
					size: agreement.attributes.size,
					endDate: agreement.endDate
				});
			} else {
				throw new Error('AsylumInside agreement is missing size');
			}
		} else if (agreement.type === 'asylumOutside') {
			if (agreement.attributes?.size !== undefined) {
				asylums.push({
					type: 'asylumOutside' as const,
					startDate: agreement.startDate,
					size: agreement.attributes.size,
					endDate: agreement.endDate
				});
			} else {
				throw new Error('AsylumOutside agreement is missing size');
			}
		} else if (agreement.type === 'palletInside') {
			if (
				agreement.attributes?.palletCount !== undefined &&
				agreement.attributes.palletIds !== undefined
			) {
				pallets.push({
					type: 'palletInside' as const,
					startDate: agreement.startDate,
					palletCount: agreement.attributes.palletCount,
					palletIds: agreement.attributes.palletIds,
					endDate: agreement.endDate
				});
			} else {
				throw new Error('PalletInside agreement is missing palletCount or palletIds');
			}
		} else if (agreement.type === 'palletOutside') {
			if (
				agreement.attributes?.palletCount !== undefined &&
				agreement.attributes.palletIds !== undefined
			) {
				pallets.push({
					type: 'palletOutside' as const,
					startDate: agreement.startDate,
					palletCount: agreement.attributes.palletCount,
					palletIds: agreement.attributes.palletIds,
					endDate: agreement.endDate
				});
			} else {
				throw new Error('PalletOutside agreement is missing palletCount or palletIds');
			}
		} else {
			throw new Error('Unknown agreement type');
		}
	});

	return {
		memberships: memberships,
		asylums: asylums,
		pallets: pallets
	};
}

function updateMember(member: Member, data: z.infer<typeof agreementsFormSchema>): Member {
	const updatedAgreements = [
		...data.memberships.map((membership) => ({
			type: membership.type,
			startDate: membership.startDate,
			endDate: membership.endDate
		})),
		...data.asylums.map((asylum) => ({
			type: asylum.type,
			startDate: asylum.startDate,
			endDate: asylum.endDate,
			attributes: {
				size: asylum.size
			}
		})),
		...data.pallets.map((pallet) => ({
			type: pallet.type,
			startDate: pallet.startDate,
			endDate: pallet.endDate,
			attributes: {
				palletCount: pallet.palletCount,
				palletIds: pallet.palletIds
			}
		}))
	];

	updatedAgreements.sort((a, b) => {
		const dateA = parseDate(a.startDate);
		const dateB = parseDate(b.startDate);
		return dateA.compare(dateB);
	});

	const suggestedMember = {
		...member,
		agreements: updatedAgreements
	};

	return suggestedMember;
}

function updateMembersInPlace(member: Member, updatedMember: Member) {
	member.agreements = updatedMember.agreements;
}
