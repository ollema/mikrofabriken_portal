import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types.js';
import { env } from '$env/dynamic/private';
import { getStatus, startUpdate } from '$lib/server/fortnox/fortnox-updater.js';

export const prerender = false;

function authenticate(request: Request) {
	const authHeader = request.headers.get('Authorization');
	if (!authHeader || authHeader !== `Bearer ${env.FINANCE_UPDATE_KEY}`) {
		error(401, 'Unauthorized');
	}
}

export const POST: RequestHandler = ({ request }) => {
	authenticate(request);

	const result = startUpdate();
	if (!result.started) {
		return json({ error: result.reason }, { status: 409 });
	}
	return json({ message: 'Update started' }, { status: 202 });
};

export const GET: RequestHandler = ({ request }) => {
	authenticate(request);

	const status = getStatus();
	return json(status);
};
