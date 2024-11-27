import { getUser } from '$lib/server/auth.js';
import { getProducts } from '$lib/server/cog.js';

export async function load({ locals }) {
	getUser(locals);

	const products = await getProducts();

	return {
		products: products
	};
}
