import { getUser } from '$lib/server/auth.js';
import { getMember, getMembers } from '$lib/server/members.js';
import { getWorkPools } from '$lib/server/workpools.js';
import { isCommissionActive, isMemberActive } from '$lib/utils/member.js';

export const load = async ({ locals }) => {
	const user = getUser(locals);
	const member = getMember(user.slackID);
	const workPools = getWorkPools();
	const allMembers = getMembers();

	const visibleWorkPools =
		user.role === 'admin'
			? workPools
			: workPools.filter((pool) =>
					pool.managedByCommissions.some((commission) =>
						member.commissions.some((mc) => mc.type === commission && isCommissionActive(mc))
					)
				);

	return {
		workPools: visibleWorkPools.map((pool) => ({
			...pool,
			members: allMembers
				.filter((m) => m.workPools.includes(pool.id) && isMemberActive(m))
				.sort((a, b) => a.name.localeCompare(b.name))
				.map(({ name, email, phone }) => ({ name, email, phone }))
		}))
	};
};
