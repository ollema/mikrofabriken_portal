import type { z } from 'zod';

import type { Member } from '$lib/types/members';
import type { formSchema } from '$lib/schemas/company';

export function populateFromCurrent(member: Member) {
	const excludedCategories = member.company?.invoiceExcludeCategoriesFromDefault ?? [];

	const data = {
		...member.company,
		invoiceDefaultTo: member.company?.invoiceDefaultTo ?? 'company',
		excludeElectricity: excludedCategories.includes('electricity'),
		excludeKiosk: excludedCategories.includes('kiosk'),
		excludeLootmobile: excludedCategories.includes('lootmobile'),
		excludeMembershipFees: excludedCategories.includes('membershipFees'),
		excludeProjectStorage: excludedCategories.includes('projectStorage'),
		excludeTemporaryStorage: excludedCategories.includes('temporaryStorage')
	};

	return data;
}

export function updateMember(member: Member, data: z.infer<typeof formSchema>): Member {
	const suggestedMember = {
		...member,
		company: {
			...data
		}
	};

	return suggestedMember;
}

function arrayEquals(a: string[], b: string[]) {
	return a.length === b.length && a.every((v, i) => v === b[i]);
}

export function companyDeepEqual(a: Member, b: Member) {
	return (
		a.company?.orgNum === b.company?.orgNum &&
		a.company?.name === b.company?.name &&
		a.company?.email === b.company?.email &&
		a.company?.postalAdress === b.company?.postalAdress &&
		a.company?.postalCode === b.company?.postalCode &&
		a.company?.postalCity === b.company?.postalCity &&
		a.company?.invoiceDefaultTo === b.company?.invoiceDefaultTo &&
		arrayEquals(
			a.company?.invoiceExcludeCategoriesFromDefault ?? [],
			b.company?.invoiceExcludeCategoriesFromDefault ?? []
		)
	);
}

export function updateMembersInPlace(member: Member, updatedMember: Member) {
	if (!updatedMember.company) {
		member.company = undefined;
	} else {
		member.company = updatedMember.company;
	}
}
