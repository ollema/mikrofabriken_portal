import { createHash } from 'node:crypto';
import { error, fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { redirect } from 'sveltekit-flash-message/server';
import { newMemberFormSchema } from './schema.js';
import { getMembers } from '$lib/server/members.js';
import {
	getNewMemberOptions,
	getPendingUpdateForNewMembers,
	suggestChange,
	updateRepo
} from '$lib/server/gitlab.js';
import { env } from '$env/dynamic/private';
import { MembersSchema } from '$lib/schemas/members.js';
import { getValidWorkPools } from '$lib/server/enums.js';
import { getWorkPoolNames, getWorkPoolsDescriptions } from '$lib/server/workpools.js';

function decode(url: URL) {
	const encoded = url.searchParams.get('data');
	if (!encoded) {
		error(400, 'missing data');
	}

	const data = JSON.parse(atob(decodeURIComponent(encoded)));
	const { name, slackID, rfidData, investment } = data;
	if (!name || !slackID || !rfidData || investment === undefined) {
		error(400, 'invalid data');
	}

	return data;
}

function generateCodeHash(data: string, pin: string) {
	const concatenatedString = data + pin;
	const hash = createHash('sha1').update(concatenatedString).digest('hex');
	return hash;
}

export const load = async ({ params, url }) => {
	if (params.key !== env.UF_NEW_MEMBER_KEY) {
		error(404, 'invalid key');
	}

	const data = decode(url);

	const validWorkPools = getValidWorkPools();
	const workPoolNameMapping = getWorkPoolNames();
	const workPoolDescriptionMapping = getWorkPoolsDescriptions();

	return {
		form: await superValidate(data, zod(newMemberFormSchema), { errors: false }),
		validWorkPools: validWorkPools,
		workPoolNameMapping: workPoolNameMapping,
		workPoolDescriptionMapping: workPoolDescriptionMapping
	};
};

export const actions = {
	default: async ({ params, request, cookies }) => {
		console.log('action');

		if (params.key !== env.UF_NEW_MEMBER_KEY) {
			error(404, 'invalid key');
		}

		await updateRepo(env.UFDATA_REPO_PATH);
		let members = getMembers();

		const pending = await getPendingUpdateForNewMembers().then(({ members, sourceBranch }) => {
			return {
				members: members,
				sourceBranch
			};
		});

		members = pending.members || members;

		console.log('before parsing');

		const form = await superValidate(request, zod(newMemberFormSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		console.log('Form data:', form.data);

		try {
			const newMember = MembersSchema.element.parse({
				slackID: form.data.slackID,
				crNumber: form.data.crNumber,
				name: form.data.name,
				postalAdress: form.data.postalAdress,
				postalCode: form.data.postalCode,
				postalCity: form.data.postalCity,
				email: form.data.email,
				phone: form.data.phone,
				agreements: [
					{
						type: 'membership',
						startDate: new Date().toISOString().split('T')[0]
					}
				],
				artifacts: [
					{
						type: 'rfid',
						attributes: {
							data: form.data.rfidData,
							codeHash: generateCodeHash(form.data.rfidData, form.data.rfidCode)
						},
						startDate: new Date().toISOString().split('T')[0]
					}
				],
				commissions: [],
				iceContacts: [],
				workPools: form.data.workPools
			});

			if (form.data.investment) {
				newMember.agreements.push({
					type: 'investment',
					startDate: new Date().toISOString().split('T')[0]
				});
			}

			members.push(newMember);

			await suggestChange({ members: members, ...getNewMemberOptions(pending.sourceBranch) });
		} catch (e) {
			console.log(e);
			error(500, 'Failed to create member request - check server logs.');
		}

		redirect(
			302,
			'/',
			{
				type: 'success',
				message: 'Change request submitted successfully!'
			},
			cookies
		);
	}
};
