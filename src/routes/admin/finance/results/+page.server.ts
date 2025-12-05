import { getCachedVouchers } from '$lib/server/fortnox/voucher-cache.js';
import { getTotalsByCostCenter, sumAllResults } from '$lib/server/finance/results.js';
import { getCachedAccountDetails } from '$lib/server/fortnox/fortnox-util.js';
import { getCommittees } from '$lib/server/committees.js';
import type { BudgetRow } from './columns.js';

export async function load() {
	const vouchers = await getCachedVouchers();
	const accounts = await getCachedAccountDetails();
	const results = getTotalsByCostCenter(vouchers, accounts);
	const summedResults = sumAllResults(results);
	
	const committees = getCommittees();
	const costCenterToCommittee = new Map(
		committees.map((committee) => [committee.costCenter, committee])
	);

	// Convert to array format for the table
	const budgetData: BudgetRow[] = Array.from(summedResults.entries()).map(([costCenter, data]) => ({
		committee: costCenterToCommittee.get(costCenter),
		costCenter: costCenter || 'NONE',
		cost: data.cost,
		revenue: data.revenue,
		net: data.revenue - data.cost
	}));

	return { budgetData };
}

