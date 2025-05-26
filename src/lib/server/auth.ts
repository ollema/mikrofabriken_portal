import { error, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { sha256 } from '@oslojs/crypto/sha2';
import { encodeBase32LowerCase, encodeBase64url, encodeHexLowerCase } from '@oslojs/encoding';
import type { RequestEvent } from '@sveltejs/kit';
import type { Member } from '$lib/types/members.js';
import { db } from '$lib/server/db/index.js';
import * as table from '$lib/server/db/schema.js';

import { getMembers } from '$lib/server/members.js';

import { env } from '$env/dynamic/private';

const DAY_IN_MS = 1000 * 60 * 60 * 24;

export const sessionCookieName = 'auth-session';

export function generateSessionToken() {
	const bytes = crypto.getRandomValues(new Uint8Array(18));
	const token = encodeBase64url(bytes);
	return token;
}

export async function createSession(token: string, userId: string) {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const session: table.Session = {
		id: sessionId,
		userId,
		expiresAt: new Date(Date.now() + DAY_IN_MS * 30)
	};
	await db.insert(table.session).values(session);
	return session;
}

export async function validateSessionToken(token: string) {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const [result] = await db
		.select({
			user: {
				id: table.user.id,
				slackID: table.user.slackID,
				role: table.user.role,
				claims: table.user.claims,
				name: table.user.name,
				image: table.user.image,
				token: table.user.token
			},
			session: table.session
		})
		.from(table.session)
		.innerJoin(table.user, eq(table.session.userId, table.user.id))
		.where(eq(table.session.id, sessionId));

	if (result == null) {
		return { session: null, user: null };
	}
	const { session, user } = result;

	const sessionExpired = Date.now() >= session.expiresAt.getTime();
	if (sessionExpired) {
		await db.delete(table.session).where(eq(table.session.id, session.id));
		return { session: null, user: null };
	}

	const renewSession = Date.now() >= session.expiresAt.getTime() - DAY_IN_MS * 15;
	if (renewSession) {
		session.expiresAt = new Date(Date.now() + DAY_IN_MS * 30);
		await db
			.update(table.session)
			.set({ expiresAt: session.expiresAt })
			.where(eq(table.session.id, session.id));
	}

	return { session, user };
}

export type SessionValidationResult = Awaited<ReturnType<typeof validateSessionToken>>;

export async function invalidateSession(sessionId: string) {
	await db.delete(table.session).where(eq(table.session.id, sessionId));
}

export function setSessionTokenCookie(event: RequestEvent, token: string, expiresAt: Date) {
	event.cookies.set(sessionCookieName, token, {
		expires: expiresAt,
		path: '/'
	});
}

export function deleteSessionTokenCookie(event: RequestEvent) {
	event.cookies.delete(sessionCookieName, {
		path: '/'
	});
}

export function generateUserId() {
	const bytes = crypto.getRandomValues(new Uint8Array(15));
	const id = encodeBase32LowerCase(bytes);
	return id;
}

export function getUser(locals: App.Locals, url?: URL) {
	const redirectUrl = url ? `?redirect=${encodeURIComponent(url.pathname)}` : '';
	if (locals.user === null) {
		redirect(302, '/auth/sign_in' + redirectUrl);
	}

	return locals.user;
}

export function getToken(locals: App.Locals) {
	if (locals.user?.token === undefined) {
		error(401, 'Unauthorized: no token set');
	}
	return locals.user.token;
}

/**
 * Represents the result of a membership check.
 * If the check was successful, `success` will be `true` and `member` will contain the member information.
 * If the check was unsuccessful, `success` will be `false` and `reason` will contain the reason for the failure.
 */
type MembershipCheckResult = { success: true; member: Member } | { success: false; reason: string };

/**
 * Checks if a user is a member based on their slack ID.
 * @param slackID
 * @returns A `MembershipCheckResult` object indicating whether the user is a member and the reason if not.
 */
export function isMember(slackID: string): MembershipCheckResult {
	// users need to exist in the members.json file
	const members = getMembers();
	const member = members.find((member) => member.slackID === slackID);
	if (!member) {
		return {
			success: false,
			reason: `Your slack ID (${slackID}) is not found in members.json`
		};
	}

	// users need to have an active membership agreement
	const activeMembership = member.agreements.some((agreement) => {
		return (
			agreement.type === 'membership' &&
			(!agreement.endDate || new Date(agreement.endDate) > new Date())
		);
	});
	if (!activeMembership) {
		return { success: false, reason: `You do not have an active membership agreement` };
	}

	return { success: true, member };
}

/**
 * Checks if a given member is an admin.
 * @param member - The member to check.
 * @returns True if the member is an admin, false otherwise.
 */
export function isAdmin(member: Member) {
	// board members are admins
	let admin = false;
	for (const commission of member.commissions) {
		if (commission.type.startsWith('board/')) {
			// ensure that commission.endDate is not set or at least in the future so that the board member is still active
			if (!commission.endDate || new Date(commission.endDate) > new Date()) {
				admin = true;
			}
		}
	}

	// selected list of users are also admins
	if (env.ADMINS?.split(',').includes(member.slackID)) {
		admin = true;
	}

	return admin;
}
