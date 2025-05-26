<script lang="ts">
	import Ellipsis from '@lucide/svelte/icons/ellipsis';
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

	function onEditCommissionsSelected() {
		goto(href + '/commissions/edit');
	}

	function onEditWorkPoolsSelected() {
		goto(href + '/work-pools/edit');
	}
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
			<Button {...props} variant="ghost" class="data-[state=open]:bg-muted -my-4 flex h-4 w-4 p-4">
				<Ellipsis />
			</Button>
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="w-fit" align="end">
		<DropdownMenu.Item onSelect={onOpenProfileSelected}>Öppna profil</DropdownMenu.Item>
		<DropdownMenu.Item onSelect={onEditProfileSelected}>Redigera profil</DropdownMenu.Item>
		<DropdownMenu.Item onSelect={onEditCompanySelected}>Redigera företag</DropdownMenu.Item>
		<DropdownMenu.Item onSelect={onEditIceContactsSelected}
			>Redigera ICE-kontakter</DropdownMenu.Item
		>
		<DropdownMenu.Item onSelect={onEditAgreementsSelected}>Redigera avtal</DropdownMenu.Item>
		<DropdownMenu.Item onSelect={onEditArtifactsSelected}
			>Redigera RFID-taggar & nycklar</DropdownMenu.Item
		>
		<DropdownMenu.Item onSelect={onEditCommissionsSelected}>Redigera roller</DropdownMenu.Item>
		<DropdownMenu.Item onSelect={onEditWorkPoolsSelected}>Redigera arbetspooler</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
