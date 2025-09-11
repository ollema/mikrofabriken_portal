import { getUser } from '$lib/server/auth.js';
import { getMember } from '$lib/server/members.js';
import { getInvoice } from '$lib/server/fortnox.js';

export async function load({ locals, params, url }: { locals: any; params: any; url: any }) {
	const user = getUser(locals, url);
	// Get the member being viewed (not the current user)
	const member = getMember(params.slackID);

	const invoice = await getInvoice(params.documentNumber, member, user.role as 'admin' | 'user');

	return {
		invoice: invoice
	};
}
