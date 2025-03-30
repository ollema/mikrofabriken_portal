import { z } from 'zod';
import luhn from 'fast-luhn';

import { MemberSchema } from '$lib/schemas/members.js';

export const newMemberFormSchema = MemberSchema.omit({
	crNumber: true,
	iceContacts: true,
	agreements: true,
	artifacts: true,
	commissions: true,
	company: true
}).extend({
	slackID: z.string(),
	crNumber: z
		.string()
		.regex(new RegExp('^[0-9]{8}-[0-9]{4}$'), {
			message: 'Personnummer måste ges i formatet 12345678-1234'
		})
		.refine(
			(value) => {
				// check if the PIN is valid using the Luhn algorithm
				// https://en.wikipedia.org/wiki/Luhn_algorithm
				// using the last 10 numbers of the PIN without the dash
				const PIN = value.replace('-', '').slice(-10);
				return luhn(PIN);
			},
			{ message: 'Ogiltigt personnummer (https://en.wikipedia.org/wiki/Luhn_algorithm)' }
		),
	rfidData: z.string(),
	investment: z.boolean(),
	rfidCode: z.string().regex(new RegExp('^[0-9]{4}$'), {
		message: 'Koden måste vara 4 siffror'
	}),
	workPools: z.array(z.string()).min(1, 'Varje medlem måste vara med i minst en arbetspool')
});

export type NewMemberFormSchema = typeof newMemberFormSchema;
