import { setFlash } from 'sveltekit-flash-message/server';
import { getToken, getUser } from '$lib/server/auth.js';
import { getMember } from '$lib/server/members.js';
import { purchaseProduct } from '$lib/server/cog.js';
import { PurchaseSchema } from '$lib/schemas/cog.js';

export function load({ locals, url }) {
	const user = getUser(locals, url);
	const member = getMember(user.slackID);

	return {
		member: member
	};
}

export const actions = {
	purchase: async (event) => {
		getUser(event.locals, event.url);
		const token = getToken(event.locals);

		const formData = await event.request.formData();
		const productUuid = formData.get('uuid') as string;
		const quantity = parseInt(formData.get('quantity') as string);

		const data = PurchaseSchema.parse({
			productUuid: productUuid,
			quantity: quantity,
			pointOfSale: 'portal',
			forced: false
		});

		await purchaseProduct(token, data);

		setFlash({ type: 'success', message: 'Purchase successful!' }, event);
	}
};
