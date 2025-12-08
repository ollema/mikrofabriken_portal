import { FortnoxApi } from '$lib/server/fortnox/fortnox-api.js';
import { getFullVouchersForCurrentYear } from '$lib/server/fortnox/fortnox-util.js';
import { replaceAllVouchers } from '$lib/server/fortnox/voucher-cache';

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
	console.error('FNP_KEY is not set');
	process.exit(1);
}

//
// Fortnox cache
//

async function updateFortnoxCache() {
	const fortnox = getFortnox();
	const vouchers = await Array.fromAsync(getFullVouchersForCurrentYear(fortnox));
	await replaceAllVouchers(vouchers);
}

//
// Main
//

await updateFortnoxCache();
