import { MemberSchema } from '$lib/schemas/members';

export const profileFormSchema = MemberSchema.omit({
	agreements: true,
	artifacts: true,
	commissions: true,
	company: true
});

export type ProfileFormSchema = typeof profileFormSchema;
