import { getUser } from '$lib/server/auth.js';
import { getMember, parseMemberList } from '$lib/server/members.js';
import { getPendingUpdateForMember } from '$lib/server/gitlab.js';
import { streamSlow } from '$lib/server/stream.js';
import { getAvatar } from '$lib/server/cog.js';

export const load = async ({ locals, params }) => {
	getUser(locals);
	const members = parseMemberList();
	const member = getMember(members, params.slackEmail);

	const pending = getPendingUpdateForMember(member.crNumber).then(({ members, sourceBranch }) => {
		return {
			member: members && getMember(members, member.slackEmail),
			sourceBranch
		};
	});

	// TODO: fix after purchases API supports querying for other members
	// const purchasesLastMonth = getPurchases(token, member.crNumber, 1);
	// const purchasesCurrentMonth = getPurchases(token, member.crNumber, 0);

	return {
		avatar: getAvatar(member.crNumber),
		member,
		pending: (await streamSlow(pending, 400)) || pending
	};
};
