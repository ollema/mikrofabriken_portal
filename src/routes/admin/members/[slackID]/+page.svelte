<script lang="ts">
	import * as PageHeader from '$lib/components/page-header/index.js';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import Profile from '$lib/components/membership/profile.svelte';
	import { goto } from '$app/navigation';

	let { data } = $props();

	let href = $derived('/admin/members/' + data.member.slackID);

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

<div class="mx-auto w-full">
	<PageHeader.Root>
		<PageHeader.Heading>
			<div class="flex w-full items-center justify-between">
				<div class="flex items-center gap-2">
					<Avatar.Root class="h-14 w-14">
						<Avatar.Image src={data.avatar} alt={data.member.name} />
						<Avatar.Fallback>{data.member.name[0]}</Avatar.Fallback>
					</Avatar.Root>
					<PageHeader.Title>{data.member.name}</PageHeader.Title>
				</div>
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						{#snippet child({ props })}
							<Button {...props} variant="outline" size="sm" class="data-[state=open]:bg-muted">
								Redigera
							</Button>
						{/snippet}
					</DropdownMenu.Trigger>
					<DropdownMenu.Content class="w-fit" align="end">
						<DropdownMenu.Item onSelect={onEditProfileSelected}>Redigera profil</DropdownMenu.Item>
						{#if data.member.company}
							<DropdownMenu.Item onSelect={onEditCompanySelected}
								>Redigera företag</DropdownMenu.Item
							>
						{:else}
							<DropdownMenu.Item onSelect={onEditCompanySelected}
								>Lägg till företag</DropdownMenu.Item
							>
						{/if}
						<DropdownMenu.Item onSelect={onEditIceContactsSelected}
							>Redigera ICE-kontakter</DropdownMenu.Item
						>
						<DropdownMenu.Item onSelect={onEditAgreementsSelected}>Redigera avtal</DropdownMenu.Item
						>
						<DropdownMenu.Item onSelect={onEditArtifactsSelected}>
							Redigera RFID-taggar & nycklar
						</DropdownMenu.Item>
						<DropdownMenu.Item onSelect={onEditCommissionsSelected}>Redigera roller</DropdownMenu.Item>
						<DropdownMenu.Item onSelect={onEditWorkPoolsSelected}
							>Redigera arbetspooler</DropdownMenu.Item
						>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</div>
		</PageHeader.Heading>
	</PageHeader.Root>

	<Profile
		member={data.member}
		workPoolNameMapping={data.workPoolNameMapping}
		pending={data.pending}
	/>
</div>
