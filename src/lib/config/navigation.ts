import type { Claims } from '$lib/types/cog.js';

export type Navigation = {
	title: string;
	requireAdmin?: boolean;
	requireClaims?: Claims;
	items: NavItem[];
};

export type NavItem = {
	title: string;
	requireAdmin?: boolean;
	requireClaims?: Claims;
	href: string;
};

export const navigation: Navigation[] = [
	{
		title: 'Mikrofabriken',
		items: [
			{
				title: 'Members',
				href: '/mikrofabriken/members'
			},
			{
				title: 'OMKs',
				href: '/mikrofabriken/omks'
			},
			{
				title: 'Board',
				href: '/mikrofabriken/board'
			}
		]
	},
	{
		title: 'Membership',
		items: [
			{
				title: 'Profile',
				href: '/membership/profile'
			},
			{
				title: 'Invoices',
				href: '/membership/invoices'
			}
		]
	},
	{
		title: 'Kiosk',
		items: [
			{
				title: 'Scan',
				href: '/kiosk/scan'
			},
			{
				title: 'Browse',
				href: '/kiosk/browse'
			},
			{
				title: 'Purchases',
				href: '/kiosk/purchases'
			}
		]
	},
	{
		title: 'Admin',
		requireAdmin: true,
		requireClaims: [{ resource: 'api:products', action: 'Update' }],
		items: [
			{
				title: 'Members',
				requireAdmin: true,
				href: '/admin/members'
			},
			{
				title: 'Products',
				requireClaims: [{ resource: 'api:products', action: 'Update' }],
				href: '/admin/products'
			}
		]
	}
];

export function allowedToViewCategory(
	adminCategory: boolean | undefined,
	requireClaims: Claims | undefined,
	admin: boolean | undefined,
	claims: Claims | undefined
) {
	// admins should have access to everything
	if (admin === true) return true;

	// for admin categories it's enough to have the admin role...
	if (!adminCategory && !requireClaims) return true;

	// ..or certain claims that are associated with the category
	if (claims && requireClaims) {
		return requireClaims.some((claim) =>
			claims.some((c) => c.resource === claim.resource && c.action === claim.action)
		);
	}

	// otherwise, hide the category
	return false;
}

export function allowedToViewPage(
	adminPage: boolean | undefined,
	requireClaims: Claims | undefined,
	admin: boolean | undefined,
	claims: Claims | undefined
) {
	// admins should have access to everything
	if (admin === true) return true;

	// for admin pages it's enough to have the admin role...
	if (!adminPage && !requireClaims) return true;

	// ..or certain claims that are associated with the page
	if (claims && requireClaims) {
		return requireClaims.some((claim) =>
			claims.some((c) => c.resource === claim.resource && c.action === claim.action)
		);
	}

	// otherwise, hide the page
	return false;
}
