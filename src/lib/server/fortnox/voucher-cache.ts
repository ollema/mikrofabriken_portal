import type * as fortnoxTypes from '$lib/types/fortnox.js';
import { db } from '$lib/server/db/index.js';
import { fortnoxVoucher } from '$lib/server/db/schema.js';

/**
 * Replaces all vouchers in the cache with the given list.
 */
export async function replaceAllVouchers(vouchers: Array<fortnoxTypes.Voucher>): Promise<void> {
	db.transaction((tx) => {
		tx.delete(fortnoxVoucher);
		if (vouchers.length > 0) {
			tx.insert(fortnoxVoucher).values(
				vouchers.map((voucher) => ({
					year: voucher.Year,
					voucherSeries: voucher.VoucherSeries,
					voucherNumber: voucher.VoucherNumber,
					data: voucher
				}))
			);
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
