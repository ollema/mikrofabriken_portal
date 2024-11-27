import { getUser } from '$lib/server/auth.js';
import { getMember, parseMemberList } from '$lib/server/members.js';
import { getInvoices } from '$lib/server/fortnox.js';
import { streamSlow } from '$lib/server/stream.js';

export async function load({ locals, url }) {
	const user = getUser(locals, url);
	const members = parseMemberList();
	const member = getMember(members, user.email);

	const invoices = getInvoices(member);

	return {
		invoices: (await streamSlow(invoices, 400)) || invoices
	};
}
