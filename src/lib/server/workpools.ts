import * as fs from 'node:fs';

import type { WorkPools } from '$lib/types/workpools.js';
import { WorkPoolsSchema } from '$lib/schemas/workpools.js';

import { env } from '$env/dynamic/private';

function parseWorkPools() {
	return WorkPoolsSchema.parse(
		JSON.parse(fs.readFileSync(env.UFDATA_REPO_PATH + '/workpools.json', 'utf-8'))
	);
}

export function getWorkPools(): WorkPools {
	return parseWorkPools();
}

export function getWorkPoolNames(): Record<string, string> {
	const workPools = getWorkPools();
	return Object.fromEntries(workPools.map((pool) => [pool.id, pool.name]));
}

export function getWorkPoolsDescriptions(): Record<string, string> {
	const workPools = getWorkPools();
	return Object.fromEntries(workPools.map((pool) => [pool.id, pool.description]));
}
