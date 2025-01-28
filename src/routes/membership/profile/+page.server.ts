import { getUser } from '$lib/server/auth.js';
import { findMember, getMember } from '$lib/server/members.js';
import { getPendingUpdateForMember } from '$lib/server/gitlab.js';
import { getWorkPoolNames } from '$lib/server/workpools.js';

export const load = async ({ locals, url }) => {
	const user = getUser(locals, url);
	const member = getMember(user.slackID);

	const workPoolNameMapping = getWorkPoolNames();

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
		workPoolNameMapping,
		pending: pending
	};
};
