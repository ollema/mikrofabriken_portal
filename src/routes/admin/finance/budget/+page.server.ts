import { getCachedVouchers } from '$lib/server/fortnox/voucher-cache.js';
import { getResultsForCurrentYear, sumResults } from '$lib/server/finance/results.js';

export async function load() {
	const vouchers = await getCachedVouchers();
	const results = await getResultsForCurrentYear(vouchers);
	const summedResults = await sumResults(results);
	
	// Convert to array format for the table
	const budgetData = Object.entries(summedResults).map(([costCenter, data]) => ({
		costCenter: costCenter || 'NONE',
		cost: data.cost,
		revenue: data.revenue,
		net: data.revenue - data.cost
	}));

	return { budgetData };
}

