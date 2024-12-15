import { z } from 'zod';

export const IceContact = z
	.object({
		name: z.string().min(1, { message: 'Name needs to be at least 1 character long' }),
		phone: z.string().regex(/^[0-9]{10}$/, {
			message: 'Phone number must start with 0 and be 10 digits long'
		})
	})
	.strict();

export const AgreementTypes = z.enum([
	'membership',
	'investment',
	'passive',
	'asylumInside',
	'asylumOutside',
	'palletInside',
	'palletOutside'
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

export const ArtifactTypes = z.enum(['key', 'rfid']);

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

export const CommissionSchema = z
	.object({
		type: CommissionTypes,
		startDate: z.string(),
		endDate: z.string().optional()
	})
	.strict();

export const InvoiceCategoryTypes = z.enum([
	'electricity',
	'kiosk',
	'lootmobile',
	'membershipFees',
	'projectStorage',
	'temporaryStorage'
]);

export const CompanySchema = z
	.object({
		orgNum: z.string().regex(new RegExp('^[0-9]{6}-[0-9]{4}$'), {
			message: 'Org. number must be in format 123456-1234'
		}),
		name: z.string().min(1, { message: 'Name needs to be at least 1 character long' }),
		postalAdress: z
			.string()
			.min(1, { message: 'Postal address needs to be at least 1 character long' }),
		postalCode: z.string().min(1, { message: 'Postal code needs to be at least 1 character long' }),
		postalCity: z.string().min(1, { message: 'Postal city needs to be at least 1 character long' }),
		email: z.string().email({ message: 'Email needs to be a valid email address' }).optional(),
		invoiceDefaultTo: z.enum(['personal', 'company']),
		invoiceExcludeCategoriesFromDefault: z.array(InvoiceCategoryTypes)
	})
	.strict();

export const MemberSchema = z
	.object({
		crNumber: z.string().regex(/^[0-9]{8}-[0-9]{4}$/, {
			message: 'PIN must be in format 12345678-1234'
		}),
		slackID: z.string().min(1, { message: 'Slack ID needs to be at least 1 character long' }),
		name: z.string().min(1, { message: 'Name needs to be at least 1 character long' }),
		postalAdress: z
			.string()
			.min(1, { message: 'Postal address needs to be at least 1 character long' }),
		postalCode: z.string().min(1, { message: 'Postal code needs to be at least 1 character long' }),
		postalCity: z.string().min(1, { message: 'Postal city needs to be at least 1 character long' }),
		email: z.string().email({ message: 'Email needs to be a valid email address' }),
		slackEmail: z
			.string()
			.email({ message: 'Slack email needs to be a valid email address' })
			.optional(),
		phone: z.string().regex(/^[0-9]{10}$/, {
			message: 'Phone number must start with 0 and be 10 digits long'
		}),
		iceContacts: z.array(IceContact),
		agreements: z.array(AgreementSchema),
		artifacts: z.array(ArtifactSchema),
		commissions: z.array(CommissionSchema),
		workPools: z.array(z.any()),
		company: CompanySchema.optional()
	})
	.strict();

export const MembersSchema = z.array(MemberSchema);
