import { getMember } from '$lib/server/members.js';
import { fortnox } from '$lib/server/fortnox/fortnox.js';

export async function load({ params }) {
	// Get the member being viewed (not the current user)
	const member = getMember(params.slackID);

	const invoices = await fortnox.getInvoices(member);

	return {
		member: member,
		invoices: invoices
	};
}
