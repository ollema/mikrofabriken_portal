import type { OmkBudgetRow } from './columns.js';
import { getCachedVouchers } from '$lib/server/fortnox/fortnox-cache.js';
import { getTotalsByCostCenter, sumAllResults } from '$lib/server/finance/results.js';
import { getCachedAccountDetails } from '$lib/server/fortnox/fortnox-util.js';
import { getCommittees } from '$lib/server/committees.js';

export async function load(): Promise<{ currentYear: number; budgetData: Array<OmkBudgetRow> }> {
	const vouchers = await getCachedVouchers();
	const accounts = await getCachedAccountDetails();

	const currentYear = new Date().getFullYear();

	// Get results for current year
	const results = getTotalsByCostCenter(vouchers, accounts);
	const summedResults = sumAllResults(results);
	console.log(summedResults);

	// Get committees with a cost center
	const committees = getCommittees();
	const committeesWithCostCenter = committees.filter((committee) => !!committee.costCenter);

	// Create data rows
	const budgetData: Array<OmkBudgetRow> = committeesWithCostCenter.map((committee) => {
		const budgetThisYear = committee.budget?.find((b) => b.budgetYear === currentYear);
		const costCenter = committee.costCenter!;
		const results = summedResults.get(costCenter);
		const netResult = results ? results.revenue - results.cost : 0;
		const investmentBudget = budgetThisYear?.investment ?? 0;
		const expenditureBudget = budgetThisYear?.expenditure ?? 0;
		const budgetLeft = expenditureBudget + netResult;

		return {
			committee: committee.friendlyName,
			costCenter: costCenter,
			investmentBudget,
			expenditureBudget,
			netResult,
			budgetLeft
		};
	});

	return { currentYear, budgetData };
}
