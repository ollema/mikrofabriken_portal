import { getUser } from '$lib/server/auth';
import { getMember, parseMemberList } from '$lib/server/members.js';
import { getPendingUpdateForMember } from '$lib/server/gitlab.js';
import { streamSlow } from '$lib/server/stream.js';

export const load = async ({ locals, url }) => {
	const user = getUser(locals, url);
	const members = parseMemberList();
	const member = getMember(members, user.email);

	const pending = getPendingUpdateForMember(member.crNumber).then(({ members, sourceBranch }) => {
		return {
			member: members && getMember(members, member.slackEmail),
			sourceBranch
		};
	});

	return {
		member,
		pending: (await streamSlow(pending, 400)) || pending
	};
};