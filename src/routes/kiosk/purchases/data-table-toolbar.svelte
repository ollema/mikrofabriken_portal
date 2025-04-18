<script lang="ts">
	import type { Table } from '@tanstack/table-core';
	import { DataTableViewOptions } from '$lib/components/data-table/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import type { HistoricPurchase } from '$lib/types/cog.js';

	let { table }: { table: Table<HistoricPurchase> } = $props();
</script>

<div class="flex items-center justify-between">
	<Input
		placeholder="Filtrera köp..."
		value={(table.getColumn('Namn')?.getFilterValue() as string) ?? ''}
		oninput={(e) => {
			table.getColumn('Namn')?.setFilterValue(e.currentTarget.value);
		}}
		onchange={(e) => {
			table.getColumn('Namn')?.setFilterValue(e.currentTarget.value);
		}}
		class="h-8 w-[150px] lg:w-[250px]"
		autocomplete="off"
	/>
	<DataTableViewOptions {table} />
</div>
