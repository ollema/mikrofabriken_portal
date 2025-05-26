import { error, json } from '@sveltejs/kit';
import type { Product } from '$lib/types/cog.js';
import { getUser } from '$lib/server/auth.js';
import { getProductByEan } from '$lib/server/cog.js';

export async function GET({ locals, params }) {
	try {
		getUser(locals);
		const product: Product | null = await getProductByEan(params.ean);
		return json(product, { status: 200 });
	} catch (e) {
		console.error(e);
		error(404, 'could not find product');
	}
}
