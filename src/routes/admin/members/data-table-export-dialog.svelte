<script lang="ts">
	import { IsMobile } from '$lib/hooks/is-mobile.svelte.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import type { Table } from '@tanstack/table-core';
	import { getFlash } from 'sveltekit-flash-message';
	import { page } from '$app/state';
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
	let exportSlackID = $state(false);
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
				if (exportSlackID) {
					values.push(row.original.slackID);
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
				buttonVariants({ variant: 'outline-solid', size: 'sm' }),
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
					<Checkbox id="exportSlackEmail" bind:checked={exportSlackID} />
					<Label for="exportSlackEmail">Slack ID</Label>
				</div>
				<div class="flex items-center space-x-2">
					<Checkbox id="exportEmail" bind:checked={exportEmail} />
					<Label for="exportEmail">Email</Label>
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
		<Drawer.Trigger
			class={cn(
				buttonVariants({ variant: 'outline-solid', size: 'sm' }),
				'h-8',
				disabled && 'pointer-events-none opacity-50'
			)}
			{disabled}
		>
			Export
		</Drawer.Trigger>
		<Drawer.Content>
			<Drawer.Header class="text-left">
				<Drawer.Title>Export data</Drawer.Title>
				<Drawer.Description>
					Export data from <strong>{selected.rows.length}</strong> selected members.
				</Drawer.Description>
			</Drawer.Header>
			<div class="mx-4 grid grid-cols-2 gap-4 py-4 sm:grid-cols-3">
				<div class="flex items-center space-x-2">
					<Checkbox id="exportName" bind:checked={exportName} />
					<Label for="exportName">Name</Label>
				</div>
				<div class="flex items-center space-x-2">
					<Checkbox id="exportSlackEmail" bind:checked={exportSlackID} />
					<Label for="exportSlackEmail">Slack ID</Label>
				</div>
				<div class="flex items-center space-x-2">
					<Checkbox id="exportEmail" bind:checked={exportEmail} />
					<Label for="exportEmail">Email</Label>
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
			<Button variant="outline" class="m-4 w-auto" onclick={exportData}>Export</Button>
		</Drawer.Content>
	</Drawer.Root>
{/if}
