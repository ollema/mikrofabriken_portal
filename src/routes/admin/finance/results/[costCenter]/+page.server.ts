import { error } from '@sveltejs/kit';
import { accountResult, keepResultAccounts, sumAllAccounts } from '$lib/server/finance/results.js';
import { getTotalsByCostCenterForCurrentYear } from '$lib/server/fortnox/fortnox-util.js';

export async function load({ params }: { params: { costCenter: string } }) {
	const costCenter = params.costCenter === 'NONE' ? '' : params.costCenter;

	const results = await getTotalsByCostCenterForCurrentYear();
	const costCenterTotals = results.get(costCenter);
	if (!costCenterTotals) {
		error(404, `Kostnadsställe "${params.costCenter}" hittades inte`);
	}
	const costCenterResults = keepResultAccounts(costCenterTotals);
	const costAndRevenue = sumAllAccounts(costCenterResults);

	// Filter to only show costs and revenue accounts, then convert to array format
	const accountBreakdown = Array.from(costCenterResults.values())
		.map((total) => {
			const result = accountResult(total);
			return {
				account: total.account,
				debit: total.debit,
				credit: total.credit,
				net: result.revenue - result.cost
			};
		})
		.sort((a, b) => a.account.number - b.account.number);

	return {
		costCenter: params.costCenter,
		accountBreakdown,
		costAndRevenue
	};
}
