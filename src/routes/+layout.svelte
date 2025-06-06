<script lang="ts">
	import { getFlash } from 'sveltekit-flash-message';
	import { toast } from 'svelte-sonner';
	import { Toaster } from '$lib/components/ui/sonner/index.js';
	import Metadata from '$lib/components/metadata.svelte';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import AppSidebar from '$lib/components/app-sidebar.svelte';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
	import { page } from '$app/state';

	import '../app.css';

	const flash = getFlash(page);

	$effect(() => {
		if (!$flash) return;

		switch ($flash.type) {
			case 'info':
				toast.info($flash.message);
				break;
			case 'success':
				toast.success($flash.message);
				break;
			case 'warning':
				toast.warning($flash.message);
				break;
			case 'error':
				toast.error($flash.message);
				break;
		}

		// clear flash message to avoid double-toasting
		flash.set(undefined);
	});

	let { children } = $props();

	function capitalize(str: string) {
		return str.charAt(0).toUpperCase() + str.slice(1);
	}

	let breadcrumbs = $derived(page.url.pathname.split('/').filter((x) => x !== ''));
	let breadcrumbsLinks = $derived(
		breadcrumbs.map((breadcrumb, index) => {
			const href = '/' + breadcrumbs.slice(0, index + 1).join('/');
			let label: string;
			if (breadcrumb.includes('_')) {
				label = breadcrumb.split('_').map(capitalize).join(' ');
			} else if (breadcrumb.includes('-')) {
				label = capitalize(breadcrumb.split('-').join(' '));
			} else {
				label = capitalize(breadcrumb);
			}
			return { href, label };
		})
	);
</script>

<Toaster expand={true} duration={5000} richColors position="top-center" />

<Metadata />

<Tooltip.Provider>
	<Sidebar.Provider>
		<AppSidebar />
		<Sidebar.Inset>
			<header class="flex h-16 shrink-0 items-center gap-2 border-b px-4">
				<Sidebar.Trigger class="-ml-1" />
				<Breadcrumb.Root class="hidden md:block">
					<Breadcrumb.List>
						{#each breadcrumbsLinks as breadcrumb, index (breadcrumb)}
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
					</Breadcrumb.List>
				</Breadcrumb.Root>
				<div class="flex gap-2 md:hidden">
					<a href="/" class="ml-0.5 flex flex-col gap-0.5 text-sm leading-none">
						<span class="font-semibold">Mikrofabriken</span>
						<span>Medlemsportal</span>
					</a>
				</div>
			</header>
			<div class="w-full max-w-(--breakpoint-xl) p-4 pb-12">
				{@render children?.()}
			</div>
		</Sidebar.Inset>
	</Sidebar.Provider>
</Tooltip.Provider>
