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
		sorting: [{ id: 'Start Date', desc: true }],
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
			<PageHeader.Title>Short term project storage</PageHeader.Title>
			<PageHeader.Description>Also known as schackrutor.</PageHeader.Description>
		</PageHeader.Heading>
	</PageHeader.Root>

	<div class="flex max-w-screen-md flex-col items-start gap-2 lg:flex-row lg:justify-between">
		<div>
			<div class="grid auto-cols-[80px] grid-flow-col justify-start gap-2">
				{#each data.storageRows[0] as storage}
					<ProjectStorageSpot {storage} avatars={data.avatars} onClick={handleStorageClick} />
				{/each}
			</div>
		</div>
		<div class="flex flex-col items-center gap-2">
			<div class="grid auto-cols-[80px] grid-flow-col justify-start gap-2">
				{#each data.storageRows[1] as storage}
					<ProjectStorageSpot {storage} avatars={data.avatars} onClick={handleStorageClick} />
				{/each}
			</div>
			<div class="grid auto-cols-[80px] grid-flow-col justify-start gap-2">
				{#each data.storageRows[2] as storage}
					<ProjectStorageSpot {storage} avatars={data.avatars} onClick={handleStorageClick} />
				{/each}
			</div>
		</div>
	</div>
</div>

<div class="mt-8">
	<h2 class="mb-4 w-full text-lg">History</h2>
	<DataTable data={data.storagePeriods} {columns} {params}>
		{#snippet paginationControls(table)}
			<DataTablePagination {table} rowName={'period'} showPerPage={true} />
		{/snippet}
	</DataTable>
</div>

<ProjectStorageDialog
	bind:open={dialogOpen}
	storage={selectedStorage}
	currentUserSlackID={page.data.user?.slackID}
	{onClose}
/>
