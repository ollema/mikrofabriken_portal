import type * as fortnoxTypes from '$lib/types/fortnox.js';
import { db } from '$lib/server/db/index.js';
import { fortnoxAccount } from '$lib/server/db/schema.js';

/**
 * Replaces all accounts in the cache with the given list.
 */
export function replaceAllAccounts(accounts: Array<fortnoxTypes.Account>): void {
	db.transaction((tx) => {
		tx.delete(fortnoxAccount);
		if (accounts.length > 0) {
			tx.insert(fortnoxAccount).values(
				accounts.map((account) => ({
					year: account.Year,
					number: account.Number,
					data: account
				}))
			);
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
