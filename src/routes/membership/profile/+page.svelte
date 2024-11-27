<script lang="ts">
	import * as PageHeader from '$lib/components/page-header/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import Cog from 'lucide-svelte/icons/cog';
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

	function onEditRFIDSelected() {
		goto(href + '/rfid/edit');
	}
</script>

<div class="mx-auto w-full">
	<PageHeader.Root>
		<PageHeader.Heading>
			<div class="flex w-full items-center justify-between">
				<PageHeader.Title>{data.member.name}</PageHeader.Title>
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						{#snippet child({ props })}
							<Button
								{...props}
								variant="ghost"
								class="flex size-10 p-1 data-[state=open]:bg-muted [&_svg]:size-7"
							>
								<Cog />
								<span class="sr-only">Open Menu</span>
							</Button>
						{/snippet}
					</DropdownMenu.Trigger>
					<DropdownMenu.Content class="w-[160px]" align="end">
						<DropdownMenu.Item onSelect={onEditProfileSelected}>Edit profile</DropdownMenu.Item>
						{#if data.member.company}
							<DropdownMenu.Item onSelect={onEditCompanySelected}>Edit company</DropdownMenu.Item>
						{:else}
							<DropdownMenu.Item onSelect={onEditCompanySelected}>Add company</DropdownMenu.Item>
						{/if}
						<DropdownMenu.Item onSelect={onEditRFIDSelected}>Edit RFID</DropdownMenu.Item>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</div>
		</PageHeader.Heading>
	</PageHeader.Root>

	<Profile member={data.member} pending={data.pending} />
</div>
