import { fortnox } from '$lib/server/fortnox/fortnox.js';

export async function load({ url }) {
	const vouchers = await fortnox.getVouchersThisYear();
	return { vouchers };
}

