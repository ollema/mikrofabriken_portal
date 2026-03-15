import { error, fail } from '@sveltejs/kit';
import type { z } from 'zod';
import type { PeriodsSchema } from '$lib/schemas/cog.js';
import { getToken, getUser } from '$lib/server/auth.js';
import {
	closePeriod,
	getAvatar,
	getEstimatedCost,
	getMyClosedPeriods,
	getOpenPeriods,
	getResources,
	startPeriod
} from '$lib/server/cog.js';
import { findMember, getMembers } from '$lib/server/members.js';

const mediumTermStorageRows = [
	['storageMediumTerm/x1', 'storageMediumTerm/x2', 'storageMediumTerm/x3']
];

export const load = async ({ locals, url }) => {
	const user = getUser(locals, url);
	const members = getMembers();
	const member = findMember(members, user.slackID);

	let storageResources;
	let storageOpenPeriods;
	try {
		[storageResources, storageOpenPeriods] = await Promise.all([
			getResources('storageMediumTerm'),
			getOpenPeriods('storageMediumTerm')
		]);
	} catch (e) {
		console.error('[Storage] Failed to load medium-term storage data:', e);
		error(503, 'Kunde inte ladda tillfälliga projektytor. Försök igen senare.');
	}

	const storageRows = mediumTermStorageRows.map((row) =>
		row.map((temporaryStorage) => {
			const resource = storageResources.find((resource) => resource.name === temporaryStorage);
			if (!resource) {
				throw new Error(`Resource not found: ${temporaryStorage}`);
			}

			const period = storageOpenPeriods.find(
				(openPeriod) => openPeriod.resourceName === temporaryStorage
			);

			const multiplePeriodsFound =
				storageOpenPeriods.filter((openPeriod) => openPeriod.resourceName === temporaryStorage)
					.length > 1;
			if (multiplePeriodsFound) {
				throw new Error(`Multiple open periods found for resource: ${temporaryStorage}`);
			}

			const member = period
				? members.find((member) => member.crNumber === period.memberCrNumber)
				: null;

			const storage = {
				name: resource.name,
				period:
					period && member
						? {
								uuid: period.uuid,
								member: {
									name: member.name,
									slackID: member.slackID,
									crNumber: member.crNumber
								},
								start: period.start,
								end: period.end
							}
						: null
			};

			return storage;
		})
	);

	const membersWithStorage = new Set(
		storageRows
			.flat()
			.filter((s) => s.period)
			.map((s) => s.period!.member)
	);

	const avatars = Object.fromEntries(
		await Promise.all(
			Array.from(membersWithStorage).map(async (member) => [
				member.slackID,
				await getAvatar(member.crNumber)
			])
		)
	);

	const memberOpenStoragePeriods = storageOpenPeriods.filter(
		(period) =>
			period.memberCrNumber === member.crNumber &&
			mediumTermStorageRows.flat().includes(period.resourceName)
	);

	let memberClosedStoragePeriods: z.infer<typeof PeriodsSchema>;
	try {
		memberClosedStoragePeriods = await getMyClosedPeriods(getToken(locals), 'storageMediumTerm');
	} catch (e) {
		console.warn('[Storage] Failed to load closed periods, defaulting to []:', e);
		memberClosedStoragePeriods = [];
	}

	const memberStoragePeriods = [...memberOpenStoragePeriods, ...memberClosedStoragePeriods].sort(
		(a, b) => b.start.getTime() - a.start.getTime()
	);

	const periodsWithCost = await Promise.all(
		memberStoragePeriods.map(async (period) => {
			try {
				const costInfo = await getEstimatedCost(getToken(locals), {
					resourceName: period.resourceName,
					startDate: period.start,
					endDate: period.end ?? new Date()
				});
				return { ...period, cost: costInfo.cost };
			} catch (e) {
				console.warn(`[Storage] Failed to estimate cost for period=${period.uuid}:`, e);
				return { ...period, cost: null };
			}
		})
	);

	return {
		storageRows,
		avatars,
		storagePeriods: periodsWithCost
	};
};

export const actions = {
	reserve: async ({ request, locals }) => {
		getUser(locals);
		const token = getToken(locals);

		const data = await request.formData();
		const storage = data.get('storage') as string;

		try {
			await startPeriod(token, {
				resourceName: storage
			});
			return { success: true };
		} catch (e) {
			console.error(`[Storage] Reserve failed for resource=${storage}:`, e);
			return fail(500, {
				message: 'Kunde inte boka den tillfälliga projektytan. Försök igen senare.'
			});
		}
	},
	release: async ({ request, locals }) => {
		getUser(locals);
		const token = getToken(locals);

		const data = await request.formData();
		const uuid = data.get('uuid') as string;

		try {
			await closePeriod(token, uuid);
			return { success: true };
		} catch (e) {
			console.error(`[Storage] Release failed for period=${uuid}:`, e);
			return fail(500, {
				message: 'Kunde inte avboka den tillfälliga projektytan. Försök igen senare.'
			});
		}
	}
};
