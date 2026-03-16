import type { ExtendedMember, Member } from '$lib/types/members.js';
import type { CustomerDetails } from '$lib/types/fortnox.js';
import { getUser } from '$lib/server/auth.js';
import { getMembers } from '$lib/server/members.js';
import { isAgreementActive } from '$lib/utils/member.js';
import { getCachedCustomers } from '$lib/server/fortnox/fortnox-cache.js';
import { isEInvoiceEnabled } from '$lib/server/fortnox/fortnox-util.js';

export const load = async ({ locals }) => {
	getUser(locals);
	const members = getMembers();
	const customers = await getCachedCustomers();

	const refinedMembers = members.map((member) => {
		return {
			...member,
			...getExtendedMemberProperties(member),
			...getCustomerProperties(member, customers)
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

	const hasCompany = member.company !== undefined;

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

function getCustomerProperties(
	member: Member,
	customers: Map<string, CustomerDetails>
): { hasEInvoice: string; hasCompanyEInvoice: string } {
	const customer = customers.get(member.crNumber);
	const hasEInvoice = customer ? isEInvoiceEnabled(customer) : false;
	const companyOrgNumber = member.company?.orgNum;
	const companyCustomer = companyOrgNumber ? customers.get(companyOrgNumber) : undefined;
	const hasCompanyEInvoice = companyCustomer ? isEInvoiceEnabled(companyCustomer) : false;
	return {
		hasEInvoice: hasEInvoice.toString(),
		hasCompanyEInvoice: hasCompanyEInvoice.toString()
	};
}
