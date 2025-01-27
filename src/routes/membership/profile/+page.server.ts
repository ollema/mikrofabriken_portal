import { getUser } from '$lib/server/auth.js';
import { findMember, getMember } from '$lib/server/members.js';
import { getPendingUpdateForMember } from '$lib/server/gitlab.js';

export const load = async ({ locals, url }) => {
	const user = getUser(locals, url);
	const member = getMember(user.slackID);

	const pending = await getPendingUpdateForMember(member.crNumber).then(
		({ members, sourceBranch }) => {
			return {
				member: members && findMember(members, member.slackID),
				sourceBranch
			};
		}
	);

	return {
		member,
		pending: pending
	};
};
