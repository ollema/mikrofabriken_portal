<script lang="ts" module>
	type TData = unknown;
</script>

<script lang="ts" generics="TData">
	import X from 'lucide-svelte/icons/x';
	import type { Table } from '@tanstack/table-core';
	import {
		DataTableFacetedFilter,
		DataTableViewOptions
	} from '$lib/components/data-table/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';

	let { table }: { table: Table<TData> } = $props();

	let isFiltered = $derived(table.getState().columnFilters.length > 0);
	let categoryCol = $derived(table.getColumn('Category'));
	let categoryColOptions = $derived(
		Array.from(categoryCol?.getFacetedUniqueValues().keys() ?? [])
			.sort()
			.map((value) => ({
				label: value,
				value
			}))
	);
	let vatCol = $derived(table.getColumn('VAT'));
	let vatColOptions = $derived(
		Array.from(vatCol?.getFacetedUniqueValues().keys() ?? [])
			.sort()
			.map((value) => ({
				label: value,
				value
			}))
	);
</script>

<Input
	placeholder="Filter products..."
	value={(table.getColumn('Name')?.getFilterValue() as string) ?? ''}
	oninput={(e) => {
		table.getColumn('Name')?.setFilterValue(e.currentTarget.value);
	}}
	onchange={(e) => {
		table.getColumn('Name')?.setFilterValue(e.currentTarget.value);
	}}
	class="h-8 w-[150px] lg:w-[250px]"
	autocomplete="off"
/>

<div class="flex items-end justify-between">
	<div class="flex flex-1 flex-wrap items-center gap-2">
		{#if categoryCol}
			<DataTableFacetedFilter
				column={categoryCol}
				title="Category"
				enableSearch={false}
				options={categoryColOptions}
			/>
		{/if}

		{#if vatCol}
			<DataTableFacetedFilter
				column={vatCol}
				title="VAT"
				enableSearch={false}
				options={vatColOptions}
			/>
		{/if}

		{#if isFiltered}
			<Button variant="ghost" onclick={() => table.resetColumnFilters()} class="h-8 px-2 text-xs">
				Reset
				<X />
			</Button>
		{/if}
	</div>
	<DataTableViewOptions {table} />
</div>
