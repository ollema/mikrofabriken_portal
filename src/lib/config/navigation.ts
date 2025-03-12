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
				title: 'Medlemmar',
				href: '/mikrofabriken/members'
			},
			{
				title: 'Områdeskommittéer',
				href: '/mikrofabriken/omks'
			},
			{
				title: 'Styrelsen',
				href: '/mikrofabriken/board'
			},
			{
				title: 'Övriga roller',
				href: '/mikrofabriken/groups'
			}
		]
	},
	{
		title: 'Medlemskap',
		items: [
			{
				title: 'Profil',
				href: '/membership/profile'
			},
			{
				title: 'Fakturor',
				href: '/membership/invoices'
			}
		]
	},
	{
		title: 'Kiosk',
		items: [
			{
				title: 'Skanna',
				href: '/kiosk/scan'
			},
			{
				title: 'Bläddra',
				href: '/kiosk/browse'
			},
			{
				title: 'Köphistorik',
				href: '/kiosk/purchases'
			}
		]
	},
	{
		title: 'Lagring',
		items: [
			{
				title: 'Schackrutor',
				href: '/project-storage/short-term'
			},
			{
				title: 'Tillfälliga projektytor',
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
				title: 'Medlemslista',
				requireAdmin: true,
				href: '/admin/members'
			},
			{
				title: 'Inval',
				requireAdmin: true,
				href: '/admin/inval'
			},
			{
				title: 'Produkter',
				requireViewProducts: true,
				href: '/admin/products'
			},
			{
				title: 'Arbetspooler',
				requireViewWorkPools: true,
				href: '/admin/work-pools'
			},
			{
				title: 'Pallar',
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
