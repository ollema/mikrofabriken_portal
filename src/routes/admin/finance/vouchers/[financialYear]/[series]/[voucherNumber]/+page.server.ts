import { error } from '@sveltejs/kit';
import { fortnox } from '$lib/server/fortnox/fortnox.js';

export async function load({
	params
}: {
	params: { financialYear: number; series: string; voucherNumber: number };
}) {
	try {
		const financialYear = params.financialYear;
		const series = params.series;
		const voucherNumber = params.voucherNumber;

		// TODO: Get voucher from cache instead of Fortnox API?
		const voucher = await fortnox.getVoucher(financialYear, series, voucherNumber);

		return {
			voucher
		};
	} catch (e) {
		error(404, `Could not find voucher ${params.series}/${params.voucherNumber}`);
	}
}
