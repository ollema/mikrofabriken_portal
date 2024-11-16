<script lang="ts">
	import { ModeWatcher } from 'mode-watcher';
	import { Toaster } from '$lib/components/ui/sonner/index.js';
	import Metadata from '$lib/components/metadata.svelte';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
	import AppSidebar from '$lib/components/app-sidebar.svelte';

	import '../app.css';

	let { children } = $props();
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
						<Breadcrumb.Item class="hidden md:block">
							<Breadcrumb.Link href="#">Building Your Application</Breadcrumb.Link>
						</Breadcrumb.Item>
						<Breadcrumb.Separator class="hidden md:block" />
						<Breadcrumb.Item>
							<Breadcrumb.Page>Data Fetching</Breadcrumb.Page>
						</Breadcrumb.Item>
					</Breadcrumb.List>
				</Breadcrumb.Root>
			</header>
			<div class="p-4">
				{@render children()}
			</div>
		</Sidebar.Inset>
	</Sidebar.Provider>
</Tooltip.Provider>
