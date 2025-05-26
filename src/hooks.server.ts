import { redirect } from '@sveltejs/kit';
import type { Handle } from '@sveltejs/kit';
import * as auth from '$lib/server/auth.js';
import { hasClaim } from '$lib/utils/cog';
import { getMember } from '$lib/server/members';
import { getWorkPools } from '$lib/server/workpools';
import { isCommissionActive } from '$lib/utils/member';

const handleAuth: Handle = async ({ event, resolve }) => {
	// these flags passed to the the client through +layout.server.ts
	// while they could in theory be possible to modify client side it would
	// only allow the user to view the category in the sidebar, not actually
	// load the page since that is prevented here in the server hooks
	event.locals.allowedToViewProducts = false;
	event.locals.allowedToViewWorkPools = false;
	event.locals.allowedToViewPallets = false;

	// --------------------------------------------------------------------------
	// fetch session token from cookies
	// --------------------------------------------------------------------------
	const sessionToken = event.cookies.get(auth.sessionCookieName);

	// --------------------------------------------------------------------------
	// handle users without a session
	// --------------------------------------------------------------------------
	if (!sessionToken) {
		event.locals.user = null;
		event.locals.session = null;
		if (event.url.pathname.startsWith('/admin')) {
			// users without a session can never be admins
			// therefore always block access by redirecting to sign in page
			// ----------------------------------------------------------------------
			// redirect unauthorized users to the sign in page
			// ----------------------------------------------------------------------
			redirect(303, '/auth/sign_in');
		}

		// ------------------------------------------------------------------------
		// render and return response
		// ------------------------------------------------------------------------
		return resolve(event);
	}

	// --------------------------------------------------------------------------
	// handle users with a session
	// --------------------------------------------------------------------------
	const { session, user } = await auth.validateSessionToken(sessionToken);
	if (session) {
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
	} else {
		auth.deleteSessionTokenCookie(event);
	}

	event.locals.user = user;
	event.locals.session = session;

	// for the admin/products page it's enough to have the api:products update claim
	event.locals.allowedToViewProducts = hasClaim(
		event.locals.user?.claims,
		'api:products',
		'Update'
	);

	// for the admin/workpools page it's enough to have an active commission that manages a work pool
	const member = event.locals.user && getMember(event.locals.user.slackID);
	const workPools = getWorkPools();
	event.locals.allowedToViewWorkPools =
		member !== null &&
		member.commissions.some(
			(commission) =>
				isCommissionActive(commission) &&
				workPools.some((pool) => pool.managedByCommissions.includes(commission.type))
		);

	// for the admin/pallets page, it's enough to have an active 'workshop/asylumstorage' commission
	event.locals.allowedToViewPallets =
		member !== null &&
		member.commissions.some(
			(commission) => isCommissionActive(commission) && commission.type === 'workshop/asylumstorage'
		);

	// validate admin role
	if (event.url.pathname.startsWith('/admin')) {
		// admins should have access to everything
		if (event.locals.user && event.locals.user.role == 'admin') {
			return await resolve(event);
		}

		if (event.url.pathname.startsWith('/admin/products')) {
			if (event.locals.allowedToViewProducts) {
				return await resolve(event);
			}
		}

		if (event.url.pathname.startsWith('/admin/work-pools')) {
			if (event.locals.allowedToViewWorkPools) {
				return await resolve(event);
			}
		}

		if (event.url.pathname.startsWith('/admin/pallets')) {
			if (event.locals.allowedToViewPallets) {
				return await resolve(event);
			}
		}

		// otherwise block access by redirecting to the home page
		redirect(303, '/');
	}

	return resolve(event);
};

export const handle: Handle = handleAuth;
