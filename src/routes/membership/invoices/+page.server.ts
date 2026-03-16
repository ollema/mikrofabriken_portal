import { getUser } from '$lib/server/auth.js';
import { getMember } from '$lib/server/members.js';
import { fortnox } from '$lib/server/fortnox/fortnox.js';
import { getInvoices } from '$lib/server/fortnox/fortnox-util.js';

export async function load({ locals, url }) {
	const user = getUser(locals, url);
	const member = getMember(user.slackID);

	const invoices = await getInvoices(fortnox, member);

	return {
		member: member,
		invoices: invoices
	};
}
