import { getUser } from '$lib/server/auth';
import { getProduct } from '$lib/server/cog';

export async function load({ locals, params }) {
	getUser(locals);
	const product = await getProduct(params.uuid);

	return {
		product: product
	};
}
