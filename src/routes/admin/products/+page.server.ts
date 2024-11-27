import { getUser } from '$lib/server/auth.js';
import { getProducts } from '$lib/server/cog.js';
import { streamSlow } from '$lib/server/stream.js';

export async function load({ locals }) {
	getUser(locals);

	const products = getProducts();

	return {
		products: (await streamSlow(products, 400)) || products
	};
}
