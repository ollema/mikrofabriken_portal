<script lang="ts">
	import Ellipsis from 'lucide-svelte/icons/ellipsis';
	import type { Row } from '@tanstack/table-core';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import type { ExtendedMember } from '$lib/types/members.js';
	import { goto } from '$app/navigation';

	let { row }: { row: Row<ExtendedMember> } = $props();

	let href = $derived('/admin/members/' + row.original.slackID);

	function onOpenProfileSelected() {
		goto(href);
	}

	function onEditProfileSelected() {
		goto(href + '/profile/edit');
	}

	function onEditCompanySelected() {
		goto(href + '/company/edit');
	}

	function onEditIceContactsSelected() {
		goto(href + '/ice/edit');
	}

	function onEditAgreementsSelected() {
		goto(href + '/agreements/edit');
	}

	function onEditArtifactsSelected() {
		goto(href + '/artifacts/edit');
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
	<DropdownMenu.Content class="w-fit" align="end">
		<DropdownMenu.Item onSelect={onOpenProfileSelected}>Open profile</DropdownMenu.Item>
		<DropdownMenu.Item onSelect={onEditProfileSelected}>Edit profile</DropdownMenu.Item>
		<DropdownMenu.Item onSelect={onEditCompanySelected}>Edit company</DropdownMenu.Item>
		<DropdownMenu.Item onSelect={onEditIceContactsSelected}>Edit ICE contacts</DropdownMenu.Item>
		<DropdownMenu.Item onSelect={onEditAgreementsSelected}>Edit RFID-tags & keys</DropdownMenu.Item>
		<DropdownMenu.Item onSelect={onEditArtifactsSelected}>Edit roles</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
