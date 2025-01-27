import { getUser } from '$lib/server/auth.js';
import { getMember } from '$lib/server/members.js';
import { getInvoice } from '$lib/server/fortnox.js';

export async function load({ locals, params, url }) {
	const user = getUser(locals, url);
	const member = getMember(user.slackID);

	const invoice = await getInvoice(params.documentNumber, member, user.role as 'admin' | 'user');

	return {
		invoice: invoice
	};
}
