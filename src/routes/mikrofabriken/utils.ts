import {
	commissionToHumanReadable,
	isAgreementActive,
	isCommissionActive
} from '$lib/utils/member.js';
import { getAvatar } from '$lib/server/cog.js';
import type { Member } from '$lib/types/members.js';

const formatMember = (here: Record<string, boolean>) => (member: Member) => {
	return {
		name: member.name,
		avatar: getAvatar(member.crNumber),
		here: here[member.crNumber] || false,
		commissions: member.commissions.reduce((acc: string[], commission) => {
			if (isCommissionActive(commission)) {
				acc.push(commissionToHumanReadable(commission.type));
			}
			return acc;
		}, [] as string[])
	};
};

export function getFormattedMembers(members: Member[], here: Record<string, boolean>) {
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

	return sortedMembers.map(formatMember(here));
}

export function getFormattedMembersBasedOnCommissions(
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
	const membersInNomination = [];
	const membersInGroupEconomy = [];
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
					case 'nomination/chairman':
						membersInNomination.push(member);
						break;
					case 'nomination/member':
						membersInNomination.push(member);
						break;
					case 'committee/economy':
						membersInGroupEconomy.push(member);
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
				label: commissionToHumanReadable('board/chairman'),
				members: membersInChairman.map(formatMember(here))
			},
			{
				label: commissionToHumanReadable('board/cashier'),
				members: membersInCashier.map(formatMember(here))
			},
			{
				label: commissionToHumanReadable('board/secretary'),
				members: membersInSecretary.map(formatMember(here))
			},
			{
				label: commissionToHumanReadable('board/member'),
				members: membersInMember.map(formatMember(here))
			},
			{
				label: commissionToHumanReadable('board/alternate'),
				members: membersInAlternate.map(formatMember(here))
			}
		],
		groups: [
			{
				label: commissionToHumanReadable('nomination/member'),
				members: membersInNomination.map(formatMember(here))
			},
			{
				label: commissionToHumanReadable('committee/economy'),
				members: membersInGroupEconomy.map(formatMember(here))
			},
			{
				label: commissionToHumanReadable('committee/it'),
				members: membersInGroupIT.map(formatMember(here))
			},
			{
				label: commissionToHumanReadable('committee/pr'),
				members: membersInGroupPR.map(formatMember(here))
			},
			{
				label: commissionToHumanReadable('committee/sponsorships'),
				members: membersInGroupSpons.map(formatMember(here))
			}
		],
		omks: [
			{
				label: commissionToHumanReadable('workshop/3dprint'),
				members: membersInOmk3dPrint.map(formatMember(here))
			},
			{
				label: commissionToHumanReadable('workshop/3s'),
				members: membersInOmk3s.map(formatMember(here))
			},
			{
				label: commissionToHumanReadable('workshop/asylumstorage'),
				members: membersInOmkAsylumOchLagring.map(formatMember(here))
			},
			{
				label: commissionToHumanReadable('workshop/brewery'),
				members: membersInOmkBryggeri.map(formatMember(here))
			},
			{
				label: commissionToHumanReadable('workshop/electronics'),
				members: membersInOmkElektronik.map(formatMember(here))
			},
			{
				label: commissionToHumanReadable('workshop/vehicle'),
				members: membersInOmkFordon.map(formatMember(here))
			},
			{
				label: commissionToHumanReadable('workshop/office'),
				members: membersInOmkKontor.map(formatMember(here))
			},
			{
				label: commissionToHumanReadable('workshop/laser'),
				members: membersInOmkLaser.map(formatMember(here))
			},
			{
				label: commissionToHumanReadable('workshop/painting'),
				members: membersInOmkMaleri.map(formatMember(here))
			},
			{
				label: commissionToHumanReadable('workshop/metal'),
				members: membersInOmkMetall.map(formatMember(here))
			},
			{
				label: commissionToHumanReadable('workshop/support'),
				members: membersInOmkSupport.map(formatMember(here))
			},
			{
				label: commissionToHumanReadable('workshop/textile'),
				members: membersInOmkTextil.map(formatMember(here))
			},
			{
				label: commissionToHumanReadable('workshop/plaza'),
				members: membersInOmkTorget.map(formatMember(here))
			},
			{
				label: commissionToHumanReadable('workshop/wood'),
				members: membersInOmkTra.map(formatMember(here))
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
