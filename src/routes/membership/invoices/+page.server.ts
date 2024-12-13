import { getUser } from '$lib/server/auth.js';
import { getMember, parseMemberList } from '$lib/server/members.js';
import { getInvoices } from '$lib/server/fortnox.js';

export async function load({ locals, url }) {
	const user = getUser(locals, url);
	const members = parseMemberList();
	const member = getMember(members, user.slackID);

	const invoices = await getInvoices(member);

	return {
		invoices: invoices
	};
}
