<script lang="ts">
	import { ModeWatcher } from 'mode-watcher';
	import { Toaster } from '$lib/components/ui/sonner/index.js';
	import Metadata from '$lib/components/metadata.svelte';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
	import AppSidebar from '$lib/components/app-sidebar.svelte';
	import { page } from '$app/stores';

	import '../app.css';
	import { index } from 'drizzle-orm/mysql-core';

	let { children } = $props();

	function capitalize(str: string) {
		return str.charAt(0).toUpperCase() + str.slice(1);
	}

	let breadcrumbs = $derived($page.url.pathname.split('/').filter((x) => x !== ''));
	let breadcrumbsLinks = $derived(
		breadcrumbs.map((breadcrumb, index) => {
			const href = '/' + breadcrumbs.slice(0, index + 1).join('/');
			let label: string;
			if (breadcrumb.includes('@')) {
				label = breadcrumb.toLowerCase();
			} else if (breadcrumb.includes('_')) {
				label = breadcrumb.split('_').map(capitalize).join(' ');
			} else {
				label = capitalize(breadcrumb);
			}
			return { href, label };
		})
	);
</script>

<ModeWatcher defaultMode={'dark'} />

<Toaster expand={true} duration={5000} richColors position={'top-center'} />

<Metadata />

<Tooltip.Provider>
	<Sidebar.Provider>
		<AppSidebar />
		<Sidebar.Inset>
			<header class="flex h-16 shrink-0 items-center gap-2 border-b px-4">
				<Sidebar.Trigger class="-ml-1" />
				<Breadcrumb.Root>
					<Breadcrumb.List>
						{#each breadcrumbsLinks as breadcrumb, index}
							{#if index === 0}
								<Breadcrumb.Item>
									{breadcrumb.label}
								</Breadcrumb.Item>
								<Breadcrumb.Separator />
							{:else if index === breadcrumbsLinks.length - 1}
								<Breadcrumb.Item>
									<Breadcrumb.Page>{breadcrumb.label}</Breadcrumb.Page>
								</Breadcrumb.Item>
							{:else}
								<Breadcrumb.Item>
									<Breadcrumb.Link href={breadcrumb.href}>{breadcrumb.label}</Breadcrumb.Link>
								</Breadcrumb.Item>
								<Breadcrumb.Separator />
							{/if}
						{/each}
						<!-- <Breadcrumb.Item class="hidden md:block">
							<Breadcrumb.Link href="#">Building Your Application</Breadcrumb.Link>
						</Breadcrumb.Item>
						<Breadcrumb.Separator class="hidden md:block" />
						<Breadcrumb.Item>
							<Breadcrumb.Page>Data Fetching</Breadcrumb.Page>
						</Breadcrumb.Item> -->
					</Breadcrumb.List>
				</Breadcrumb.Root>
			</header>
			<div class="w-full max-w-screen-xl p-2 md:p-4">
				{@render children?.()}
			</div>
		</Sidebar.Inset>
	</Sidebar.Provider>
</Tooltip.Provider>
