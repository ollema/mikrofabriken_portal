import type {
	Agreement,
	AgreementType,
	Artifact,
	Commission,
	CommissionType
} from '$lib/types/members.js';

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

export function commissionToHumanReadable(commission: CommissionType): string {
	switch (commission) {
		case 'board/chairman':
			return 'Ordförande';
		case 'board/cashier':
			return 'Kassör';
		case 'board/secretary':
			return 'Sekreterare';
		case 'board/member':
			return 'Ledamot';
		case 'board/alternate':
			return 'Suppleant';
		case 'auditor/member':
			return 'Revisor';
		case 'auditor/alternate':
			return 'Revisor - suppleant';
		case 'committee/economy':
			return 'Ekonomigruppen';
		case 'committee/it':
			return 'IT-gruppen';
		case 'committee/pr':
			return 'PR-gruppen';
		case 'committee/sponsorships':
			return 'Sponsringsgruppen';
		case 'nomination/chairman':
			return 'Valberedningen - sammankallande';
		case 'nomination/member':
			return 'Valberedningen';
		case 'workshop/3dprint':
			return 'Omk. 3D-print';
		case 'workshop/3s':
			return 'Omk. 3S (slip, svets & smedja)';
		case 'workshop/asylumstorage':
			return 'Omk. Asylum & lagring';
		case 'workshop/brewery':
			return 'Omk. Bryggeri';
		case 'workshop/electronics':
			return 'Omk. Elektronik';
		case 'workshop/laser':
			return 'Omk. Laser';
		case 'workshop/metal':
			return 'Omk. Metall';
		case 'workshop/office':
			return 'Omk. Kontor';
		case 'workshop/painting':
			return 'Omk. Måleri';
		case 'workshop/plaza':
			return 'Omk. Torg & kök';
		case 'workshop/support':
			return 'Omk. Support';
		case 'workshop/textile':
			return 'Omk. Textil';
		case 'workshop/vehicle':
			return 'Omk. Fordon';
		case 'workshop/wood':
			return 'Omk. Trä';
		default: {
			const exhaustive: never = commission;
			return exhaustive;
		}
	}
}
