<script lang="ts" module>
	type TData = unknown;
	type TValue = unknown;
</script>

<script lang="ts" generics="TData, TValue">
	import ArrowDown from '@lucide/svelte/icons/arrow-down';
	import ArrowUp from '@lucide/svelte/icons/arrow-up';
	import ChevronsUpDown from '@lucide/svelte/icons/chevrons-up-down';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Column } from '@tanstack/table-core';
	import type { WithoutChildren } from 'bits-ui';
	import { cn } from '$lib/utils.js';
	import { Button } from '$lib/components/ui/button/index.js';

	type Props = HTMLAttributes<HTMLDivElement> & {
		column: Column<TData, TValue>;
		title: string;
	};

	let { column, class: className, title, ...restProps }: WithoutChildren<Props> = $props();

	function handleClick() {
		if (column?.getCanSort()) {
			column.toggleSorting();
		}
	}
</script>

{#if !column?.getCanSort()}
	<div class={className} {...restProps}>
		{title}
	</div>
{:else}
	<div class={cn('flex items-center', className)} {...restProps}>
		<Button
			onclick={handleClick}
			variant="ghost"
			size="sm"
			class="data-[state=open]:bg-accent -ml-3 h-8"
		>
			<span>
				{title}
			</span>
			{#if column.getIsSorted() === 'desc'}
				<ArrowDown />
			{:else if column.getIsSorted() === 'asc'}
				<ArrowUp />
			{:else}
				<ChevronsUpDown />
			{/if}
		</Button>
	</div>
{/if}
