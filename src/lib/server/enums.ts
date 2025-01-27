import * as fs from 'node:fs';

import { EnumsSchema } from '$lib/schemas/enums';

import { env } from '$env/dynamic/private';

function parseEnums() {
	return EnumsSchema.parse(
		JSON.parse(fs.readFileSync(env.UFPERSONSLIST_REPO_PATH + '/enums.schema.json', 'utf-8'))
	);
}

export function getValidCommissions() {
	const enums = parseEnums();
	return enums.definitions.commission.enum;
}
