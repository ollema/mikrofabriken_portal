import type { Claims } from '$lib/types/cog.js';

export function hasClaim(claims: Claims, resource: string, action: string): boolean {
	for (const claim of claims) {
		if (claim.resource === resource && claim.action === action) {
			return true;
		}
	}

	return false;
}
