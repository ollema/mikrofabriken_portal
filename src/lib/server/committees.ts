import * as fs from 'node:fs';
import { error } from '@sveltejs/kit';

import type { Committee, Committees } from '$lib/types/committees.js';
import { CommitteesSchema } from '$lib/schemas/committees.js';

import { env } from '$env/dynamic/private';

function parseCommittees() {
	return CommitteesSchema.parse(
		JSON.parse(fs.readFileSync(env.UFDATA_REPO_PATH + '/committees.json', 'utf-8'))
	);
}

export function getCommittees(): Committees {
	return parseCommittees();
}

export function findCommittee(committees: Committees, name: string): Committee {
	const committee = committees.find((committee) => committee.name === name);
	if (!committee) {
		error(404, `No committee found with name: ${name}`);
	}
	return committee;
}
