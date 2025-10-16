import type { Member } from '$lib/types/members.js';
import { isAgreementActive, isCommissionActive } from '$lib/utils/member.js';
import { getCommittees } from '$lib/server/committees.js';
import { getAvatar } from '$lib/server/cog.js';
import type { Committee } from '$lib/types/committees';

const formatMember = (here: Record<string, boolean>) => async (member: Member) => {
	return {
		name: member.name,
		avatar: await getAvatar(member.crNumber),
		here: here[member.crNumber] || false,
		commissions: member.commissions.reduce((acc: Array<string>, commission) => {
			if (isCommissionActive(commission)) {
				acc.push(commission.type);
			}
			return acc;
		}, [] as Array<string>)
	};
};

export async function getFormattedMembers(members: Array<Member>, here: Record<string, boolean>) {
	const activeMembers = members.filter((member) => {
		let hasActiveMembership = false;
		let hasActivePassiveMembership = false;

		for (const agreement of member.agreements) {
			if (agreement.type === 'membership' && isAgreementActive(agreement)) {
				hasActiveMembership = true;
			}

			if (agreement.type === 'passive' && isAgreementActive(agreement)) {
				hasActivePassiveMembership = true;
			}
		}

		return hasActiveMembership && !hasActivePassiveMembership;
	});

	const sortedMembers = activeMembers.sort((a, b) => a.name.localeCompare(b.name));

	return Promise.all(sortedMembers.map(formatMember(here)));
}

export async function getFormattedMembersBasedOnCommissions(
	members: Array<Member>,
	here: Record<string, boolean>
) {
	const activeMembers = members.filter((member) => {
		let hasActiveMembership = false;
		let hasActivePassiveMembership = false;

		for (const agreement of member.agreements) {
			if (agreement.type === 'membership' && isAgreementActive(agreement)) {
				hasActiveMembership = true;
			}

			if (agreement.type === 'passive' && isAgreementActive(agreement)) {
				hasActivePassiveMembership = true;
			}
		}

		return hasActiveMembership && !hasActivePassiveMembership;
	});

	const committees = getCommittees();
	const sortedMembers = activeMembers.sort((a, b) => a.name.localeCompare(b.name));
	const commissionMembers: Record<string, Array<Member>> = {};

	for (const member of sortedMembers) {
		for (const commission of member.commissions) {
			if (isEntryActive(commission)) {
				if (!commissionMembers[commission.type]) {
					commissionMembers[commission.type] = [];
				}
				commissionMembers[commission.type].push(member);
			}
		}
	}


	const boardEntry = async (commission: string) => {
		return {
			label: commission,
			description: undefined,
			members: await Promise.all((commissionMembers[commission] ?? []).map(formatMember(here)))
		}
	}

	const groupEntry = async (commission: string) => {
		return {
			label: commission,
			description: undefined,
			members: await Promise.all((commissionMembers[commission] ?? []).map(formatMember(here)))
		}
	}

	const omkEntry = async (committee: Committee) => {
		return {
			label: committee.friendlyName,
			description: committee?.description,
			members: await Promise.all((commissionMembers[committee.name] ?? []).map(formatMember(here)))
		}
	}

	return {
		board: await Promise.all([
			boardEntry('board/chairman'),
			boardEntry('board/cashier'),
			boardEntry('board/secretary'),
			boardEntry('board/member'),
			boardEntry('board/alternate'),
		]),
		groups: await Promise.all([
			groupEntry('auditor/member'),
			groupEntry('nomination/member'),
			groupEntry('committee/economy'),
			groupEntry('committee/gate'),
			groupEntry('committee/it'),
			groupEntry('committee/pr'),
			groupEntry('committee/sponsorships'),
			groupEntry('admin/portal'),
		]),
		omks: await Promise.all(committees.map((committee) => omkEntry(committee))),
	};
}

function isEntryActive(entry: { startDate?: string; endDate?: string | undefined }) {
	const today = new Date();
	if (entry.startDate && new Date(entry.startDate) > today) {
		return false;
	}

	return !entry.endDate || new Date(entry.endDate) > today;
}
