import { error, fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { redirect } from 'sveltekit-flash-message/server';
import { productFormSchema } from './schema.js';
import { getToken, getUser } from '$lib/server/auth.js';
import {
	getBillingCategories,
	getProduct,
	getProductCategories,
	getUnitNames,
	getVatPercentages,
	updateProduct
} from '$lib/server/cog.js';
import { ProductSchema } from '$lib/schemas/cog.js';

export const load = async ({ locals, params }) => {
	getUser(locals);
	const product = await getProduct(params.uuid);
	if (!product) {
		error(404, 'Product not found');
	}
	const productCategories = await getProductCategories();
	const billingCategories = await getBillingCategories();
	const unitNames = await getUnitNames();
	const vatPercentages = await getVatPercentages();

	return {
		form: await superValidate(product, zod(productFormSchema)),
		productCategories: productCategories,
		billingCategories: billingCategories,
		unitNames: unitNames,
		vatPercentages: vatPercentages
	};
};

export const actions = {
	default: async ({ locals, params, request, cookies }) => {
		getUser(locals);
		const token = getToken(locals);

		const form = await superValidate(request, zod(productFormSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			const product = ProductSchema.parse({
				...form.data,
				uuid: params.uuid
			});
			await updateProduct(token, product);
		} catch (e) {
			console.log(e);
			error(500, 'Something went wrong. Check the logs and please try again later.');
		}

		redirect(
			302,
			`/admin/products/${params.uuid}`,
			{
				type: 'success',
				message: 'Product updated successfully!'
			},
			cookies
		);
	}
};
