import { error } from '@sveltejs/kit';

import * as fs from 'node:fs';

import { MembersSchema } from '$lib/schemas/members.js';
import type { Member, Members } from '$lib/types/members.js';

import { env } from '$env/dynamic/private';

function parseMemberList() {
	return MembersSchema.parse(
		JSON.parse(fs.readFileSync(env.UFPERSONSLIST_REPO_PATH + '/members.json', 'utf-8'))
	);
}

export function getMembers(): Members {
	return parseMemberList();
}

export function findMember(members: Members, slackID: string): Member {
	const member = members.find((member) => member.slackID === slackID);
	if (!member) {
		error(404, `No member found with Slack ID: ${slackID.toLowerCase()} was found.`);
	}
	return member;
}

export function getMember(slackID: string): Member {
	const members = getMembers();
	return findMember(members, slackID);
}
