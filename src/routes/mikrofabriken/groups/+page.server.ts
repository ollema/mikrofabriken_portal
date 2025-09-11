import { getFormattedMembersBasedOnCommissions } from '../utils.js';
import { getUser } from '$lib/server/auth.js';
import { getMembers } from '$lib/server/members.js';
import { getPresentMembers } from '$lib/utils/cog.js';

export const load = async ({ locals, url }) => {
	getUser(locals, url);

	const members = getMembers();
	const here = await getPresentMembers();
	const { groups } = await getFormattedMembersBasedOnCommissions(members, here);

	return {
		groups: groups
	};
};
