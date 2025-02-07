declare global {
	namespace App {
		interface Locals {
			user: import('$lib/server/auth').SessionValidationResult['user'];
			session: import('$lib/server/auth').SessionValidationResult['session'];
			allowedToViewProducts: boolean;
			allowedToViewWorkPools: boolean;
			allowedToViewPallets: boolean;
		}
		interface PageData {
			user: import('$lib/server/auth').SessionValidationResult['user'];
			allowedToViewProducts: boolean;
			allowedToViewWorkPools: boolean;
			allowedToViewPallets: boolean;
		}
	}
}

export {};
