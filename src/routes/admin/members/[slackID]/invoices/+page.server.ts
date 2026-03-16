import { getMember } from '$lib/server/members.js';
import { fortnox } from '$lib/server/fortnox/fortnox.js';
import { getInvoices } from '$lib/server/fortnox/fortnox-util.js';

export async function load({ params }) {
	// Get the member being viewed (not the current user)
	const member = getMember(params.slackID);

	const invoices = await getInvoices(fortnox, member);

	return {
		member: member,
		invoices: invoices
	};
}
