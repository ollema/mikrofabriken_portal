import * as fs from 'node:fs';

import { EnumsSchema } from '$lib/schemas/enums';

import { env } from '$env/dynamic/private';

function parseEnums() {
	return EnumsSchema.parse(
		JSON.parse(fs.readFileSync(env.UFDATA_REPO_PATH + '/enums.schema.json', 'utf-8'))
	);
}

export function getValidCommissions() {
	const enums = parseEnums();
	return enums.definitions.commission.enum;
}

export function getValidWorkPools() {
	const enums = parseEnums();
	return enums.definitions.workPool.enum;
}

export function getValidBillingCategories() {
	const enums = parseEnums();
	return enums.definitions.billingCategory.enum;
}
