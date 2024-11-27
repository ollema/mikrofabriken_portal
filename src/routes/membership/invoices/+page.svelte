<script lang="ts">
	import * as PageHeader from '$lib/components/page-header/index.js';
	import { ssp, queryParameters } from 'sveltekit-search-params';
	import type {
		ColumnFiltersState,
		SortingState,
		PaginationState,
		VisibilityState,
		Row
	} from '@tanstack/table-core';
	import { DataTable } from '$lib/components/data-table/index.js';
	import { columns } from './columns.js';
	// import DataTableToolbar from './data-table-toolbar.svelte';
	import { goto } from '$app/navigation';
	import type { Invoice } from '$lib/types/fortnox.js';

	const params = queryParameters(
		{
			columnFilters: ssp.object<ColumnFiltersState>([]),
			sorting: ssp.object<SortingState>([{ id: 'Due', desc: true }]),
			pagination: ssp.object<PaginationState>({
				pageIndex: 1,
				pageSize: 3
			}),
			visibility: ssp.object<VisibilityState>({
				Invoice: false
			})
		},
		{
			debounceHistory: 500,
			showDefaults: false
		}
	);

	let { data } = $props();

	function onRowClick(row: Row<Invoice>) {
		goto(`/membership/invoices/${row.original.DocumentNumber}`);
	}
</script>

<div class="mx-auto w-full min-w-0">
	<PageHeader.Root>
		<PageHeader.Heading>
			<PageHeader.Title>Invoices</PageHeader.Title>
			<PageHeader.Description>View your invoices.</PageHeader.Description>
		</PageHeader.Heading>
	</PageHeader.Root>

	{#if data.invoices.personal !== null}
		<DataTable data={data.invoices.personal} {columns} {params} {onRowClick}>
			<!-- {#snippet toolbar(table)}
			<DataTableToolbar {table} />
		{/snippet} -->
		</DataTable>
	{/if}
</div>
