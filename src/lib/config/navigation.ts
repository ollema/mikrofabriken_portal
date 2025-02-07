export type Navigation = {
	title: string;
	requireAdmin?: boolean;
	requireViewProducts?: boolean;
	requireViewWorkPools?: boolean;
	requireViewPallets?: boolean;
	items: NavItem[];
};

export type NavItem = {
	title: string;
	requireAdmin?: boolean;
	requireViewProducts?: boolean;
	requireViewWorkPools?: boolean;
	requireViewPallets?: boolean;
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
			},
			{
				title: 'Other groups',
				href: '/mikrofabriken/groups'
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
		title: 'Project storage',
		items: [
			{
				title: 'Short term',
				href: '/project-storage/short-term'
			},
			{
				title: 'Medium term',
				href: '/project-storage/medium-term'
			}
		]
	},
	{
		title: 'Admin',
		requireAdmin: true,
		requireViewProducts: true,
		requireViewWorkPools: true,
		requireViewPallets: true,
		items: [
			{
				title: 'Members',
				requireAdmin: true,
				href: '/admin/members'
			},
			{
				title: 'Products',
				requireViewProducts: true,
				href: '/admin/products'
			},
			{
				title: 'Work pools',
				requireViewWorkPools: true,
				href: '/admin/work-pools'
			},
			{
				title: 'Pallets',
				requireViewPallets: true,
				href: '/admin/pallets'
			}
		]
	}
];

export function allowedToViewCategory(
	requireAdmin: boolean | undefined,
	requireViewProducts: boolean | undefined,
	requireViewWorkPools: boolean | undefined,
	requireViewPallets: boolean | undefined,
	admin: boolean | undefined,
	allowedToViewProducts: boolean | undefined,
	allowedToViewWorkPools: boolean | undefined,
	allowedToViewPallets: boolean | undefined
) {
	if (admin === true) return true;
	if (!requireAdmin && !requireViewProducts && !requireViewWorkPools) return true;
	if (requireViewProducts && allowedToViewProducts) return true;
	if (requireViewWorkPools && allowedToViewWorkPools) return true;
	if (requireViewPallets && allowedToViewPallets) return true;
	return false;
}

export function allowedToViewPage(
	requireAdmin: boolean | undefined,
	requireViewProducts: boolean | undefined,
	requireViewWorkPools: boolean | undefined,
	requireViewPallets: boolean | undefined,
	admin: boolean | undefined,
	allowedToViewProducts: boolean | undefined,
	allowedToViewWorkPools: boolean | undefined,
	allowedToViewPallets: boolean | undefined
) {
	if (admin === true) return true;
	if (!requireAdmin && !requireViewProducts && !requireViewWorkPools) return true;
	if (requireViewProducts && allowedToViewProducts) return true;
	if (requireViewWorkPools && allowedToViewWorkPools) return true;
	if (requireViewPallets && allowedToViewPallets) return true;
	return false;
}
