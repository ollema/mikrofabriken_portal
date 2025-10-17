import { error, fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { redirect } from 'sveltekit-flash-message/server';
import { newProductFormSchema } from './schema.js';
import { getToken, getUser } from '$lib/server/auth.js';
import {
	createProduct,
	getBillingCategories,
	getProductCategories,
	getUnitNames,
	getVatPercentages
} from '$lib/server/cog.js';
import { NewProductSchema } from '$lib/schemas/cog.js';

export const load = async ({ locals }) => {
	getUser(locals);
	const productCategories = await getProductCategories();
	const billingCategories = await getBillingCategories();
	const unitNames = await getUnitNames();
	const vatPercentages = await getVatPercentages();

	return {
		form: await superValidate(zod4(newProductFormSchema)),
		productCategories: productCategories,
		billingCategories: billingCategories,
		unitNames: unitNames,
		vatPercentages: vatPercentages
	};
};

export const actions = {
	default: async ({ locals, request, cookies }) => {
		getUser(locals);
		const token = getToken(locals);

		const form = await superValidate(request, zod4(newProductFormSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		let uuid: string;

		try {
			const product = await createProduct(
				token,
				NewProductSchema.parse({
					...form.data
				})
			);
			uuid = product.uuid;
		} catch (e) {
			console.log(e);
			error(500, 'Something went wrong. Check the logs and please try again later.');
		}

		redirect(
			302,
			`/admin/products/${uuid}`,
			{
				type: 'success',
				message: 'Product added successfully!'
			},
			cookies
		);
	}
};
