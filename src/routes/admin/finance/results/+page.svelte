<script lang="ts">
	import { goto } from '$app/navigation';
	import * as PageHeader from '$lib/components/page-header/index.js';
	import { ssp, queryParameters } from 'sveltekit-search-params';
	import type {
		ColumnFiltersState,
		SortingState,
		PaginationState,
		VisibilityState,
		Table
	} from '@tanstack/table-core';
	import { DataTable, DataTablePagination } from '$lib/components/data-table/index.js';
	import { columns, getCostCenterUrl, type BudgetRow } from './columns.js';

	const params = queryParameters(
		{
			columnFilters: ssp.object<ColumnFiltersState>([]),
			sorting: ssp.object<SortingState>([{ id: 'costCenter', desc: false }]),
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
			<PageHeader.Title>Resultat</PageHeader.Title>
			<PageHeader.Description
				>Mikrofabriken AB: Resultat för innevarande år per kostnadsställe</PageHeader.Description
			>
		</PageHeader.Heading>
	</PageHeader.Root>

	<DataTable
		data={data.budgetData}
		{columns}
		{params}
		onRowClick={(row) => goto(getCostCenterUrl(row.original.costCenter))}
	>
		{#snippet paginationControls(table: Table<BudgetRow>)}
			<DataTablePagination {table} rowName="kostnadsställen" showPerPage />
		{/snippet}
	</DataTable>
</div>
