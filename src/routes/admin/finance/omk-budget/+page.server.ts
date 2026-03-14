import type { OmkBudgetRow } from './columns.js';
import { getCommittees } from '$lib/server/committees.js';
import { getTotalsByCostCenterForCurrentYear } from '$lib/server/fortnox/fortnox-util.js';
import { sumAllResults } from '$lib/server/finance/results.js';

export async function load(): Promise<{ currentYear: number; budgetData: Array<OmkBudgetRow> }> {
	const currentYear = new Date().getFullYear();

	// Get results for current year
	const results = await getTotalsByCostCenterForCurrentYear();
	const summedResults = sumAllResults(results);

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
