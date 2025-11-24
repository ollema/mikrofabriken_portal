<script lang="ts">
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
	import { createColumns, type AccountBreakdownRow } from './columns.js';

	const params = queryParameters(
		{
			columnFilters: ssp.object<ColumnFiltersState>([]),
			sorting: ssp.object<SortingState>([{ id: 'account', desc: false }]),
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
	const accountBreakdown = data.accountBreakdown as AccountBreakdownRow[];
	const costCenter = data.costCenter as string;
	const columns = createColumns(costCenter);
</script>

<div class="mx-auto w-full min-w-0">
	<PageHeader.Root>
		<PageHeader.Heading>
			<PageHeader.Title>Resultat - {costCenter || 'NONE'}</PageHeader.Title>
			<PageHeader.Description>Mikrofabriken AB: Resultat per konto för kostnadsställe</PageHeader.Description
			>
		</PageHeader.Heading>
	</PageHeader.Root>

	<DataTable data={accountBreakdown} {columns} {params}>
		{#snippet paginationControls(table: Table<AccountBreakdownRow>)}
			<DataTablePagination {table} rowName="konton" showPerPage />
		{/snippet}
	</DataTable>
</div>
