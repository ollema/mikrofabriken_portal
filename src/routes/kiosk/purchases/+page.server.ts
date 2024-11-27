import { getToken, getUser } from '$lib/server/auth';
import { getMember, parseMemberList } from '$lib/server/members';
import { getPurchases } from '$lib/server/cog';
import { streamSlow } from '$lib/server/stream';

export async function load({ locals, url }) {
	const user = getUser(locals, url);
	const members = parseMemberList();
	const member = getMember(members, user.email);
	const token = getToken(locals);

	const purchasesLastMonth = getPurchases(token, member.crNumber, 1);
	const purchasesCurrentMonth = getPurchases(token, member.crNumber, 0);

	const purchases = Promise.all([purchasesLastMonth, purchasesCurrentMonth]);

	return {
		purchases: (await streamSlow(purchases, 400)) || purchases
	};
}
