import { z } from 'zod';
import luhn from 'fast-luhn';

import { CompanySchema } from '$lib/schemas/company';

/**
 * Represents the types of agreements.
 */
export const AgreementTypes = z.enum([
	'membership',
	'investment',
	'passive',
	'asylumInside',
	'asylumOutside',
	'palletInside',
	'palletOutside',
	'containerStorage'
]);

/**
 * Represents the types of artifacts.
 */
export const ArtifactTypes = z.enum(['key', 'rfid', 'legacyKey']);

/**
 * Represents the types of commissions.
 */
export const CommissionTypes = z.enum([
	'board/chairman',
	'board/cashier',
	'board/secretary',
	'board/member',
	'board/alternate',
	'auditor/member',
	'committee/economy',
	'committee/it',
	'committee/pr',
	'committee/sponsorships',
	'nomination/chairman',
	'nomination/committee',
	'nomination/member',
	'workshop/3dprint',
	'workshop/3s',
	'workshop/asylum',
	'workshop/asylumstorage',
	'workshop/brewery',
	'workshop/dressing',
	'workshop/electronics',
	'workshop/forge',
	'workshop/laser',
	'workshop/laser3d',
	'workshop/metal',
	'workshop/office',
	'workshop/painting',
	'workshop/plaza',
	'workshop/storage',
	'workshop/support',
	'workshop/textile',
	'workshop/vehicle',
	'workshop/wood'
]);

/**
 * Agreement schema represents the structure of an agreement.
 */
export const AgreementSchema = z
	.object({
		type: AgreementTypes,
		startDate: z.string(),
		attributes: z
			.object({
				size: z.number().optional(),
				palletCount: z.number().int().optional(),
				palletIds: z.array(z.number().int()).optional()
			})
			.strict()
			.optional(),
		endDate: z.string().optional()
	})
	.strict();

/**
 * Artifact schema represents the structure of an artifact.
 */
export const ArtifactSchema = z
	.object({
		type: ArtifactTypes,
		startDate: z.string(),
		attributes: z
			.object({
				area: z.string().optional(),
				number: z.number().int().optional(),
				data: z.string().optional(),
				codeHash: z.string().optional()
			})
			.strict()
			.optional(),
		endDate: z.string().optional()
	})
	.strict();

/**
 * Commission schema represents the structure of a commission.
 */
export const CommissionSchema = z
	.object({
		type: CommissionTypes,
		startDate: z.string(),
		endDate: z.string().optional()
	})
	.strict();

/**
 * Member schema represents the structure of a member.
 */
export const MemberSchema = z
	.object({
		crNumber: z.string().regex(new RegExp('^[0-9]{8}-[0-9]{4}$'), {
			message: 'PIN must be in format 12345678-1234'
		}),
		name: z.string().min(1, { message: 'Name needs to be at least 1 character long' }),
		postalAdress: z
			.string()
			.min(1, { message: 'Postal address needs to be at least 1 character long' }),
		postalCode: z.string().min(1, { message: 'Postal code needs to be at least 1 character long' }),
		postalCity: z.string().min(1, { message: 'Postal city needs to be at least 1 character long' }),
		email: z.string().email({ message: 'Email needs to be a valid email address' }),
		slackEmail: z.string().email({ message: 'Slack email needs to be a valid email address' }),
		phone: z.string().regex(new RegExp('^[0-9]{10}$'), {
			message: 'Phone number must start with 0 and be 10 digits long'
		}),
		agreements: z.array(AgreementSchema),
		artifacts: z.array(ArtifactSchema),
		commissions: z.array(CommissionSchema),
		company: CompanySchema.optional()
	})
	.strict();

/**
 * Members schema represents the structure of a list of members.
 */
export const MembersSchema = z.array(MemberSchema);

export const formSchema = MemberSchema.omit({
	crNumber: true,
	slackEmail: true,
	agreements: true,
	artifacts: true,
	commissions: true,
	company: true
});

export type FormSchema = typeof formSchema;

export const rfidFormSchema = z.object({
	rfidData: z.string(),
	rfidCode: z.string().regex(new RegExp('^[0-9]{4}$'), {
		message: 'Code must be 4 digits long'
	})
});

export type RfidFormSchema = typeof rfidFormSchema;

export const adminFormSchema = MemberSchema.omit({
	agreements: true,
	artifacts: true,
	commissions: true,
	company: true
});

export type AdminFormSchema = typeof adminFormSchema;

export const artifactsFormSchema = z.object({
	rfidTags: z.array(
		z.object({
			startDate: z.string(),
			data: z.string(),
			codeHash: z.string(),
			endDate: z.string().optional()
		})
	),
	keys: z.array(
		z.object({
			startDate: z.string(),
			number: z.number().int(),
			endDate: z.string().optional()
		})
	),
	legacyKeys: z.array(
		z.object({
			startDate: z.string(),
			area: z.string(),
			endDate: z.string().optional()
		})
	)
});

export type ArtifactsFormSchema = typeof artifactsFormSchema;

export const newMemberLinkFormSchema = MemberSchema.pick({
	slackEmail: true
}).extend({
	rfidData: z.string(),
	investment: z.boolean()
});

export type NewMemberLinkFormSchema = typeof newMemberLinkFormSchema;

export const newMemberFormSchema = MemberSchema.omit({
	crNumber: true,
	agreements: true,
	artifacts: true,
	commissions: true,
	company: true
}).extend({
	crNumber: z
		.string()
		.regex(new RegExp('^[0-9]{8}-[0-9]{4}$'), {
			message: 'PIN must be in format 12345678-1234'
		})
		.refine(
			(value) => {
				// check if the PIN is valid using the Luhn algorithm
				// https://en.wikipedia.org/wiki/Luhn_algorithm
				// using the last 10 numbers of the PIN without the dash
				const PIN = value.replace('-', '').slice(-10);
				return luhn(PIN);
			},
			{ message: 'Invalid PIN (https://en.wikipedia.org/wiki/Luhn_algorithm)' }
		),
	rfidData: z.string(),
	investment: z.boolean(),
	rfidCode: z.string().regex(new RegExp('^[0-9]{4}$'), {
		message: 'Code must be 4 digits long'
	})
});

export type NewMemberFormSchema = typeof newMemberFormSchema;
