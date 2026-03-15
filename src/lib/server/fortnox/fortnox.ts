import { FortnoxApi } from './fortnox-api';
import { env } from '$env/dynamic/private';

/**
 * The base URL for the Fortnox API.
 */
export const BASE_URL = 'https://fnp.mikrofabriken.se/proxy/3' as const;

export const fortnox = new FortnoxApi(BASE_URL, env.FNP_KEY);
