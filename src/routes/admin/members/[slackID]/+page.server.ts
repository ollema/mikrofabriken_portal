import { getUser } from '$lib/server/auth.js';
import { getMember, parseMemberList } from '$lib/server/members.js';
import { getPendingUpdateForMember } from '$lib/server/gitlab.js';
import { getAvatar } from '$lib/server/cog.js';

export const load = async ({ locals, params }) => {
	getUser(locals);
	const members = parseMemberList();
	const member = getMember(members, params.slackID);

	const avatar = getAvatar(member.crNumber);

	const pending = getPendingUpdateForMember(member.crNumber).then(({ members, sourceBranch }) => {
		return {
			member: members && getMember(members, member.slackID),
			sourceBranch
		};
	});

	// TODO: fix after purchases API supports querying for other members
	// const purchasesLastMonth = getPurchases(token, member.crNumber, 1);
	// const purchasesCurrentMonth = getPurchases(token, member.crNumber, 0);

	return {
		member,
		avatar: await avatar,
		pending: await pending
	};
};
