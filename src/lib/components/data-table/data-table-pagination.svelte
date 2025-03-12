<script lang="ts" module>
	type TData = unknown;
</script>

<script lang="ts" generics="TData">
	import ChevronRight from 'lucide-svelte/icons/chevron-right';
	import ChevronLeft from 'lucide-svelte/icons/chevron-left';
	import ChevronsRight from 'lucide-svelte/icons/chevrons-right';
	import ChevronsLeft from 'lucide-svelte/icons/chevrons-left';
	import type { Table } from '@tanstack/table-core';
	import * as Select from '$lib/components/ui/select/index.js';
	import { Button } from '$lib/components/ui/button/index.js';

	let {
		table,
		rowName,
		showPerPage
	}: { table: Table<TData>; rowName?: string; showPerPage?: boolean } = $props();

	let hasSelectColumn = $derived.by(() => {
		const allColumns = table.getAllColumns();
		return allColumns.some((column) => column.id === 'select');
	});
</script>

<div class="flex flex-col items-center justify-between gap-2 lg:flex-row">
	{#if rowName}
		{#if hasSelectColumn}
			<div class="hidden flex-1 text-sm text-muted-foreground md:block">
				{table.getFilteredSelectedRowModel().rows.length} av
				{table.getFilteredRowModel().rows.length}
				{rowName} valda.
			</div>
		{:else}
			<div class="hidden flex-1 text-sm text-muted-foreground md:block">
				{table.getFilteredRowModel().rows.length}
				{rowName} hittade.
			</div>
		{/if}
	{:else}
		<div class="flex-1"></div>
	{/if}
	<div class="flex items-center gap-2">
		{#if showPerPage}
			<div class="flex items-center gap-2">
				<p class="text-sm font-medium">Per sida</p>
				<Select.Root
					allowDeselect={false}
					type="single"
					value={`${table.getState().pagination.pageSize}`}
					onValueChange={(value) => {
						table.setPageSize(Number(value));
					}}
				>
					<Select.Trigger class="h-8 w-[60px] px-2">
						{String(table.getState().pagination.pageSize)}
					</Select.Trigger>
					<Select.Content side="top">
						{#each [10, 20, 30, 40, 50] as pageSize (pageSize)}
							<Select.Item value={`${pageSize}`}>
								{pageSize}
							</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>
		{:else}
			<div class="hidden md:flex"></div>
		{/if}
		<div class="flex items-center gap-2">
			<Button
				variant="outline"
				class="hidden size-8 p-0 lg:flex"
				onclick={() => table.setPageIndex(0)}
				disabled={!table.getCanPreviousPage()}
			>
				<ChevronsLeft />
			</Button>
			<Button
				variant="outline"
				class="size-8 p-0"
				onclick={() => table.previousPage()}
				disabled={!table.getCanPreviousPage()}
			>
				<ChevronLeft />
			</Button>
			<div class="flex w-[60px] items-center justify-center text-sm font-medium">
				{table.getState().pagination.pageIndex + 1} av
				{table.getPageCount()}
			</div>
			<Button
				variant="outline"
				class="size-8 p-0"
				onclick={() => table.nextPage()}
				disabled={!table.getCanNextPage()}
			>
				<ChevronRight />
			</Button>
			<Button
				variant="outline"
				class="hidden size-8 p-0 lg:flex"
				onclick={() => table.setPageIndex(table.getPageCount() - 1)}
				disabled={!table.getCanNextPage()}
			>
				<ChevronsRight />
			</Button>
		</div>
	</div>
</div>
