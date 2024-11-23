import type { z } from 'zod';

import type { Member } from '$lib/types/members';
import type { formSchema } from '$lib/schemas/members';

export function updateMember(member: Member, data: z.infer<typeof formSchema>): Member {
	const suggestedMember = {
		...member,
		...data
	};

	return suggestedMember;
}

export function profileDeepEqual(a: Member, b: Member) {
	return (
		a.crNumber === b.crNumber &&
		a.name === b.name &&
		a.postalAdress === b.postalAdress &&
		a.postalCode === b.postalCode &&
		a.postalCity === b.postalCity &&
		a.email === b.email &&
		a.slackEmail === b.slackEmail &&
		a.phone === b.phone
	);
}

export function updateMembersInPlace(member: Member, updatedMember: Member) {
	member.crNumber = updatedMember.crNumber;
	member.name = updatedMember.name;
	member.postalAdress = updatedMember.postalAdress;
	member.postalCode = updatedMember.postalCode;
	member.postalCity = updatedMember.postalCity;
	member.email = updatedMember.email;
	member.slackEmail = updatedMember.slackEmail;
	member.phone = updatedMember.phone;
}
