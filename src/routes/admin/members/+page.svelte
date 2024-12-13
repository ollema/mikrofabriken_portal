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
				{ id: 'Membership', value: ['active', 'passive'] }
			]),
			sorting: ssp.object<SortingState>([{ id: 'Member since', desc: false }]),
			pagination: ssp.object<PaginationState>({
				pageIndex: 1,
				pageSize: 10
			}),
			visibility: ssp.object<VisibilityState>({
				Email: false,
				'Slack ID': false,
				Phone: false,
				'Member since': false
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
			<PageHeader.Title>Members</PageHeader.Title>
			<PageHeader.Description>Manage members of Mikrofabriken.</PageHeader.Description>
		</PageHeader.Heading>
	</PageHeader.Root>

	<DataTable data={data.members} {columns} {params}>
		{#snippet toolbar(table)}
			<DataTableToolbar {table} />
		{/snippet}
		{#snippet paginationControls(table)}
			<DataTablePagination {table} rowName={'member'} showPerPage />
		{/snippet}
	</DataTable>
</div>
