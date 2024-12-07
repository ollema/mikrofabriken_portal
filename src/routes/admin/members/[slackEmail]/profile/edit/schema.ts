import { MemberSchema } from '$lib/schemas/members.js';

export const profileFormSchema = MemberSchema.omit({
	iceContacts: true,
	agreements: true,
	artifacts: true,
	commissions: true,
	company: true
});

export type ProfileFormSchema = typeof profileFormSchema;
