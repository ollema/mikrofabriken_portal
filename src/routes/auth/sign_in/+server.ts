import { dev } from '$app/environment';
import { generateState } from 'arctic';
import { slack } from '$lib/server/oauth.js';

export const GET = async ({ cookies, url }) => {
	const state = generateState();
	const authUrl = slack.createAuthorizationURL(state, ['openid', 'profile', 'email']);
	authUrl.searchParams.set('team', 'T2N3GU5B2');

	cookies.set('slack_oauth_state', state, {
		httpOnly: true,
		secure: !dev,
		path: '/',
		maxAge: 60 * 60
	});

	const redirect = url.searchParams.get('redirect');
	if (redirect) {
		cookies.set('redirect', decodeURIComponent(redirect), {
			httpOnly: true,
			secure: !dev,
			path: '/',
			maxAge: 60 * 60
		});
	}

	return new Response(null, {
		status: 302,
		headers: {
			Location: authUrl.toString()
		}
	});
};
