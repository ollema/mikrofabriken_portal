import { getUser } from '$lib/server/auth.js';
import { getOpenPeriods } from '$lib/server/cog.js';
import { getMembers } from '$lib/server/members.js';
import { getFormattedMembers } from '../utils.js';

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

	return {
		members: getFormattedMembers(members, here)
	};
};
