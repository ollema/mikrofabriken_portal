<script lang="ts">
	import * as PageHeader from '$lib/components/page-header/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import Profile from '$lib/components/membership/profile.svelte';
	import { goto } from '$app/navigation';

	let { data } = $props();

	let href = $derived('/membership/profile');

	function onEditProfileSelected() {
		goto(href + '/edit');
	}

	function onEditCompanySelected() {
		goto(href + '/company/edit');
	}

	function onEditIceContactsSelected() {
		goto(href + '/ice/edit');
	}

	function onEditRFIDSelected() {
		goto(href + '/rfid/edit');
	}

	function onEditWorkPoolsSelected() {
		goto(href + '/work-pools/edit');
	}
</script>

<div class="mx-auto w-full">
	<PageHeader.Root class="mb-1">
		<PageHeader.Heading>
			<div class="flex w-full items-center justify-between">
				<PageHeader.Title>{data.member.name}</PageHeader.Title>
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						{#snippet child({ props })}
							<Button {...props} variant="outline" size="sm" class="data-[state=open]:bg-muted">
								Redigera
							</Button>
						{/snippet}
					</DropdownMenu.Trigger>
					<DropdownMenu.Content class="w-[180px]" align="end">
						<DropdownMenu.Item onSelect={onEditProfileSelected}>Redigera profil</DropdownMenu.Item>
						{#if data.member.company}
							<DropdownMenu.Item onSelect={onEditCompanySelected}>
								Redigera företag
							</DropdownMenu.Item>
						{:else}
							<DropdownMenu.Item onSelect={onEditCompanySelected}>
								Lägg till företag
							</DropdownMenu.Item>
						{/if}
						<DropdownMenu.Item onSelect={onEditIceContactsSelected}>
							Redigera ICE-kontakter
						</DropdownMenu.Item>
						<DropdownMenu.Item onSelect={onEditRFIDSelected}>
							Redigera RFID-taggar
						</DropdownMenu.Item>
						<DropdownMenu.Item onSelect={onEditWorkPoolsSelected}>
							Redigera arbetspooler
						</DropdownMenu.Item>
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
