import { getUser } from '$lib/server/auth.js';
import { getMembers } from '$lib/server/members.js';
import { getOpenPeriods } from '$lib/server/cog.js';
import { getFormattedMembersBasedOnCommissions } from '../utils.js';

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

	const { omks } = await getFormattedMembersBasedOnCommissions(members, here);

	return {
		omks: omks
	};
};
