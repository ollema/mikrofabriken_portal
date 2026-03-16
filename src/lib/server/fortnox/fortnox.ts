import { FortnoxApi } from './fortnox-api';
import { env } from '$env/dynamic/private';

/**
 * The base URL for the Fortnox API.
 *
 * TODO: this shouldn't be exported. Instead, FortnoxApi should be used everywhere
 */
export const BASE_URL = 'https://fnp.mikrofabriken.se/proxy/3' as const;

function createFortnoxApi() {
	const fnpKey = env.FNP_KEY;
	return new FortnoxApi(BASE_URL, fnpKey);
}

export const fortnox = createFortnoxApi();
