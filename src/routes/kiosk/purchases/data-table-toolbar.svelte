<script lang="ts">
	import type { Table } from '@tanstack/table-core';
	import { DataTableViewOptions } from '$lib/components/data-table/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import type { HistoricPurchase } from '$lib/types/cog.js';

	let { table }: { table: Table<HistoricPurchase> } = $props();
</script>

<div class="flex items-center justify-between">
	<Input
		placeholder="Filter purchases..."
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
	<DataTableViewOptions {table} />
</div>
