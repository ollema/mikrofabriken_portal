import type * as fortnoxTypes from '$lib/types/fortnox.js';
import { db } from '$lib/server/db/index.js';
import { fortnoxVoucher } from '$lib/server/db/schema.js';

/**
 * Replaces all vouchers in the cache with the given list.
 */
export function replaceAllVouchers(vouchers: Array<fortnoxTypes.Voucher>): void {
	console.log("Replacing all vouchers", vouchers.length);
	db.transaction((tx) => {
		tx.delete(fortnoxVoucher);
		for (const voucher of vouchers) {
			tx.insert(fortnoxVoucher).values({
				year: voucher.Year,
				voucherSeries: voucher.VoucherSeries,
				voucherNumber: voucher.VoucherNumber,
				data: voucher
			});
		}
	});
}

export async function getCachedVouchers(): Promise<Array<fortnoxTypes.Voucher>> {
	const rows = await db
		.select({ data: fortnoxVoucher.data })
		.from(fortnoxVoucher)
		.orderBy(
			fortnoxVoucher.year,
			fortnoxVoucher.voucherSeries,
			fortnoxVoucher.voucherNumber
		);
	return rows.map((row) => row.data);
}
