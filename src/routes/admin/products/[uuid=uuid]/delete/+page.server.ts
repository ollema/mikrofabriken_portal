import { error, fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { redirect } from 'sveltekit-flash-message/server';
import { getToken, getUser } from '$lib/server/auth.js';
import { getProduct, deleteProduct } from '$lib/server/cog.js';
import { deleteProductFormSchema } from './schema.js';

export const load = async ({ locals, params }) => {
	getUser(locals);
	const product = await getProduct(params.uuid);
	if (!product) {
		error(404, 'Product not found');
	}

	return {
		form: await superValidate(product, zod(deleteProductFormSchema))
	};
};

export const actions = {
	default: async ({ locals, params, request, cookies }) => {
		getUser(locals);
		const token = getToken(locals);

		const form = await superValidate(request, zod(deleteProductFormSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			await deleteProduct(token, form.data.uuid);
		} catch (e) {
			console.log(e);
			error(500, 'Something went wrong. Check the logs and please try again later.');
		}

		redirect(
			302,
			`/admin/products/${params.uuid}`,
			{
				type: 'success',
				message: 'Product deleted successfully!'
			},
			cookies
		);
	}
};
