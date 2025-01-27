import type { Agreement, AgreementType, Artifact, Commission } from '$lib/types/members.js';

export function appendPossessive(name: string): string {
	if (name.endsWith('s')) {
		return name + "'";
	} else {
		return name + "'s";
	}
}

export function nameToInitials(name: string): string {
	try {
		return name
			.trim()
			.split(' ')
			.map((part) => part[0].toUpperCase())
			.join('');
	} catch (e) {
		console.error(e, name);
		return name[0].toUpperCase();
	}
}

export function nameToFirstName(name: string): string {
	return name.split(' ')[0];
}

export function isAgreementActive(agreement: Agreement) {
	const currentDate = new Date();

	if (agreement.startDate && new Date(agreement.startDate) > currentDate) {
		return false;
	}

	return !agreement.endDate || new Date(agreement.endDate) > currentDate;
}

export function isArtifactActive(artifact: Artifact) {
	const currentDate = new Date();

	if (artifact.startDate && new Date(artifact.startDate) > currentDate) {
		return false;
	}

	return !artifact.endDate || new Date(artifact.endDate) > currentDate;
}

export function isCommissionActive(commission: Commission): boolean {
	const currentDate = new Date();

	if (commission.startDate && new Date(commission.startDate) > currentDate) {
		return false;
	}

	return !commission.endDate || new Date(commission.endDate) > currentDate;
}

export function agreementToHumanReadable(agreement: AgreementType): string {
	switch (agreement) {
		case 'membership':
			return 'Membership';
		case 'investment':
			return 'Investment';
		case 'passive':
			return 'Passive';
		case 'asylumInside':
			return 'Asylum';
		case 'asylumOutside':
			return 'Asylum (outside)';
		case 'palletInside':
			return 'Pallet';
		case 'palletOutside':
			return 'Pallet (outside)';
		default: {
			const exhaustive: never = agreement;
			return exhaustive;
		}
	}
}
