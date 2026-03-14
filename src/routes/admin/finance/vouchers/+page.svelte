<script lang="ts">
	import { goto } from '$app/navigation';
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
	import { getVoucherUrl } from './columns.js';

	const params = queryParameters(
		{
			columnFilters: ssp.object<ColumnFiltersState>([]),
			sorting: ssp.object<SortingState>([
				{ id: 'VoucherSeries', desc: false },
				{ id: 'VoucherNumber', desc: false }
			]),
			pagination: ssp.object<PaginationState>({
				pageIndex: 1,
				pageSize: 25
			}),
			visibility: ssp.object<VisibilityState>({})
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
			<PageHeader.Title>Verifikationer</PageHeader.Title>
			<PageHeader.Description>Verifikationer för innevarande år</PageHeader.Description>
		</PageHeader.Heading>
	</PageHeader.Root>

	<DataTable
		data={data.vouchers}
		{columns}
		{params}
		onRowClick={(row) =>
			goto(
				getVoucherUrl(row.original.Year, row.original.VoucherSeries, row.original.VoucherNumber)
			)}
	>
		{#snippet toolbar(table)}
			<DataTableToolbar {table} />
		{/snippet}
		{#snippet paginationControls(table)}
			<DataTablePagination {table} rowName="verifikationer" showPerPage />
		{/snippet}
	</DataTable>
</div>
