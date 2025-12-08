import { error } from '@sveltejs/kit';
import { getFormattedMembersBasedOnCommissions } from '../../utils.js';
import { getUser } from '$lib/server/auth.js';
import { getMembers } from '$lib/server/members.js';
import { getPresentMembers } from '$lib/utils/cog.js';
import { findCommittee, getCommittees } from '$lib/server/committees.js';
import { getCachedVouchers } from '$lib/server/fortnox/voucher-cache.js';
import { getNetResultForCostCenter } from '$lib/server/finance/results.js';
import { getCachedAccountDetails } from '$lib/server/fortnox/fortnox-util.js';

export const load = async ({
	locals,
	url,
	params
}: {
	locals: any;
	url: URL;
	params: { name: string | Array<string> };
}) => {
	getUser(locals, url);

	// Handle catch-all parameter - it might be a string or array depending on SvelteKit version
	const committeeName = Array.isArray(params.name) ? params.name.join('/') : params.name;

	const committees = getCommittees();
	const committee = findCommittee(committees, committeeName);

	// Verify this is an OMK (workshop/*)
	if (!committee.name.startsWith('workshop/')) {
		error(404, `Committee "${committeeName}" is not an OMK`);
	}

	const members = getMembers();
	const here = await getPresentMembers();

	const { omks } = await getFormattedMembersBasedOnCommissions(members, here);
	const omk = omks.find((omk) => omk.name === committeeName);

	const thisYear = new Date().getFullYear();
	const budgetThisYear =
		committee.budget && committee.budget.find((budget) => budget.budgetYear === thisYear);

	// Calculate net result for this year
	let netResultThisYear = 0;
	if (committee.costCenter) {
		const vouchers = await getCachedVouchers();
		const accounts = await getCachedAccountDetails();
		netResultThisYear = getNetResultForCostCenter(vouchers, accounts, committee.costCenter);
	}

	let budgetLeftThisYear: number | null = null;
	if (budgetThisYear && netResultThisYear !== null) {
		budgetLeftThisYear = budgetThisYear.expenditure + netResultThisYear;
	}

	if (!omk) {
		error(404, `OMK "${committeeName}" not found`);
	}

	return {
		committee,
		members: omk.members,
		budgetThisYear,
		netResultThisYear,
		budgetLeftThisYear
	};
};
