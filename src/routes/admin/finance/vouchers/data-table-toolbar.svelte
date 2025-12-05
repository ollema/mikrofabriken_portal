<script lang="ts">
	import X from '@lucide/svelte/icons/x';
	import type { Table } from '@tanstack/table-core';
	import {
		DataTableFacetedFilter,
		DataTableViewOptions
	} from '$lib/components/data-table/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import type { VoucherListItem } from '$lib/types/fortnox.js';

	let { table }: { table: Table<VoucherListItem> } = $props();

	const isFiltered = $derived(table.getState().columnFilters.length > 0);
	const seriesCol = $derived(table.getColumn('VoucherSeries'));
	const seriesColOptions = $derived(
		Array.from(seriesCol?.getFacetedUniqueValues().keys() ?? [])
			.sort()
			.map((value) => ({
				label: value,
				value
			}))
	);
</script>

<div class="flex items-end justify-between">
	<div class="flex flex-1 flex-wrap items-center gap-2">
		{#if seriesCol}
			<DataTableFacetedFilter
				column={seriesCol}
				title="Serie"
				enableSearch={false}
				options={seriesColOptions}
			/>
		{/if}

		{#if isFiltered}
			<Button variant="ghost" onclick={() => table.resetColumnFilters()} class="h-8 px-2 text-xs">
				Återställ
				<X />
			</Button>
		{/if}
	</div>
	<DataTableViewOptions {table} />
</div>

