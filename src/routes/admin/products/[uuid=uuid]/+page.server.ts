import { getUser } from '$lib/server/auth.js';
import { getProduct } from '$lib/server/cog.js';

export async function load({ locals, params }) {
	getUser(locals);
	const product = await getProduct(params.uuid);

	return {
		product: product
	};
}
