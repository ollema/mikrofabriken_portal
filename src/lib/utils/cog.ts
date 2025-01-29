import type { Claims } from '$lib/types/cog.js';

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
