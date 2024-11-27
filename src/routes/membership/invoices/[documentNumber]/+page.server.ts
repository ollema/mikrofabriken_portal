import { getUser } from '$lib/server/auth.js';
import { getMember, parseMemberList } from '$lib/server/members.js';
import { getInvoice } from '$lib/server/fortnox.js';

export async function load({ locals, params, url }) {
	const user = getUser(locals, url);
	const members = parseMemberList();
	const member = getMember(members, user.email);

	const invoice = await getInvoice(params.documentNumber, member, user.role as 'admin' | 'user');

	return {
		invoice: invoice
	};
}
