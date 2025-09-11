import type { Claims } from '$lib/types/cog.js';
import { getOpenPeriods } from '$lib/server/cog';

export function hasClaim(claims: Claims | undefined, resource: string, action: string): boolean {
	if (claims === undefined) {
		return false;
	}

	for (const claim of claims) {
		if (claim.resource === resource && claim.action === action) {
			return true;
		}
	}

	return false;
}

// gets all the members who are currently present (i.e. have an open period in the room resource)
export async function getPresentMembers(): Promise<Record<string, boolean>> {
	try {
		const periods = await getOpenPeriods('room');
		const here = periods.reduce(
			(acc: Record<string, boolean>, period) => {
				acc[period.memberCrNumber] = true;
				return acc;
			},
			{} as Record<string, boolean>
		);
		return here;
	} catch (e) {
		console.error('could not fetch member presence status', e);
		return {};
	}
}
