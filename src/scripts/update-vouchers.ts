import { FortnoxApi } from '$lib/server/fortnox/fortnox-api.js';
import { getFullVouchersForCurrentYear } from '$lib/server/fortnox/fortnox-util.js';
import { getResultsForCurrentYear, sumResults, type CostAndRevenue } from '$lib/server/finance/results.js';

//
// Fortnox API access
//

const BASE_URL = 'https://fnp.mikrofabriken.se/proxy/3' as const;
// Using '$env/dynamic/private' fails when run from vite-node,
// so we use process.env instead.
const FNP_KEY = process.env.FNP_KEY;

function getFortnox() {
	if (FNP_KEY) {
		return new FortnoxApi(BASE_URL, FNP_KEY);
	}
    console.error("FNP_KEY is not set");
    process.exit(1);
}

//
// Process results
//

async function printResults(results: Record<string, CostAndRevenue>) {
    for (const costCenter in results) {
        const costCenterName = (costCenter || "NONE").padEnd(15);
        const cost = results[costCenter].cost.toFixed(2).padStart(12);
        const revenue = results[costCenter].revenue.toFixed(2).padStart(12);
        console.log(`${costCenterName}${cost}${revenue}`);
    }
}

//
// Main
//

const fortnox = getFortnox();

const vouchers = await Array.fromAsync(getFullVouchersForCurrentYear(fortnox));

const results = await getResultsForCurrentYear(vouchers);
console.log(results);

const summedResults = await sumResults(results);
printResults(summedResults);