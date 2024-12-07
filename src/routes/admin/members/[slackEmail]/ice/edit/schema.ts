import { MemberSchema } from '$lib/schemas/members.js';

export const iceContactsFormSchema = MemberSchema.pick({
	iceContacts: true
});

export type IceContactsFormSchema = typeof iceContactsFormSchema;
