import { getUser } from '$lib/server/auth.js';
import { getMember, parseMemberList } from '$lib/server/members.js';
import { getPendingUpdateForMember } from '$lib/server/gitlab.js';

export const load = async ({ locals, url }) => {
	const user = getUser(locals, url);
	const members = parseMemberList();
	const member = getMember(members, user.slackID);

	const pending = await getPendingUpdateForMember(member.crNumber).then(
		({ members, sourceBranch }) => {
			return {
				member: members && getMember(members, member.slackID),
				sourceBranch
			};
		}
	);

	return {
		member,
		pending: pending
	};
};
