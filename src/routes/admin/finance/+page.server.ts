import type { Actions } from './$types.js';
import { getStatus, startUpdate } from '$lib/server/fortnox/fortnox-updater.js';

export function load() {
	return {
		updateStatus: getStatus()
	};
}

export const actions = {
	update: () => {
		return startUpdate();
	}
} satisfies Actions;
