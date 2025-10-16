import * as fs from 'node:fs';
import { error } from '@sveltejs/kit';

import type { Committee, Committees } from '$lib/types/committees.js';
import { CommitteesSchema} from '$lib/schemas/committees.js';

import { env } from '$env/dynamic/private';

function parseCommittees() {
	return CommitteesSchema.parse(
		JSON.parse(fs.readFileSync(env.UFDATA_REPO_PATH + '/committees.json', 'utf-8'))
	);
}

export function getCommittees(): Committees {
	return parseCommittees();
}

export function findCommittee(committees: Committees, id: string): Committee {
	const committee = committees.find((committee) => committee.id === id);
	if (!committee) {
		error(404, `No committee found with ID: ${id}`);
	}
	return committee;
}

export function getCommittee(id: string): Committee {
	const committees = getCommittees();
	return findCommittee(committees, id);
}
