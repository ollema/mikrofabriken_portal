import { create } from 'flat-cache';
import type * as fortnoxTypes from '$lib/types/fortnox.js';

const CACHE_DIR = 'cache';
const CACHE_KEY = 'vouchers';
const CACHE_NAME = 'fortnox-vouchers.json';

function getCache() {
	return create({
		cacheId: CACHE_NAME,
		cacheDir: CACHE_DIR
	});
}

/**
 * Replaces all vouchers in the cache with the given list.
 */
export async function replaceAllVouchers(vouchers: Array<fortnoxTypes.Voucher>): Promise<void> {
	const cache = getCache();
	cache.setKey(CACHE_KEY, vouchers);
	cache.save();
}

export async function getCachedVouchers(): Promise<Array<fortnoxTypes.Voucher>> {
	const cache = getCache();
	return (cache.getKey(CACHE_KEY) ?? []);
}
