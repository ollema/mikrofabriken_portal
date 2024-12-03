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
	'palletOutside'
]);

/**
 * Represents the types of artifacts.
 */
export const ArtifactTypes = z.enum(['key', 'rfid']);

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
	'auditor/alternate',
	'committee/economy',
	'committee/it',
	'committee/pr',
	'committee/sponsorships',
	'nomination/chairman',
	'nomination/member',
	'workshop/3dprint',
	'workshop/3s',
	'workshop/asylumstorage',
	'workshop/brewery',
	'workshop/electronics',
	'workshop/laser',
	'workshop/metal',
	'workshop/office',
	'workshop/painting',
	'workshop/plaza',
	'workshop/support',
	'workshop/textile',
	'workshop/vehicle',
	'workshop/wood'
]);

const BaseAgreementSchema = z.object({
	startDate: z.string(),
	endDate: z.string().optional()
});

const MembershipAgreementSchema = BaseAgreementSchema.extend({
	type: z.literal('membership')
});

const InvestmentAgreementSchema = BaseAgreementSchema.extend({
	type: z.literal('investment')
});

const PassiveAgreementSchema = BaseAgreementSchema.extend({
	type: z.literal('passive')
});

const AsylumInsideAgreementSchema = BaseAgreementSchema.extend({
	type: z.literal('asylumInside'),
	attributes: z
		.object({
			size: z.number().min(1)
		})
		.strict()
});

const AsylumOutsideAgreementSchema = BaseAgreementSchema.extend({
	type: z.literal('asylumOutside'),
	attributes: z
		.object({
			size: z.number().min(1)
		})
		.strict()
});

const PalletInsideAgreementSchema = BaseAgreementSchema.extend({
	type: z.literal('palletInside'),
	attributes: z
		.object({
			palletCount: z.number().int().min(1),
			palletIds: z.array(z.number().int()).min(1)
		})
		.strict()
});

const PalletOutsideAgreementSchema = BaseAgreementSchema.extend({
	type: z.literal('palletOutside'),
	attributes: z
		.object({
			palletCount: z.number().int().min(1),
			palletIds: z.array(z.number().int()).min(1)
		})
		.strict()
});

export const AgreementSchema = z.discriminatedUnion('type', [
	MembershipAgreementSchema,
	InvestmentAgreementSchema,
	PassiveAgreementSchema,
	AsylumInsideAgreementSchema,
	AsylumOutsideAgreementSchema,
	PalletInsideAgreementSchema,
	PalletOutsideAgreementSchema
]);

const BaseArtifactSchema = z.object({
	startDate: z.string(),
	endDate: z.string().optional()
});

const KeyArtifactSchema = BaseArtifactSchema.extend({
	type: z.literal('key'),
	attributes: z
		.object({
			number: z.number().int().min(1)
		})
		.strict()
});

const RfidArtifactSchema = BaseArtifactSchema.extend({
	type: z.literal('rfid'),
	attributes: z
		.object({
			data: z.string().min(1),
			codeHash: z.string().min(1)
		})
		.strict()
});

export const ArtifactSchema = z.discriminatedUnion('type', [KeyArtifactSchema, RfidArtifactSchema]);

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
		crNumber: z.string().regex(/^[0-9]{8}-[0-9]{4}$/, {
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
		phone: z.string().regex(/^[0-9]{10}$/, {
			message: 'Phone number must start with 0 and be 10 digits long'
		}),
		agreements: z.array(AgreementSchema),
		artifacts: z.array(ArtifactSchema),
		commissions: z.array(CommissionSchema),
		company: CompanySchema.optional()
	})
	.strict();

export const MembersSchema = z.array(MemberSchema);

export const formSchema = MemberSchema.omit({
	crNumber: true,
	slackEmail: true,
	agreements: true,
	artifacts: true,
	commissions: true,
	company: true
});

export const rfidFormSchema = z.object({
	rfidData: z.string(),
	rfidCode: z.string().regex(/^[0-9]{4}$/, {
		message: 'Code must be 4 digits long'
	})
});

export const newMemberLinkFormSchema = MemberSchema.pick({
	slackEmail: true
}).extend({
	rfidData: z.string(),
	investment: z.boolean()
});

export const newMemberFormSchema = MemberSchema.omit({
	crNumber: true,
	agreements: true,
	artifacts: true,
	commissions: true,
	company: true
}).extend({
	crNumber: z
		.string()
		.regex(/^[0-9]{8}-[0-9]{4}$/, {
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
	rfidCode: z.string().regex(/^[0-9]{4}$/, {
		message: 'Code must be 4 digits long'
	})
});

export type FormSchema = typeof formSchema;
export type RfidFormSchema = typeof rfidFormSchema;
export type NewMemberLinkFormSchema = typeof newMemberLinkFormSchema;
export type NewMemberFormSchema = typeof newMemberFormSchema;
