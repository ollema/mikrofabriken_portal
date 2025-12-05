import { error } from '@sveltejs/kit';
import { getFormattedMembersBasedOnCommissions } from '../../utils.js';
import { getUser } from '$lib/server/auth.js';
import { getMembers } from '$lib/server/members.js';
import { getPresentMembers } from '$lib/utils/cog.js';
import { findCommittee, getCommittees } from '$lib/server/committees.js';

export const load = async ({ locals, url, params }: { locals: any; url: URL; params: { name: string | string[] } }) => {
	getUser(locals, url);

	// Handle catch-all parameter - it might be a string or array depending on SvelteKit version
	const committeeName = Array.isArray(params.name) ? params.name.join('/') : params.name;

	const committees = getCommittees();
	const committee = findCommittee(committees, committeeName);

	// Verify this is an OMK (workshop/*)
	if (!committee.name.startsWith('workshop/')) {
		error(404, `Committee "${committeeName}" is not an OMK`);
	}

	const members = getMembers();
	const here = await getPresentMembers();

	const { omks } = await getFormattedMembersBasedOnCommissions(members, here);
	const omk = omks.find((omk) => omk.name === committeeName);

	if (!omk) {
		error(404, `OMK "${committeeName}" not found`);
	}

	return {
		committee,
		members: omk.members
	};
};

