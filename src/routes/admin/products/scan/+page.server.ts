import { getUser } from '$lib/server/auth';

export function load({ locals }) {
	getUser(locals);
}
