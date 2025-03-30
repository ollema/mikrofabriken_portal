import { error } from '@sveltejs/kit';

import * as fs from 'node:fs';

import { MemberSchema, MembersSchema } from '$lib/schemas/members.js';
import type { Commission, Member, Members } from '$lib/types/members.js';
import { getValidCommissions, getValidWorkPools } from '$lib/server/enums.js';

import { env } from '$env/dynamic/private';

function parseMemberList() {
	return MembersSchema.parse(
		JSON.parse(fs.readFileSync(env.UFDATA_REPO_PATH + '/members.json', 'utf-8'))
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

export function areMembersEqual(a: Member, b: Member): boolean {
	if (
		a.crNumber !== b.crNumber ||
		a.slackID !== b.slackID ||
		a.name !== b.name ||
		a.postalAdress !== b.postalAdress ||
		a.postalCode !== b.postalCode ||
		a.postalCity !== b.postalCity ||
		a.email !== b.email ||
		a.phone !== b.phone
	) {
		return false;
	}

	if (!areArraysEqual(a.iceContacts, b.iceContacts)) return false;
	if (!areArraysEqual(a.agreements, b.agreements)) return false;
	if (!areArraysEqual(a.artifacts, b.artifacts)) return false;
	if (!areArraysEqual(a.commissions, b.commissions)) return false;
	if (!areArraysEqual(a.workPools, b.workPools)) return false;

	if (a.company && b.company) {
		return (
			a.company.orgNum === b.company.orgNum &&
			a.company.name === b.company.name &&
			a.company.postalAdress === b.company.postalAdress &&
			a.company.postalCode === b.company.postalCode &&
			a.company.postalCity === b.company.postalCity &&
			a.company.email === b.company.email &&
			a.company.invoiceDefaultTo === b.company.invoiceDefaultTo &&
			areArraysEqual(
				a.company.invoiceExcludeCategoriesFromDefault,
				b.company.invoiceExcludeCategoriesFromDefault
			)
		);
	}

	return a.company === b.company;
}

export function areAllMembersEqual(a: Members, b: Members): boolean {
	if (a.length !== b.length) return false;
	return a.every((member, index) => areMembersEqual(member, b[index]));
}

function areArraysEqual<T>(a: T[], b: T[]): boolean {
	if (a.length !== b.length) return false;
	return JSON.stringify(a) === JSON.stringify(b);
}

export function validateMember(member: unknown): Member {
	const validatedMember = MemberSchema.parse(member);

	// validate dynamic fields that can not be validated by zod
	validateMemberWorkPools(validatedMember.workPools);
	validateMemberCommissions(validatedMember.commissions);

	return validatedMember;
}

export function validateAllMembers(members: unknown): Members {
	const validatedMembers = MembersSchema.parse(members);

	// validate dynamic fields that can not be validated by zod
	for (const member of validatedMembers) {
		validateMemberCommissions(member.commissions);
	}

	return validatedMembers;
}

export function validateMemberWorkPools(workPools: string[]) {
	const validWorkPools = getValidWorkPools();

	for (const workPool of workPools) {
		if (!validWorkPools.includes(workPool)) {
			throw new Error(`Invalid work pool: ${workPool}`);
		}
	}

	return workPools;
}

export function validateMemberCommissions(commissions: Commission[]) {
	const validCommissions = getValidCommissions();

	for (const commission of commissions) {
		if (!validCommissions.includes(commission.type)) {
			throw new Error(`Invalid commission type: ${commission.type}`);
		}
	}
}
