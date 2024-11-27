import { getUser } from '$lib/server/auth.js';
import { getMember, parseMemberList } from '$lib/server/members.js';
import { getProducts } from '$lib/server/cog.js';
import { streamSlow } from '$lib/server/stream.js';

export async function load({ locals }) {
	const user = getUser(locals);
	const members = parseMemberList();
	const member = getMember(members, user.email);

	const products = getProducts();

	return {
		member: member,
		products: (await streamSlow(products, 400)) || products
	};
}
