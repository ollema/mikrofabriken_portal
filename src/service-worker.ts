/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

// https://kit.svelte.dev/docs/service-workers#type-safety
const sw = self as unknown as ServiceWorkerGlobalScope;

import { build, files, version } from '$service-worker';

// create a unique cache name for this deployment
const CACHE = `portal-cache-${version}`;

const ASSETS = [
	...build, // the app itself
	...files // everything in `static`
];

sw.addEventListener('install', (event) => {
	// create a new cache and add all files to it
	async function addFilesToCacheAndSkipWaiting() {
		const cache = await caches.open(CACHE);
		await cache.addAll(ASSETS);
		await sw.skipWaiting();
	}

	event.waitUntil(addFilesToCacheAndSkipWaiting());
});

sw.addEventListener('activate', (event) => {
	// remove previously cached data from disk
	async function deleteOldCaches() {
		for (const key of await caches.keys()) {
			if (key !== CACHE) await caches.delete(key);
		}
	}

	event.waitUntil(deleteOldCaches());
});

sw.addEventListener('fetch', (event) => {
	// ignore requests that should not be cached
	const url = new URL(event.request.url);
	if (event.request.method !== 'GET') return;
	if (url.pathname.startsWith('/admin')) return;

	async function respond() {
		const url = new URL(event.request.url);
		const cache = await caches.open(CACHE);

		// check whether the request is already in the cache
		const cachedResponse = await cache.match(event.request);

		// `build`/`files` can always be served from the cache
		if (ASSETS.includes(url.pathname) && cachedResponse) {
			return cachedResponse;
		}

		// for everything else - always pull from the network to ensure fresh data
		const response = await fetch(event.request);
		if (!(response instanceof Response)) {
			throw new Error('invalid response from fetch');
		}

		return response;
	}

	event.respondWith(respond());
});
