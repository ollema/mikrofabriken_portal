import { getUser } from '$lib/server/auth';
import { parseMemberList } from '$lib/server/members';
import type { ExtendedMember, Member } from '$lib/types/members';
import { isAgreementActive } from '$lib/helpers';

export const load = async ({ locals }) => {
	getUser(locals);
	const members = parseMemberList();
	const refinedMembers = members.map((member) => {
		return {
			...member,
			...getAgreementStatuses(member),
			...{ hasCompany: member.company !== null }
		} as ExtendedMember;
	});

	return {
		members: refinedMembers
	};
};

/**
 * Returns an object containing the agreement statuses of a member.
 * @param member - The member to check agreement statuses for.
 * @returns An object containing the agreement statuses of the member.
 */
function getAgreementStatuses(member: Member) {
	let hasActiveMembership = false;
	let hasActivePassiveMembership = false;
	let memberSince: string | false = false;
	let hasInvestment = false;
	let hasPallet = false;
	let hasAsylumInside = false;
	let hasAsylumOutside = false;

	// single pass over agreements to check for membership type and various agreements
	for (const agreement of member.agreements) {
		if (agreement.type === 'membership' && isAgreementActive(agreement)) {
			hasActiveMembership = true;
			memberSince = agreement.startDate;
		}

		if (agreement.type === 'passive' && isAgreementActive(agreement)) {
			hasActivePassiveMembership = true;
		}

		if (agreement.type === 'investment' && isAgreementActive(agreement)) {
			hasInvestment = true;
		}

		if (
			agreement.type === 'palletInside' ||
			(agreement.type === 'palletOutside' && isAgreementActive(agreement))
		) {
			hasPallet = true;
		}

		if (agreement.type === 'asylumInside' && isAgreementActive(agreement)) {
			hasAsylumInside = true;
		}

		if (agreement.type === 'asylumOutside' && isAgreementActive(agreement)) {
			hasAsylumOutside = true;
		}
	}
	return {
		membership: hasActivePassiveMembership ? 'passive' : hasActiveMembership ? 'active' : 'none',
		memberSince: memberSince ? memberSince : null,
		hasInvestment,
		hasPallet,
		hasAsylumInside,
		hasAsylumOutside
	};
}
