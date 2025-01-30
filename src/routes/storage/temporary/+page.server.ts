import { getToken, getUser } from '$lib/server/auth.js';
import { getOpenPeriods, getResources, startPeriod, closePeriod, getAvatar } from '$lib/server/cog.js';
import { getMember } from '$lib/server/members.js';
import { fail } from '@sveltejs/kit';

const temporaryStorageRows = [
	['storage/a1', 'storage/a2', 'storage/a3', 'storage/a4'],
	['storage/b1', 'storage/b2', 'storage/b3', 'storage/b4'],
	['storage/b5', 'storage/b6', 'storage/b7']
];

export const load = async ({ locals, url }) => {
	const user = getUser(locals, url);
	const member = getMember(user.slackID);

	const storageResources = await getResources('storage');
	const storageOpenPeriods = await getOpenPeriods('storage');

	const storageRows = temporaryStorageRows.map((row) =>
		row
			.map((temporaryStorage) => {
				const resource = storageResources.find((resource) => resource.name === temporaryStorage);
				if (!resource) {
					throw new Error(`Resource not found: ${temporaryStorage}`);
				}

				const period = storageOpenPeriods.find(
					(openPeriod) => openPeriod.resourceName === temporaryStorage
				);

				// There should only ever be one open period per resource
				const multiplePeriodsFound =
					storageOpenPeriods.filter((openPeriod) => openPeriod.resourceName === temporaryStorage)
						.length > 1;
				if (multiplePeriodsFound) {
					throw new Error(`Multiple open periods found for resource: ${temporaryStorage}`);
				}

				return {
					name: resource.name,
					period: period
						? {
								uuid: period.uuid,
								member: {
									name: member.name,
									avatar: getAvatar(member.crNumber)
								}
							}
						: null
				};
			})
			.filter((storage): storage is NonNullable<typeof storage> => storage !== null)
	);

	return {
		storageRows
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
