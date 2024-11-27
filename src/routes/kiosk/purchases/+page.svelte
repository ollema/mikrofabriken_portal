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
	import { DataTable } from '$lib/components/data-table/index.js';
	import { columns } from './columns.js';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';
	import DataTableToolbar from './data-table-toolbar.svelte';

	const params = queryParameters(
		{
			columnFilters: ssp.object<ColumnFiltersState>([]),
			sorting: ssp.object<SortingState>([{ id: 'Date', desc: true }]),
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
			<PageHeader.Title>Purchases</PageHeader.Title>
			<PageHeader.Description>Registered purchases last/current month.</PageHeader.Description>
		</PageHeader.Heading>
	</PageHeader.Root>

	{#await data.purchases}
		<div class="flex items-center gap-4">
			<LoaderCircle class="animate-spin" />
			<div>Loading...</div>
		</div>
	{:then [purchasesLastMonth, purchasesCurrentMonth]}
		<Tabs.Root value="current">
			<Tabs.List class="mb-2 h-8">
				<Tabs.Trigger class="px-4 py-0.5" value="last">Last month</Tabs.Trigger>
				<Tabs.Trigger class="px-4 py-0.5" value="current">Current month</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value="last">
				<DataTable data={purchasesLastMonth} {columns} {params}>
					{#snippet toolbar(table)}
						<DataTableToolbar {table} />
					{/snippet}
				</DataTable>
			</Tabs.Content>
			<Tabs.Content value="current">
				<DataTable data={purchasesCurrentMonth} {columns} {params}>
					{#snippet toolbar(table)}
						<DataTableToolbar {table} />
					{/snippet}
				</DataTable>
			</Tabs.Content>
		</Tabs.Root>
	{/await}
</div>
