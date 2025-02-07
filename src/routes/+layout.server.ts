export const load = (event) => {
	return {
		user: event.locals.user,
		allowedToViewProducts: event.locals.allowedToViewProducts,
		allowedToViewWorkPools: event.locals.allowedToViewWorkPools,
		allowedToViewPallets: event.locals.allowedToViewPallets
	};
};
