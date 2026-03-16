import { and, eq, sql } from 'drizzle-orm';
import type * as fortnoxTypes from '$lib/types/fortnox.js';
import { db } from '$lib/server/db/index.js';
import { fortnoxAccount, fortnoxCustomer, fortnoxVoucher } from '$lib/server/db/schema.js';

//
// Account cache
//

export function replaceAllAccounts(accounts: Array<fortnoxTypes.Account>): void {
	db.transaction((tx) => {
		tx.delete(fortnoxAccount).run();
		const insert = tx
			.insert(fortnoxAccount)
			.values({
				year: sql.placeholder('year'),
				number: sql.placeholder('number'),
				data: sql.placeholder('data')
			})
			.prepare();
		for (const account of accounts) {
			insert.run({
				year: account.Year,
				number: account.Number,
				data: account
			});
		}
	});
}

export async function getCachedAccounts(): Promise<Array<fortnoxTypes.Account>> {
	const rows = await db
		.select({ data: fortnoxAccount.data })
		.from(fortnoxAccount)
		.orderBy(fortnoxAccount.year, fortnoxAccount.number);
	return rows.map((row) => row.data);
}

//
// Voucher cache
//

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

export async function getCachedVoucher(
	year: number,
	voucherSeries: string,
	voucherNumber: number
): Promise<fortnoxTypes.Voucher | undefined> {
	const rows = await db
		.select({ data: fortnoxVoucher.data })
		.from(fortnoxVoucher)
		.where(
			and(
				eq(fortnoxVoucher.year, year),
				eq(fortnoxVoucher.voucherSeries, voucherSeries),
				eq(fortnoxVoucher.voucherNumber, voucherNumber)
			)
		)
		.limit(1);
	return rows[0]?.data;
}

//
// Customer cache
//

export function replaceAllCustomers(customers: Array<fortnoxTypes.CustomerDetails>): void {
	db.transaction((tx) => {
		tx.delete(fortnoxCustomer).run();
		const insert = tx
			.insert(fortnoxCustomer)
			.values({
				organisationNumber: sql.placeholder('organisationNumber'),
				data: sql.placeholder('data')
			})
			.prepare();
		for (const customer of customers) {
			insert.run({
				organisationNumber: customer.OrganisationNumber,
				data: customer
			});
		}
	});
}

/**
 * Gets all cached customer details.
 * @returns A map of organisation numbers to customer details.
 */
export async function getCachedCustomers(): Promise<Map<string, fortnoxTypes.CustomerDetails>> {
	const rows = await db
		.select({ organisationNumber: fortnoxCustomer.organisationNumber, data: fortnoxCustomer.data })
		.from(fortnoxCustomer);
	return new Map(rows.map((row) => [row.organisationNumber, row.data]));
}

export async function getCachedCustomer(
	organisationNumber: string
): Promise<fortnoxTypes.CustomerDetails | undefined> {
	const rows = await db
		.select({ data: fortnoxCustomer.data })
		.from(fortnoxCustomer)
		.where(eq(fortnoxCustomer.organisationNumber, organisationNumber))
		.limit(1);
	return rows[0]?.data;
}
