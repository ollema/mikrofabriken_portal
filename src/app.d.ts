import type { SessionValidationResult } from '$lib/server/auth';

declare global {
	namespace App {
		interface Locals {
			user: SessionValidationResult['user'];
			session: SessionValidationResult['session'];
			allowedToViewProducts: boolean;
			allowedToViewWorkPools: boolean;
			allowedToViewPallets: boolean;
		}
		interface PageData {
			user: SessionValidationResult['user'];
			allowedToViewProducts: boolean;
			allowedToViewWorkPools: boolean;
			allowedToViewPallets: boolean;
		}
	}
}

export {};
