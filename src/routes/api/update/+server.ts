import { updateRepo } from '$lib/server/gitlab';

import { env } from '$env/dynamic/private';

export const prerender = false;

export async function GET() {
	const latestCommit = await updateRepo(env.UFPERSONSLIST_REPO_PATH);
	return new Response(`Updated memberlist repo to commit: ${latestCommit}`);
}
