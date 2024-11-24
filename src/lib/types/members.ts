import type { z } from 'zod';

import type { MembersSchema, MemberSchema } from '$lib/schemas/members';

export type Members = z.infer<typeof MembersSchema>;
export type Member = z.infer<typeof MemberSchema>;

type MembershipStatus = 'active' | 'passive' | 'none';
export type ExtendedMember = Member & {
	membership: MembershipStatus;
	memberSince: string | null;
	hasInvestment: boolean;
	hasAsylumInside: boolean;
	hasAsylumOutside: boolean;
	hasPallet: boolean;
	hasCompany: boolean;
};

export type Agreement = z.infer<typeof MembersSchema.element.shape.agreements.element>;
export type AgreementType = Agreement['type'];

export type Artifact = z.infer<typeof MembersSchema.element.shape.artifacts.element>;
export type ArtifactType = Artifact['type'];

export type Commission = z.infer<typeof MembersSchema.element.shape.commissions.element>;
export type CommissionType = Commission['type'];
