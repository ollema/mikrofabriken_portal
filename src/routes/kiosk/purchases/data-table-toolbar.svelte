<script lang="ts" module>
	type TData = unknown;
</script>

<script lang="ts" generics="TData">
	import type { Table } from '@tanstack/table-core';
	import { DataTableViewOptions } from '$lib/components/data-table/index.js';
	import { Input } from '$lib/components/ui/input/index.js';

	let { table }: { table: Table<TData> } = $props();
</script>

<div class="flex items-center justify-between">
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
	<DataTableViewOptions {table} />
</div>
