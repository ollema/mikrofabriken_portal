<script lang="ts">
	import * as PageHeader from '$lib/components/page-header/index.js';
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
			sorting: ssp.object<SortingState>([{ id: 'Category', desc: false }]),
			pagination: ssp.object<PaginationState>({
				pageIndex: 1,
				pageSize: 10
			}),
			visibility: ssp.object<VisibilityState>({
				UUID: false,
				VAT: false
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
			<PageHeader.Title>Products</PageHeader.Title>
			<PageHeader.Description>Manage products.</PageHeader.Description>
		</PageHeader.Heading>
	</PageHeader.Root>

	<DataTable data={data.products} {columns} {params}>
		{#snippet toolbar(table)}
			<DataTableToolbar {table} />
		{/snippet}
		{#snippet paginationControls(table)}
			<DataTablePagination {table} rowName={'product'} showPerPage />
		{/snippet}
	</DataTable>
</div>
