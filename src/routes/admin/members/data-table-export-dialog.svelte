<script lang="ts">
	import { IsMobile } from '$lib/hooks/is-mobile.svelte.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import type { Table } from '@tanstack/table-core';
	import { getFlash } from 'sveltekit-flash-message';
	import { page } from '$app/stores';
	import type { ExtendedMember } from '$lib/types/members.js';
	import { cn } from '$lib/utils.js';
	import { Checkbox } from '$lib/components/ui/checkbox/index.js';

	let { table }: { table: Table<ExtendedMember> } = $props();

	let open = $state(false);

	let isMobile = new IsMobile();

	const selected = $derived(table.getSelectedRowModel());
	const disabled = $derived(selected.rows.length === 0);

	let exportName = $state(false);
	let exportEmail = $state(true);
	let exportSlackEmail = $state(false);
	let exportPhone = $state(false);
	let exportMembership = $state(false);

	const flash = getFlash(page);

	function exportData() {
		const csv = selected.rows
			.map((row) => {
				const values = [];
				if (exportName) {
					values.push(row.original.name);
				}
				if (exportEmail) {
					values.push(row.original.email);
				}
				if (exportSlackEmail) {
					values.push(row.original.slackEmail);
				}
				if (exportPhone) {
					values.push(row.original.phone);
				}
				if (exportMembership) {
					values.push(row.original.membership);
				}
				return values.join(',');
			})
			.join('\n');

		navigator.clipboard.writeText(csv);
		open = false;

		flash.set({
			message: 'Copied exported data to clipboard',
			type: 'info'
		});
	}
</script>

{#if !isMobile.current}
	<Dialog.Root bind:open>
		<Dialog.Trigger
			class={cn(
				buttonVariants({ variant: 'outline', size: 'sm' }),
				'h-8',
				disabled && 'pointer-events-none opacity-50'
			)}
			{disabled}
		>
			Export
		</Dialog.Trigger>
		<Dialog.Content class="sm:max-w-[425px]">
			<Dialog.Header>
				<Dialog.Title>Export data</Dialog.Title>
				<Dialog.Description>
					Export data from <strong>{selected.rows.length}</strong> selected members.
				</Dialog.Description>
			</Dialog.Header>
			<div class="grid grid-cols-2 gap-4 py-4 sm:grid-cols-3">
				<div class="flex items-center space-x-2">
					<Checkbox id="exportName" bind:checked={exportName} />
					<Label for="exportName">Name</Label>
				</div>
				<div class="flex items-center space-x-2">
					<Checkbox id="exportEmail" bind:checked={exportEmail} />
					<Label for="exportEmail">Email</Label>
				</div>
				<div class="flex items-center space-x-2">
					<Checkbox id="exportSlackEmail" bind:checked={exportSlackEmail} />
					<Label for="exportSlackEmail">Slack email</Label>
				</div>
				<div class="flex items-center space-x-2">
					<Checkbox id="exportPhone" bind:checked={exportPhone} />
					<Label for="exportPhone">Phone</Label>
				</div>
				<div class="flex items-center space-x-2">
					<Checkbox id="exportMembership" bind:checked={exportMembership} />
					<Label for="exportMembership">Membership</Label>
				</div>
			</div>
			<Button variant="outline" class="w-auto" onclick={exportData}>Export</Button>
		</Dialog.Content>
	</Dialog.Root>
{:else}
	<Drawer.Root bind:open>
		<Drawer.Trigger class={buttonVariants({ variant: 'outline' })}>Edit Profile</Drawer.Trigger>
		<Drawer.Content>
			<Drawer.Header class="text-left">
				<Drawer.Title>Edit profile</Drawer.Title>
				<Drawer.Description>
					Make changes to your profile here. Click save when you're done.
				</Drawer.Description>
			</Drawer.Header>
			<form class="grid items-start gap-4 px-4">
				<div class="grid gap-2">
					<Label for="email">Email</Label>
					<Input type="email" id="email" value="shadcn@example.com" />
				</div>
				<div class="grid gap-2">
					<Label for="username">Username</Label>
					<Input id="username" value="@shadcn" />
				</div>
				<Button type="submit">Save changes</Button>
			</form>
			<Drawer.Footer class="pt-2">
				<Drawer.Close class={buttonVariants({ variant: 'outline' })}>Cancel</Drawer.Close>
			</Drawer.Footer>
		</Drawer.Content>
	</Drawer.Root>
{/if}
