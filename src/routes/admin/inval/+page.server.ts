import { env } from '$env/dynamic/private';

export async function load() {
	return {
		newMemberKey: env.UF_NEW_MEMBER_KEY
	};
}
