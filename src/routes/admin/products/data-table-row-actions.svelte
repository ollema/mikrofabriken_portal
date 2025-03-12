<script lang="ts">
	import Ellipsis from 'lucide-svelte/icons/ellipsis';
	import type { Row } from '@tanstack/table-core';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import type { Product } from '$lib/types/cog.js';
	import { goto } from '$app/navigation';

	let { row }: { row: Row<Product> } = $props();

	let href = $derived('/admin/products/' + row.original.uuid);

	function onOpenProductSelected() {
		goto(href);
	}

	function onEditProductSelected() {
		goto(href + '/edit');
	}

	function onDeleteProductSelected() {
		goto(href + '/delete');
	}
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
			<Button
				{...props}
				variant="ghost"
				class="my-[-1rem] flex h-4 w-4 p-4 data-[state=open]:bg-muted"
			>
				<Ellipsis />
			</Button>
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="w-fit" align="end">
		<DropdownMenu.Item onSelect={onOpenProductSelected}>Välj product</DropdownMenu.Item>
		<DropdownMenu.Item onSelect={onEditProductSelected}>Redigera product</DropdownMenu.Item>
		<DropdownMenu.Item onSelect={onDeleteProductSelected}>Ta bort product</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
