import { generateState } from 'arctic';
import { dev } from '$app/environment';
import { slack } from '$lib/server/oauth.js';

import { env } from '$env/dynamic/private';

export const GET = ({ cookies, url }) => {
	const state = generateState();
	const authUrl = slack.createAuthorizationURL(state, ['openid', 'profile', 'email']);
	authUrl.searchParams.set('team', env.SLACK_TEAM_ID);

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
