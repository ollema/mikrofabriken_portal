import { getUser } from '$lib/server/auth.js';
import { getMember } from '$lib/server/members.js';
import { getInvoices } from '$lib/server/fortnox.js';

export async function load({ locals, url }) {
	const user = getUser(locals, url);
	const member = getMember(user.slackID);

	const invoices = await getInvoices(member);

	return {
		invoices: invoices
	};
}
