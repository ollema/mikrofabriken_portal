import { redirect } from '@sveltejs/kit';
import { deleteSessionTokenCookie, invalidateSession } from '$lib/server/auth.js';

export const POST = async (event) => {
	if (!event.locals.session) redirect(302, '/');

	await invalidateSession(event.locals.session.id);
	deleteSessionTokenCookie(event);

	event.locals.session = null;
	event.locals.user = null;

	redirect(302, '/');
};
