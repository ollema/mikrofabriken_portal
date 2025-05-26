import { getFormattedMembersBasedOnCommissions } from '../utils.js';
import { getUser } from '$lib/server/auth.js';
import { getMembers } from '$lib/server/members.js';
import { getOpenPeriods } from '$lib/server/cog.js';

export const load = async ({ locals, url }) => {
	getUser(locals, url);

	const members = getMembers();

	const periods = await getOpenPeriods('room');

	const here = periods.reduce(
		(acc: Record<string, boolean>, period) => {
			acc[period.memberCrNumber] = true;
			return acc;
		},
		{} as Record<string, boolean>
	);

	const { board } = await getFormattedMembersBasedOnCommissions(members, here);

	return {
		board: board
	};
};
