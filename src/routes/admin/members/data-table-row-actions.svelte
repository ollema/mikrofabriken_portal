<script lang="ts">
	import Ellipsis from 'lucide-svelte/icons/ellipsis';
	import type { Row } from '@tanstack/table-core';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import type { ExtendedMember } from '$lib/types/members.js';
	import { goto } from '$app/navigation';

	let { row }: { row: Row<ExtendedMember> } = $props();

	let href = $derived('/admin/members/' + row.original.slackEmail);

	function onOpenProfileSelected() {
		goto(href);
	}

	function onEditProfileSelected() {
		goto(href + '/edit');
	}

	function onEditCompanySelected() {
		goto(href + '/company/edit');
	}

	function onEditRFIDSelected() {
		goto(href + '/rfid/edit');
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
				<span class="sr-only">Open Menu</span>
			</Button>
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="w-[160px]" align="end">
		<DropdownMenu.Item onSelect={onOpenProfileSelected}>Open profile</DropdownMenu.Item>
		<DropdownMenu.Item onSelect={onEditProfileSelected}>Edit profile</DropdownMenu.Item>
		<DropdownMenu.Item onSelect={onEditCompanySelected}>Edit company</DropdownMenu.Item>
		<DropdownMenu.Item onSelect={onEditRFIDSelected}>Edit RFID</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
