import { getUser } from '$lib/server/auth.js';
import { getMembers } from '$lib/server/members.js';
import type { Member } from '$lib/types/members.js';

type PalletInfo = {
	id: number;
	member?: {
		name: string;
		slackID: string;
	};
};

const minimumPallets = 24;

export const load = async ({ locals }) => {
	getUser(locals);
	const members = getMembers();

	// First find the highest pallet ID in use
	let maxPalletId = minimumPallets;
	members.forEach((member: Member) => {
		member.agreements.forEach((agreement) => {
			if (
				(agreement.type === 'palletInside' || agreement.type === 'palletOutside') &&
				!agreement.endDate
			) {
				const highestId = Math.max(...agreement.attributes.palletIds);
				maxPalletId = Math.max(maxPalletId, highestId);
			}
		});
	});

	// Create array of all pallets up to maxPalletId
	const pallets: PalletInfo[] = Array.from({ length: maxPalletId }, (_, i) => ({
		id: i + 1
	}));

	// Assign members to pallets
	members.forEach((member: Member) => {
		member.agreements.forEach((agreement) => {
			if (
				(agreement.type === 'palletInside' || agreement.type === 'palletOutside') &&
				!agreement.endDate
			) {
				agreement.attributes.palletIds.forEach((palletId) => {
					pallets[palletId - 1].member = {
						name: member.name,
						slackID: member.slackID
					};
				});
			}
		});
	});

	const midPoint = Math.ceil(pallets.length / 2);
	return {
		pallets,
		leftPallets: pallets.slice(0, midPoint),
		rightPallets: pallets.slice(midPoint)
	};
};
