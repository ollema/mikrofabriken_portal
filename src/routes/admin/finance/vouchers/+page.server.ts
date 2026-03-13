import { getCachedVouchers } from '$lib/server/fortnox/fortnox-cache';

export async function load() {
	const vouchers = await getCachedVouchers();
	return { vouchers };
}
