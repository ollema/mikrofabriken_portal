import { fortnox } from '$lib/server/fortnox.js';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
	try {
		const series = params.series;
		const voucherNumber = parseInt(params.voucherNumber);
		
		const voucher = await fortnox.getVoucher(series, voucherNumber);
		
		return {
			voucher
		};
	} catch (e) {
		error(404, `Could not find voucher ${params.series}/${params.voucherNumber}`);
	}
}

