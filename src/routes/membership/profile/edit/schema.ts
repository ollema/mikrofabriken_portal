import { MemberSchema } from '$lib/schemas/members.js';

export const profileFormSchema = MemberSchema.omit({
	crNumber: true,
	slackEmail: true,
	iceContacts: true,
	agreements: true,
	artifacts: true,
	commissions: true,
	company: true
});

export type ProfileFormSchema = typeof profileFormSchema;
