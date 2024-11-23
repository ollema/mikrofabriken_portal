import { getUser } from '$lib/server/auth';
import { getOpenPeriods } from '$lib/server/cog';
import { parseMemberList } from '$lib/server/members';
import { getFormattedMembers } from '../utils.js';

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

	return {
		members: getFormattedMembers(members, here),
		meta: {
			title: 'Members',
			description: 'Members of Mikrofabriken.'
		}
	};
};
