import { create } from 'flat-cache';
import type * as fortnoxTypes from '$lib/types/fortnox.js';

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
export async function replaceAllAccounts(accounts: Array<fortnoxTypes.Account>): Promise<void> {
	const cache = getCache();
	cache.setKey(CACHE_KEY, accounts);
	cache.save();
}

export async function getCachedAccounts(): Promise<Array<fortnoxTypes.Account>> {
	const cache = getCache();
	return (cache.getKey(CACHE_KEY) ?? []);
}
