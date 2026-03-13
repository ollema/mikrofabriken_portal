import { error } from '@sveltejs/kit';
import { getCachedVoucher } from '$lib/server/fortnox/fortnox-cache.js';

export async function load({
	params
}: {
	params: { financialYear: number; series: string; voucherNumber: number };
}) {
	const financialYear = params.financialYear;
	const series = params.series;
	const voucherNumber = params.voucherNumber;

	const voucher = await getCachedVoucher(financialYear, series, voucherNumber);
	if (!voucher) {
		error(404, `Could not find voucher ${params.series}/${params.voucherNumber}`);
	}

	return {
		voucher
	};
}
