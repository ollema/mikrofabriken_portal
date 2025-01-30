<script lang="ts">
	import { page } from '$app/state';
	import * as PageHeader from '$lib/components/page-header/index.js';
	import StorageDialog from '$lib/components/storage/storage-dialog.svelte';
	import StorageSpot from '$lib/components/storage/storage-spot.svelte';

	let { data } = $props();

	let dialogOpen = $state(false);
	let selectedStorage:
		| {
				name: string;
				period: {
					uuid: string;
					member: {
						name: string;
						slackID: string;
					};
				} | null;
		  }
		| undefined = $state(undefined);

	function handleStorageClick(storage: typeof selectedStorage) {
		selectedStorage = storage;
		dialogOpen = true;
	}

	function onClose() {
		selectedStorage = undefined;
	}
</script>

<div class="mx-auto w-full min-w-0">
	<PageHeader.Root>
		<PageHeader.Heading>
			<PageHeader.Title>Short term project storage</PageHeader.Title>
			<PageHeader.Description>Also known as schackrutor.</PageHeader.Description>
		</PageHeader.Heading>
	</PageHeader.Root>

	<div class="flex flex-col gap-4">
		{#each data.storageRows as row}
			<div class="grid auto-cols-[80px] grid-flow-col justify-start gap-2">
				{#each row as storage}
					<StorageSpot {storage} avatars={data.avatars} onClick={handleStorageClick} />
				{/each}
			</div>
		{/each}
	</div>
</div>

<StorageDialog
	bind:open={dialogOpen}
	storage={selectedStorage}
	currentUserSlackID={page.data.user?.slackID}
	{onClose}
/>
