<script lang="ts">
	import { page } from '$app/state';
	import { DataTable, DataTablePagination } from '$lib/components/data-table/index.js';
	import { columns } from './columns.js';
	import * as PageHeader from '$lib/components/page-header/index.js';
	import ProjectStorageDialog from '$lib/components/project-storage/project-storage-dialog.svelte';
	import ProjectStorageSpot from '$lib/components/project-storage/project-storage-spot.svelte';

	let { data } = $props();

	let selectedStorage:
		| {
				name: string;
				period: {
					uuid: string;
					member: {
						name: string;
						slackID: string;
					};
					start: Date;
					end: Date | null;
				} | null;
		  }
		| undefined = $state(undefined);

	let params = $state({
		columnFilters: [],
		sorting: [{ id: 'Start', desc: true }],
		pagination: {
			pageIndex: 1,
			pageSize: 10
		},
		visibility: {}
	});

	let dialogOpen = $state(false);
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
			<PageHeader.Title>Tillfälliga projektytor</PageHeader.Title>
			<PageHeader.Description>När schackrutor inte räcker till.</PageHeader.Description>
		</PageHeader.Heading>
	</PageHeader.Root>

	<div class="text-muted-foreground mb-4">Klicka på en ruta för att boka/avboka.</div>

	<div class="flex max-w-(--breakpoint-md) flex-col items-start gap-2">
		<div class="grid auto-cols-[60px] grid-flow-col justify-start gap-2 sm:auto-cols-[70px]">
			{#each data.storageRows[0] as storage (storage)}
				<ProjectStorageSpot {storage} avatars={data.avatars} onClick={handleStorageClick} />
			{/each}
		</div>
	</div>
</div>

<div class="mt-8 max-w-(--breakpoint-md)">
	<h2 class="mb-2 w-full text-lg">Dina bokningar</h2>
	<DataTable data={data.storagePeriods} {columns} {params}>
		{#snippet paginationControls(table)}
			<DataTablePagination {table} rowName="bokningar" showPerPage={true} />
		{/snippet}
	</DataTable>
</div>

<ProjectStorageDialog
	bind:open={dialogOpen}
	storage={selectedStorage}
	currentUserSlackID={page.data.user?.slackID}
	{onClose}
/>
