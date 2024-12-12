import type { z } from 'zod';

import type {
	MembersSchema,
	MemberSchema,
	CompanySchema,
	InvoiceCategoryTypes
} from '$lib/schemas/members.js';

export type Members = z.infer<typeof MembersSchema>;
export type Member = z.infer<typeof MemberSchema>;

type MembershipStatus = 'active' | 'passive' | 'none';
export type ExtendedMember = Member & {
	membership: MembershipStatus;
	memberSince: string | null;
	hasInvestment: string;
	hasAsylumInside: string;
	hasAsylumOutside: string;
	hasPallet: string;
	hasCompany: string;
};

export type Company = z.infer<typeof CompanySchema>;

export type CompanyInvoiceCategoryType = z.infer<typeof InvoiceCategoryTypes>;

export type IceContact = z.infer<typeof MembersSchema.element.shape.iceContacts.element>;

export type Agreement = z.infer<typeof MembersSchema.element.shape.agreements.element>;
export type AgreementType = Agreement['type'];

export type Artifact = z.infer<typeof MembersSchema.element.shape.artifacts.element>;
export type ArtifactType = Artifact['type'];

export type Commission = z.infer<typeof MembersSchema.element.shape.commissions.element>;
export type CommissionType = Commission['type'];
