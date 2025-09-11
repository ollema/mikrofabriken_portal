import { getUser } from '$lib/server/auth.js';
import { getMember } from '$lib/server/members.js';
import { getInvoices } from '$lib/server/fortnox.js';

export async function load({ locals, params, url }: { locals: any; params: any; url: any }) {
	const user = getUser(locals, url);
	// Get the member being viewed (not the current user)
	const member = getMember(params.slackID);

	const invoices = await getInvoices(member);

	return {
		member: member,
		invoices: invoices
	};
}
