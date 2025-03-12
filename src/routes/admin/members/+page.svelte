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
			columnFilters: ssp.object<ColumnFiltersState>([
				{ id: 'Medlemskap', value: ['active', 'passive'] }
			]),
			sorting: ssp.object<SortingState>([{ id: 'Medlem sedan', desc: false }]),
			pagination: ssp.object<PaginationState>({
				pageIndex: 1,
				pageSize: 10
			}),
			visibility: ssp.object<VisibilityState>({
				Email: false,
				'Slack ID': false,
				Telefonnummer: false,
				'Medlem sedan': false
			})
		},
		{
			showDefaults: false
		}
	);

	let { data } = $props();
</script>

<div class="mx-auto w-full min-w-0">
	<PageHeader.Root>
		<PageHeader.Heading>
			<PageHeader.Title>Medlemslista</PageHeader.Title>
		</PageHeader.Heading>
	</PageHeader.Root>

	<DataTable data={data.members} {columns} {params}>
		{#snippet toolbar(table)}
			<DataTableToolbar {table} />
		{/snippet}
		{#snippet paginationControls(table)}
			<DataTablePagination {table} rowName="medlemmar" showPerPage />
		{/snippet}
	</DataTable>
</div>
