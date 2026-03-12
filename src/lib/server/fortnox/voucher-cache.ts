import { sql } from 'drizzle-orm';
import type * as fortnoxTypes from '$lib/types/fortnox.js';
import { db } from '$lib/server/db/index.js';
import { fortnoxVoucher } from '$lib/server/db/schema.js';

/**
 * Replaces all vouchers in the cache with the given list.
 * Uses a prepared statement inside a transaction for performance.
 */
export function replaceAllVouchers(vouchers: Array<fortnoxTypes.Voucher>): void {
	db.transaction((tx) => {
		tx.delete(fortnoxVoucher).run();
		const insert = tx
			.insert(fortnoxVoucher)
			.values({
				year: sql.placeholder('year'),
				voucherSeries: sql.placeholder('voucherSeries'),
				voucherNumber: sql.placeholder('voucherNumber'),
				data: sql.placeholder('data')
			})
			.prepare();
		for (const voucher of vouchers) {
			insert.run({
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
		.orderBy(fortnoxVoucher.year, fortnoxVoucher.voucherSeries, fortnoxVoucher.voucherNumber);
	return rows.map((row) => row.data);
}
