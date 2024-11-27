import { db } from '$lib/server/db/index.js';
import { user } from '$lib/server/db/schema.js';
import {
	createSession,
	generateSessionToken,
	generateUserId,
	isAdmin,
	isMember,
	setSessionTokenCookie
} from '$lib/server/auth.js';
import { OAuth2RequestError, type OAuth2Tokens } from 'arctic';
import { slack } from '$lib/server/oauth.js';
import { getClaims } from '$lib/server/cog.js';
import type { Claims } from '$lib/types/cog.js';

export const GET = async (event) => {
	// get the stored state from cookies and state + code from the URL search params
	const storedState = event.cookies.get('slack_oauth_state');
	const state = event.url.searchParams.get('state');
	const code = event.url.searchParams.get('code');

	// check that all required parameters are present and that the state matches
	if (!storedState || !state || !code || storedState !== state) {
		return new Response(null, { status: 400 });
	}

	try {
		// exchange the authorization code for tokens
		const tokens = await slack.validateAuthorizationCode(code);

		// get the user's information
		const slackUser = await getSlackUser(tokens);

		// validate the mikrofabriken membership
		const { admin, crNumber } = validateMembership(slackUser.email, slackUser.email_verified);

		// get claims from cog (returns empty list if there are connectivity issues)
		const claims = await getClaims(tokens.accessToken(), crNumber);

		// upsert the user in the database
		const user = await upsertUser(slackUser, admin, claims, tokens.accessToken());

		// create a session for the user and set the session cookie
		const sessionToken = generateSessionToken();
		const session = await createSession(sessionToken, user.id);
		setSessionTokenCookie(event, sessionToken, session.expiresAt);

		// redirect the user
		const redirectUrl = event.cookies.get('redirect');
		if (redirectUrl) {
			event.cookies.delete('redirect', { path: '/' });
			return new Response(null, {
				status: 302,
				headers: { Location: redirectUrl }
			});
		} else {
			return new Response(null, {
				status: 302,
				headers: { Location: '/' }
			});
		}
	} catch (e) {
		console.log(e);
		if (e instanceof OAuth2RequestError) {
			return new Response(null, {
				status: 400
			});
		}
		return new Response(null, {
			status: 500
		});
	}
};

type SlackUser = {
	sub: string;
	email: string;
	email_verified: boolean;
	name: string;
	picture: string;
};

async function getSlackUser(tokens: OAuth2Tokens): Promise<SlackUser> {
	return fetch('https://slack.com/api/openid.connect.userInfo', {
		headers: {
			Authorization: `Bearer ${tokens.accessToken()}`
		}
	}).then((response) => response.json());
}

function validateMembership(email: string, email_verified: boolean) {
	if (!email) {
		throw new Error('Your Slack account does not have an associated email address');
	}

	const result = isMember(email, email_verified);
	if (result.success) {
		const { member } = result;
		return { admin: isAdmin(member), crNumber: member.crNumber };
	} else {
		const { reason } = result;
		throw new Error(reason);
	}
}

async function upsertUser(slackUser: SlackUser, admin: boolean, claims: Claims, token: string) {
	return db
		.insert(user)
		.values({
			id: generateUserId(),
			slackId: slackUser.sub,
			email: slackUser.email,
			role: admin ? 'admin' : 'user',
			claims: claims,
			name: slackUser.name,
			image: slackUser.picture,
			token: token
		})
		.onConflictDoUpdate({
			target: user.slackId,
			set: {
				email: slackUser.email,
				role: admin ? 'admin' : 'user',
				claims: claims,
				name: slackUser.name,
				image: slackUser.picture,
				token: token
			}
		})
		.returning()
		.get();
}
