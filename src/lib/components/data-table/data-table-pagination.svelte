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
				{table.getFilteredSelectedRowModel().rows.length} of
				{table.getFilteredRowModel().rows.length}
				{rowName}(s) selected.
			</div>
		{:else}
			<div class="hidden flex-1 text-sm text-muted-foreground md:block">
				{table.getFilteredRowModel().rows.length}
				{rowName}(s) found.
			</div>
		{/if}
	{:else}
		<div class="flex-1"></div>
	{/if}
	<div class="flex items-center gap-2">
		{#if showPerPage}
			<div class="flex items-center gap-2">
				<p class="text-sm font-medium">Per page</p>
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
				<span class="sr-only">Go to first page</span>
				<ChevronsLeft />
			</Button>
			<Button
				variant="outline"
				class="size-8 p-0"
				onclick={() => table.previousPage()}
				disabled={!table.getCanPreviousPage()}
			>
				<span class="sr-only">Go to previous page</span>
				<ChevronLeft />
			</Button>
			<div class="flex w-[60px] items-center justify-center text-sm font-medium">
				{table.getState().pagination.pageIndex + 1} of
				{table.getPageCount()}
			</div>
			<Button
				variant="outline"
				class="size-8 p-0"
				onclick={() => table.nextPage()}
				disabled={!table.getCanNextPage()}
			>
				<span class="sr-only">Go to next page</span>
				<ChevronRight />
			</Button>
			<Button
				variant="outline"
				class="hidden size-8 p-0 lg:flex"
				onclick={() => table.setPageIndex(table.getPageCount() - 1)}
				disabled={!table.getCanNextPage()}
			>
				<span class="sr-only">Go to last page</span>
				<ChevronsRight />
			</Button>
		</div>
	</div>
</div>
