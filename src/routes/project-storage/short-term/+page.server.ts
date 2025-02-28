import { getToken, getUser } from '$lib/server/auth.js';
import {
	getOpenPeriods,
	getResources,
	startPeriod,
	closePeriod,
	getAvatar,
	getMyClosedPeriods,
	getPeriodDiscount,
	getEstimatedCost
} from '$lib/server/cog.js';
import { findMember, getMembers } from '$lib/server/members.js';
import { fail } from '@sveltejs/kit';

const shortTermStorageRows = [
	['storageShortTerm/a1', 'storageShortTerm/a2', 'storageShortTerm/a3', 'storageShortTerm/a4'],
	[
		'storageShortTerm/b1',
		'storageShortTerm/b2',
		'storageShortTerm/b3',
		'storageShortTerm/b4',
		'storageShortTerm/b5'
	],
	['storageShortTerm/b7', 'storageShortTerm/b6']
];

export const load = async ({ locals, url }) => {
	const user = getUser(locals, url);
	const members = getMembers();
	const member = findMember(members, user.slackID);

	const storageResources = await getResources('storageShortTerm');
	const storageOpenPeriods = await getOpenPeriods('storageShortTerm');

	const storageRows = shortTermStorageRows.map((row) =>
		row
			.map((temporaryStorage) => {
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
			.filter((storage): storage is NonNullable<typeof storage> => storage !== null)
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
			shortTermStorageRows.flat().includes(period.resourceName)
	);

	const memberClosedStoragePeriods = await getMyClosedPeriods(getToken(locals), 'storageShortTerm');

	// TODO: fix this to be more robust
	const costModel = storageResources[0].costModel as string;
	const discountInfo = await getPeriodDiscount(getToken(locals), costModel);

	const memberStoragePeriods = [...memberOpenStoragePeriods, ...memberClosedStoragePeriods].sort(
		(a, b) => b.start.getTime() - a.start.getTime()
	);

	const periodsWithCost = await Promise.all(
		memberStoragePeriods.map(async (period) => {
			if (period.end) {
				const costInfo = await getEstimatedCost(getToken(locals), {
					resourceName: period.resourceName,
					startDate: period.start,
					endDate: period.end
				});
				return { ...period, cost: costInfo.cost };
			} else {
				const costInfo = await getEstimatedCost(getToken(locals), {
					resourceName: period.resourceName,
					startDate: period.start,
					endDate: new Date()
				});
				return { ...period, cost: costInfo.cost };
			}
		})
	);

	return {
		storageRows,
		avatars,
		storagePeriods: periodsWithCost,
		usedDiscount: discountInfo.usedDiscountOpen + discountInfo.usedDiscountClosed,
		availableDiscount: discountInfo.availableDiscount
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
		} catch (error) {
			console.error('Failed to reserve storage:', error);
			return fail(500, { message: 'Failed to reserve storage' });
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
		} catch (error) {
			console.error('Failed to release storage:', error);
			return fail(500, { message: 'Failed to release storage' });
		}
	}
};
