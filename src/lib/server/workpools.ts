import { error } from '@sveltejs/kit';

import * as fs from 'node:fs';

import { WorkPoolSchema, WorkPoolsSchema } from '$lib/schemas/workpools.js';
import type { WorkPool, WorkPools } from '$lib/types/workpools.js';
import { getValidWorkPools, getValidCommissions } from '$lib/server/enums.js';

import { env } from '$env/dynamic/private';

function parseWorkPools() {
	return WorkPoolsSchema.parse(
		JSON.parse(fs.readFileSync(env.UFDATA_REPO_PATH + '/workpools.json', 'utf-8'))
	);
}

export function getWorkPools(): WorkPools {
	return parseWorkPools();
}

export function findWorkPool(workPools: WorkPools, id: string): WorkPool {
	const workPool = workPools.find((workPool) => workPool.id === id);
	if (!workPool) {
		error(404, `No work pool found with ID: ${id}`);
	}
	return workPool;
}

export function findWorkPoolsByCommission(commission: string): WorkPools {
	const workPools = getWorkPools();
	return workPools.filter((workPool) => workPool.managedByCommissions.includes(commission));
}

export function getWorkPool(id: string): WorkPool {
	const workPools = getWorkPools();
	return findWorkPool(workPools, id);
}

export function areWorkPoolsEqual(a: WorkPool, b: WorkPool): boolean {
	if (a.id !== b.id || a.name !== b.name || a.description !== b.description) {
		return false;
	}

	return areArraysEqual(a.managedByCommissions, b.managedByCommissions);
}

export function areAllWorkPoolsEqual(a: WorkPools, b: WorkPools): boolean {
	if (a.length !== b.length) return false;
	return a.every((workPool, index) => areWorkPoolsEqual(workPool, b[index]));
}

function areArraysEqual<T>(a: T[], b: T[]): boolean {
	if (a.length !== b.length) return false;
	return JSON.stringify(a) === JSON.stringify(b);
}

export function validateWorkPool(workPool: unknown): WorkPool {
	const validatedWorkPool = WorkPoolSchema.parse(workPool);

	// validate dynamic fields that can not be validated by zod
	validateWorkPoolID(validatedWorkPool.id);
	validateWorkPoolCommissions(validatedWorkPool.managedByCommissions);

	return validatedWorkPool;
}

export function validateAllWorkPools(workPools: unknown): WorkPools {
	const validatedWorkPools = WorkPoolsSchema.parse(workPools);

	// validate dynamic fields that can not be validated by zod
	for (const workPool of validatedWorkPools) {
		validateWorkPoolID(workPool.id);
		validateWorkPoolCommissions(workPool.managedByCommissions);
	}

	return validatedWorkPools;
}

export function validateWorkPoolID(id: string) {
	const validWorkPools = getValidWorkPools();

	if (!validWorkPools.includes(id)) {
		throw new Error(`Invalid work pool ID: ${id}`);
	}
}

export function validateWorkPoolCommissions(commissions: string[]) {
	const validCommissions = getValidCommissions();

	for (const commission of commissions) {
		if (!validCommissions.includes(commission)) {
			throw new Error(`Invalid commission: ${commission}`);
		}
	}
}

export function getWorkPoolNames(): Record<string, string> {
	const workPools = getWorkPools();
	return Object.fromEntries(workPools.map((pool) => [pool.id, pool.name]));
}

export function getWorkPoolsDescriptions(): Record<string, string> {
	const workPools = getWorkPools();
	return Object.fromEntries(workPools.map((pool) => [pool.id, pool.description]));
}
