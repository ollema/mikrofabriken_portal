import { getUser } from '$lib/server/auth';
import { parseMemberList } from '$lib/server/members';
import { getOpenPeriods } from '$lib/server/cog';
import { getFormattedMembersBasedOnCommissions } from '../utils';

export const load = async ({ locals, url }) => {
	getUser(locals, url);

	const members = parseMemberList();

	const periods = await getOpenPeriods('room');

	const here = periods.reduce(
		(acc: Record<string, boolean>, period) => {
			acc[period.memberCrNumber] = true;
			return acc;
		},
		{} as Record<string, boolean>
	);

	const { board } = getFormattedMembersBasedOnCommissions(members, here);

	return {
		board: board
	};
};
