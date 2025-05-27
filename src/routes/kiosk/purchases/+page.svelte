<script lang="ts">
	import * as PageHeader from '$lib/components/page-header/index.js';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import { ssp, queryParameters } from 'sveltekit-search-params';
	import type {
		ColumnFiltersState,
		SortingState,
		PaginationState,
		VisibilityState
	} from '@tanstack/table-core';
	import { DataTable, DataTablePagination } from '$lib/components/data-table/index.js';
	import { columns } from './columns.js';
	import DataTableToolbar from './data-table-toolbar.svelte';

	const params = queryParameters(
		{
			columnFilters: ssp.object<ColumnFiltersState>([]),
			sorting: ssp.object<SortingState>([{ id: 'Datum', desc: true }]),
			pagination: ssp.object<PaginationState>({
				pageIndex: 1,
				pageSize: 10
			}),
			visibility: ssp.object<VisibilityState>({
				Price: false,
				Quantity: false
			})
		},
		{
			debounceHistory: 500,
			showDefaults: false
		}
	);

	let { data } = $props();
</script>

<div class="mx-auto w-full min-w-0">
	<PageHeader.Root>
		<PageHeader.Heading>
			<PageHeader.Title>Dina köp</PageHeader.Title>
			<PageHeader.Description>Registrerade köp nuvarande/föregående månad.</PageHeader.Description>
		</PageHeader.Heading>
	</PageHeader.Root>

	<Tabs.Root value="current">
		<Tabs.List class="mb-2 h-8">
			<Tabs.Trigger class="px-4 py-0.5" value="last">Föregående</Tabs.Trigger>
			<Tabs.Trigger class="px-4 py-0.5" value="current">Nuvarande</Tabs.Trigger>
		</Tabs.List>
		<Tabs.Content value="last">
			<DataTable data={data.purchases[0]} {columns} {params}>
				{#snippet toolbar(table)}
					<DataTableToolbar {table} />
				{/snippet}
				{#snippet paginationControls(table)}
					<DataTablePagination {table} rowName="köp" showPerPage={false} />
				{/snippet}
			</DataTable>
		</Tabs.Content>
		<Tabs.Content value="current">
			<DataTable data={data.purchases[1]} {columns} {params}>
				{#snippet toolbar(table)}
					<DataTableToolbar {table} />
				{/snippet}
				{#snippet paginationControls(table)}
					<DataTablePagination {table} rowName="köp" showPerPage={false} />
				{/snippet}
			</DataTable>
		</Tabs.Content>
	</Tabs.Root>
</div>
