import { MemberSchema } from '$lib/schemas/members';

export const iceContactsFormSchema = MemberSchema.pick({
	iceContacts: true
});

export type IceContactsFormSchema = typeof iceContactsFormSchema;
