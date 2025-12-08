import { create } from 'flat-cache';
import type * as fortnoxTypes from '$lib/types/fortnox.js';

// TODO: replace this with a peristent cache, e.g. using sqlite

const CACHE_DIR = 'cache';
const CACHE_KEY = 'accounts';
const CACHE_NAME = 'fortnox-accounts.json';

function getCache() {
	return create({
		cacheId: CACHE_NAME,
		cacheDir: CACHE_DIR
	});
}

/**
 * Replaces all vouchers in the cache with the given list.
 */
// eslint-disable-next-line @typescript-eslint/require-await
export async function replaceAllAccounts(accounts: Array<fortnoxTypes.Account>): Promise<void> {
	const cache = getCache();
	cache.set(CACHE_KEY, accounts);
	cache.save();
}

// eslint-disable-next-line @typescript-eslint/require-await
export async function getCachedAccounts(): Promise<Array<fortnoxTypes.Account>> {
	const cache = getCache();
	const value = cache.get<Array<fortnoxTypes.Account> | undefined>(CACHE_KEY);
	return value ?? [];
}
