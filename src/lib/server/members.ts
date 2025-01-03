import { error } from '@sveltejs/kit';

import * as fs from 'node:fs';

import { MembersSchema } from '$lib/schemas/members.js';
import type { Members } from '$lib/types/members.js';

import { env } from '$env/dynamic/private';

/**
 * Parses the member list from a JSON file.
 *
 * @returns The parsed member list.
 */
export function parseMemberList() {
	return MembersSchema.parse(
		JSON.parse(fs.readFileSync(env.UFPERSONSLIST_REPO_PATH + '/members.json', 'utf-8'))
	);
}

/**
 * Finds a member in the given array of members based on the provided Slack ID.

* @param members - The list of members.
 * @param slackID - The Slack ID of the member to search for.
 * @returns The found member or undefined if not found.
 */
export function maybeFindMember(members: Members, slackID: string) {
	return members.find((member) => member.slackID === slackID);
}

/**
 * Retrieves a member from the given list of members based on the Slack ID
 * Throws an error if no member is found with the specified Slack ID.
 *
 * @param members - The list of members.
 * @param slackID - The Slack ID of the member to retrieve.
 * @returns The member object with the specified Slack ID.
 * @throws An error with status code 404 if no member is found.
 */
export function getMember(members: Members, slackID: string) {
	const member = maybeFindMember(members, slackID);
	if (!member) {
		error(404, `No member found with Slack ID: ${slackID.toLowerCase()} was found.`);
	}
	return member;
}
