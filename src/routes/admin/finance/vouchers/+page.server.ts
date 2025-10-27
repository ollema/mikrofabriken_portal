import { getVouchersThisYear } from '$lib/server/fortnox.js';

export async function load({ url }) {
	const vouchers = await getVouchersThisYear();
	return { vouchers };
}

