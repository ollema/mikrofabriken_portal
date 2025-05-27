import type { ExtendedMember, Member } from '$lib/types/members.js';
import { getUser } from '$lib/server/auth.js';
import { getMembers } from '$lib/server/members.js';
import { isAgreementActive } from '$lib/utils/member.js';

export const load = ({ locals }) => {
	getUser(locals);
	const members = getMembers();
	const refinedMembers = members.map((member) => {
		return {
			...member,
			...getExtendedMemberProperties(member)
		} as ExtendedMember;
	});

	return {
		members: refinedMembers
	};
};

function getExtendedMemberProperties(member: Member) {
	let hasActiveMembership = false;
	let hasActivePassiveMembership = false;
	let memberSince: string | false = false;
	let hasInvestment = false;
	let hasPallet = false;
	let hasAsylumInside = false;
	let hasAsylumOutside = false;
	let hasCompany = false;

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
			(agreement.type === 'palletInside' || agreement.type === 'palletOutside') &&
			isAgreementActive(agreement)
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

	hasCompany = member.company !== undefined;

	return {
		membership: hasActivePassiveMembership ? 'passive' : hasActiveMembership ? 'active' : 'none',
		memberSince: memberSince ? memberSince : null,
		hasInvestment: hasInvestment.toString(),
		hasPallet: hasPallet.toString(),
		hasAsylumInside: hasAsylumInside.toString(),
		hasAsylumOutside: hasAsylumOutside.toString(),
		hasCompany: hasCompany.toString()
	};
}
