import { isAgreementActive, isCommissionActive } from '$lib/utils/member.js';
import { getAvatar } from '$lib/server/cog.js';
import type { Member } from '$lib/types/members.js';

const formatMember = (here: Record<string, boolean>) => async (member: Member) => {
	return {
		name: member.name,
		avatar: await getAvatar(member.crNumber),
		here: here[member.crNumber] || false,
		commissions: member.commissions.reduce((acc: string[], commission) => {
			if (isCommissionActive(commission)) {
				acc.push(commission.type);
			}
			return acc;
		}, [] as string[])
	};
};

export async function getFormattedMembers(members: Member[], here: Record<string, boolean>) {
	const activeMembers = members.filter((member) => {
		let hasActiveMembership = false;
		let hasActivePassiveMembership = false;

		for (const agreement of member.agreements) {
			if (agreement.type === 'membership' && isAgreementActive(agreement)) {
				hasActiveMembership = true;
			}

			if (agreement.type === 'passive' && isAgreementActive(agreement)) {
				hasActivePassiveMembership = true;
			}
		}

		return hasActiveMembership && !hasActivePassiveMembership;
	});

	const sortedMembers = activeMembers.sort((a, b) => a.name.localeCompare(b.name));

	return Promise.all(sortedMembers.map(formatMember(here)));
}

export async function getFormattedMembersBasedOnCommissions(
	members: Member[],
	here: Record<string, boolean>
) {
	const activeMembers = members.filter((member) => {
		let hasActiveMembership = false;
		let hasActivePassiveMembership = false;

		for (const agreement of member.agreements) {
			if (agreement.type === 'membership' && isAgreementActive(agreement)) {
				hasActiveMembership = true;
			}

			if (agreement.type === 'passive' && isAgreementActive(agreement)) {
				hasActivePassiveMembership = true;
			}
		}

		return hasActiveMembership && !hasActivePassiveMembership;
	});

	const sortedMembers = activeMembers.sort((a, b) => a.name.localeCompare(b.name));

	const membersInChairman = [];
	const membersInCashier = [];
	const membersInSecretary = [];
	const membersInMember = [];
	const membersInAlternate = [];
	const membersInAuditor = [];
	const membersInPortalAdmin = [];
	const membersInNomination = [];
	const membersInGroupEconomy = [];
	const membersInGroupGate = [];
	const membersInGroupIT = [];
	const membersInGroupPR = [];
	const membersInGroupSpons = [];
	const membersInOmk3dPrint = [];
	const membersInOmk3s = [];
	const membersInOmkAsylumOchLagring = [];
	const membersInOmkBryggeri = [];
	const membersInOmkElektronik = [];
	const membersInOmkFordon = [];
	const membersInOmkKontor = [];
	const membersInOmkLaser = [];
	const membersInOmkMaleri = [];
	const membersInOmkMetall = [];
	const membersInOmkSupport = [];
	const membersInOmkTextil = [];
	const membersInOmkTorget = [];
	const membersInOmkTra = [];

	for (const member of sortedMembers) {
		for (const commission of member.commissions) {
			if (isEntryActive(commission)) {
				switch (commission.type) {
					case 'board/chairman':
						membersInChairman.push(member);
						break;
					case 'board/cashier':
						membersInCashier.push(member);
						break;
					case 'board/secretary':
						membersInSecretary.push(member);
						break;
					case 'board/member':
						membersInMember.push(member);
						break;
					case 'board/alternate':
						membersInAlternate.push(member);
						break;
					case 'admin/portal':
						membersInPortalAdmin.push(member);
						break;
					case 'auditor/member':
						membersInAuditor.push(member);
						break;
					case 'auditor/alternate':
						membersInAuditor.push(member);
						break;
					case 'nomination/chairman':
						membersInNomination.push(member);
						break;
					case 'nomination/member':
						membersInNomination.push(member);
						break;
					case 'committee/economy':
						membersInGroupEconomy.push(member);
						break;
					case 'committee/gate':
						membersInGroupGate.push(member);
						break;
					case 'committee/it':
						membersInGroupIT.push(member);
						break;
					case 'committee/pr':
						membersInGroupPR.push(member);
						break;
					case 'committee/sponsorships':
						membersInGroupSpons.push(member);
						break;
					case 'workshop/3dprint':
						membersInOmk3dPrint.push(member);
						break;
					case 'workshop/3s':
						membersInOmk3s.push(member);
						break;
					case 'workshop/asylumstorage':
						membersInOmkAsylumOchLagring.push(member);
						break;
					case 'workshop/brewery':
						membersInOmkBryggeri.push(member);
						break;
					case 'workshop/electronics':
						membersInOmkElektronik.push(member);
						break;
					case 'workshop/vehicle':
						membersInOmkFordon.push(member);
						break;
					case 'workshop/office':
						membersInOmkKontor.push(member);
						break;
					case 'workshop/laser':
						membersInOmkLaser.push(member);
						break;
					case 'workshop/painting':
						membersInOmkMaleri.push(member);
						break;
					case 'workshop/metal':
						membersInOmkMetall.push(member);
						break;
					case 'workshop/support':
						membersInOmkSupport.push(member);
						break;
					case 'workshop/textile':
						membersInOmkTextil.push(member);
						break;
					case 'workshop/plaza':
						membersInOmkTorget.push(member);
						break;
					case 'workshop/wood':
						membersInOmkTra.push(member);
						break;
					default:
						console.log(`Unknown commission type: ${commission.type} for member: ${member.name}`);
						process.exit(1);
				}
			}
		}
	}

	return {
		board: [
			{
				label: 'board/chairman',
				members: await Promise.all(membersInChairman.map(formatMember(here)))
			},
			{
				label: 'board/cashier',
				members: await Promise.all(membersInCashier.map(formatMember(here)))
			},
			{
				label: 'board/secretary',
				members: await Promise.all(membersInSecretary.map(formatMember(here)))
			},
			{
				label: 'board/member',
				members: await Promise.all(membersInMember.map(formatMember(here)))
			},
			{
				label: 'board/alternate',
				members: await Promise.all(membersInAlternate.map(formatMember(here)))
			}
		],
		groups: [
			{
				label: 'auditor/member',
				members: await Promise.all(membersInAuditor.map(formatMember(here)))
			},
			{
				label: 'nomination/member',
				members: await Promise.all(membersInNomination.map(formatMember(here)))
			},
			{
				label: 'committee/economy',
				members: await Promise.all(membersInGroupEconomy.map(formatMember(here)))
			},
			{
				label: 'committee/gate',
				members: await Promise.all(membersInGroupGate.map(formatMember(here)))
			},
			{
				label: 'committee/it',
				members: await Promise.all(membersInGroupIT.map(formatMember(here)))
			},
			{
				label: 'committee/pr',
				members: await Promise.all(membersInGroupPR.map(formatMember(here)))
			},
			{
				label: 'committee/sponsorships',
				members: await Promise.all(membersInGroupSpons.map(formatMember(here)))
			},
			{
				label: 'admin/portal',
				members: await Promise.all(membersInPortalAdmin.map(formatMember(here)))
			}
		],
		omks: [
			{
				label: 'workshop/3dprint',
				members: await Promise.all(membersInOmk3dPrint.map(formatMember(here)))
			},
			{
				label: 'workshop/3s',
				members: await Promise.all(membersInOmk3s.map(formatMember(here)))
			},
			{
				label: 'workshop/asylumstorage',
				members: await Promise.all(membersInOmkAsylumOchLagring.map(formatMember(here)))
			},
			{
				label: 'workshop/brewery',
				members: await Promise.all(membersInOmkBryggeri.map(formatMember(here)))
			},
			{
				label: 'workshop/electronics',
				members: await Promise.all(membersInOmkElektronik.map(formatMember(here)))
			},
			{
				label: 'workshop/vehicle',
				members: await Promise.all(membersInOmkFordon.map(formatMember(here)))
			},
			{
				label: 'workshop/office',
				members: await Promise.all(membersInOmkKontor.map(formatMember(here)))
			},
			{
				label: 'workshop/laser',
				members: await Promise.all(membersInOmkLaser.map(formatMember(here)))
			},
			{
				label: 'workshop/painting',
				members: await Promise.all(membersInOmkMaleri.map(formatMember(here)))
			},
			{
				label: 'workshop/metal',
				members: await Promise.all(membersInOmkMetall.map(formatMember(here)))
			},
			{
				label: 'workshop/support',
				members: await Promise.all(membersInOmkSupport.map(formatMember(here)))
			},
			{
				label: 'workshop/textile',
				members: await Promise.all(membersInOmkTextil.map(formatMember(here)))
			},
			{
				label: 'workshop/plaza',
				members: await Promise.all(membersInOmkTorget.map(formatMember(here)))
			},
			{
				label: 'workshop/wood',
				members: await Promise.all(membersInOmkTra.map(formatMember(here)))
			}
		]
	};
}

function isEntryActive(entry: { startDate?: string; endDate?: string | undefined }) {
	const today = new Date();
	if (entry.startDate && new Date(entry.startDate) > today) {
		return false;
	}

	return !entry.endDate || new Date(entry.endDate) > today;
}
