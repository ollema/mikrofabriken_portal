import { getCachedVouchers } from '$lib/server/fortnox/voucher-cache.js';
import { getTotalsByCostCenter, sumAllResults } from '$lib/server/finance/results.js';
import { getCachedAccountDetails } from '$lib/server/fortnox/fortnox-util.js';

export async function load() {
	const vouchers = await getCachedVouchers();
	const accounts = await getCachedAccountDetails();
	const results = getTotalsByCostCenter(vouchers, accounts);
	const summedResults = sumAllResults(results);
	
	// Convert to array format for the table
	const budgetData = Array.from(summedResults.entries()).map(([costCenter, data]) => ({
		costCenter: costCenter || 'NONE',
		cost: data.cost,
		revenue: data.revenue,
		net: data.revenue - data.cost
	}));

	return { budgetData };
}

