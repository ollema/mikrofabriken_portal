import { getUser } from '$lib/server/auth';

export async function load({ locals }) {
	getUser(locals);
}
