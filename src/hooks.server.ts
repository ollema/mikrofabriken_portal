import { redirect, type Handle } from '@sveltejs/kit';
import * as auth from '$lib/server/auth.js';
import { hasClaim } from '$lib/utils/cog';

const handleAuth: Handle = async ({ event, resolve }) => {
	const sessionToken = event.cookies.get(auth.sessionCookieName);
	if (!sessionToken) {
		event.locals.user = null;
		event.locals.session = null;

		// validate admin role
		if (event.url.pathname.startsWith('/admin')) {
			// users without a session can never be admins
			// therefore always block access by redirecting to sign in page
			redirect(303, '/auth/sign_in');
		}

		return resolve(event);
	}

	const { session, user } = await auth.validateSessionToken(sessionToken);
	if (session) {
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
	} else {
		auth.deleteSessionTokenCookie(event);
	}

	event.locals.user = user;
	event.locals.session = session;

	// validate admin role
	if (event.url.pathname.startsWith('/admin')) {
		// admins should have access to everything
		if (event.locals.user && event.locals.user.role == 'admin') {
			return await resolve(event);
		}

		// for some admin pages it's enough to have certain claims
		if (event.url.pathname.startsWith('/admin/products')) {
			if (event.locals.user && event.locals.user.claims) {
				if (hasClaim(event.locals.user.claims, 'api:products', 'Update')) {
					return await resolve(event);
				}
			}
		}

		// otherwise block access by redirecting to the home page
		redirect(303, '/');
	}

	return resolve(event);
};

export const handle: Handle = handleAuth;
