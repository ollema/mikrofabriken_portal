import { getCachedVouchers } from '$lib/server/fortnox/voucher-cache.js';

export async function load() {
	const vouchers = await getCachedVouchers();
	return { vouchers };
}
