import { getToken, getUser } from '$lib/server/auth.js';
import { getMember } from '$lib/server/members.js';
import { getPurchases } from '$lib/server/cog.js';

export async function load({ locals, url }) {
	const user = getUser(locals, url);
	const member = getMember(user.slackID);
	const token = getToken(locals);

	const purchasesLastMonth = getPurchases(token, member.crNumber, 1);
	const purchasesCurrentMonth = getPurchases(token, member.crNumber, 0);

	const purchases = await Promise.all([purchasesLastMonth, purchasesCurrentMonth]);

	return {
		purchases: purchases
	};
}
