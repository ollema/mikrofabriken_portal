import type { Member } from '$lib/types/members.js';
import { getUser } from '$lib/server/auth.js';
import { getMembers } from '$lib/server/members.js';

type PalletInfo = {
	id: number;
	member: {
		name: string;
		slackID: string;
	};
};

export const load = ({ locals }) => {
	getUser(locals);
	const members = getMembers();

	const pallets: Array<PalletInfo> = [];

	members.forEach((member: Member) => {
		member.agreements.forEach((agreement) => {
			if (
				(agreement.type === 'palletInside' || agreement.type === 'palletOutside') &&
				!agreement.endDate
			) {
				agreement.attributes.palletIds.forEach((palletId) => {
					pallets.push({
						id: palletId,
						member: {
							name: member.name,
							slackID: member.slackID
						}
					});
				});
			}
		});
	});

	const midPoint = Math.ceil(pallets.length / 2);

	pallets.sort((a, b) => a.id - b.id);

	return {
		pallets,
		leftPallets: pallets.slice(0, midPoint),
		rightPallets: pallets.slice(midPoint)
	};
};
