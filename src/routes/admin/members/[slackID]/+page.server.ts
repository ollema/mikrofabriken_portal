import { getUser } from '$lib/server/auth.js';
import { findMember, getMember } from '$lib/server/members.js';
import { getWorkPoolNames } from '$lib/server/workpools.js';
import { getAvatar } from '$lib/server/cog.js';
import { getPendingUpdateForMember } from '$lib/server/gitlab.js';

export const load = async ({ locals, params }) => {
	getUser(locals);
	const member = getMember(params.slackID);

	const workPoolNameMapping = getWorkPoolNames();

	const avatar = getAvatar(member.crNumber);

	const pending = getPendingUpdateForMember(member.crNumber).then(({ members, sourceBranch }) => {
		return {
			member: members && findMember(members, member.slackID),
			sourceBranch
		};
	});

	// TODO: fix after purchases API supports querying for other members
	// const purchasesLastMonth = getPurchases(token, member.crNumber, 1);
	// const purchasesCurrentMonth = getPurchases(token, member.crNumber, 0);

	return {
		member,
		workPoolNameMapping,
		avatar: await avatar,
		pending: await pending
	};
};
