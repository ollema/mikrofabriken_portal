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
	import { DataTable, DataTablePagination } from '$lib/components/data-table/index.js';
	import { columns } from './columns.js';
	import DataTableToolbar from './data-table-toolbar.svelte';
	import type { Product } from '$lib/types/cog.js';
	import { ProductSchema } from '$lib/schemas/cog.js';
	import PurchaseDialog from '$lib/components/kiosk/PurchaseDialog.svelte';

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
				VAT: false,
				EAN: false
			})
		},
		{
			debounceHistory: 500,
			showDefaults: false
		}
	);

	let { data } = $props();

	let product: Product | null | undefined = $state(undefined);
	let open: boolean = $state(false);

	function onRowClick(row: Row<Product>) {
		try {
			product = ProductSchema.parse(row.original);
			open = true;
		} catch (error) {
			console.error(error);
		}
	}
</script>

<div class="mx-auto w-full min-w-0">
	<PageHeader.Root>
		<PageHeader.Heading>
			<PageHeader.Title>Browse products</PageHeader.Title>
			<PageHeader.Description>Browse and purchase products.</PageHeader.Description>
		</PageHeader.Heading>
	</PageHeader.Root>

	<DataTable data={data.products} {columns} {params} {onRowClick}>
		{#snippet toolbar(table)}
			<DataTableToolbar {table} />
		{/snippet}
		{#snippet paginationControls(table)}
			<DataTablePagination {table} showPerPage />
		{/snippet}
	</DataTable>
</div>

<PurchaseDialog bind:open bind:product />
