import { sql } from 'drizzle-orm';
import type * as fortnoxTypes from '$lib/types/fortnox.js';
import { db } from '$lib/server/db/index.js';
import { fortnoxAccount } from '$lib/server/db/schema.js';

/**
 * Replaces all accounts in the cache with the given list.
 * Uses a prepared statement inside a transaction for performance.
 */
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
