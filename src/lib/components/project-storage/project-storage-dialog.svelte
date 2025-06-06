<script lang="ts">
	import { IsMobile } from '$lib/hooks/is-mobile.svelte.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { tick } from 'svelte';
	import { fromDate, toCalendarDate, toTime } from '@internationalized/date';

	interface Props {
		open: boolean;
		storage:
			| {
					name: string;
					period: {
						uuid: string;
						member: {
							name: string;
							slackID: string;
						};
						start: Date;
						end: Date | null;
					} | null;
			  }
			| undefined;
		currentUserSlackID?: string;
		onClose?: () => void;
	}

	let { open = $bindable(), storage = $bindable(), currentUserSlackID, onClose }: Props = $props();

	let form: HTMLFormElement | undefined = $state();
	let processing: boolean = $state(false);

	async function submitForm() {
		form?.requestSubmit();
	}

	const handleSubmit: SubmitFunction = async () => {
		processing = true;
		return async ({ result, update }) => {
			if (result.type === 'success') {
				await update();
			}
			processing = false;
			closeDialog();
		};
	};

	let isMobile = new IsMobile();

	function focusConfirmButton(e: Event) {
		e.preventDefault();
		const confirmButton = document.getElementById('confirm-storage');
		confirmButton?.focus();
	}

	async function closeDialog() {
		open = false;
		await tick();
		storage = undefined;
		onClose?.();
	}

	async function onOpenChange(isOpen: boolean) {
		if (!isOpen) {
			await closeDialog();
		}
	}

	const periodSince = $derived.by(() => {
		if (storage?.period) {
			const date = fromDate(storage.period.start, 'Europe/Stockholm');
			return toCalendarDate(date) + ' ' + toTime(date).toString().split('.')[0];
		}
	});
</script>

{#snippet reserveContent()}
	<div class="text-xl font-semibold">
		Boka {storage?.name.replace(/storage(Short|Medium)Term\//, '').toUpperCase()}?
	</div>

	<form
		method="POST"
		action="?/reserve"
		bind:this={form}
		class="mt-2 w-full"
		use:enhance={handleSubmit}
	>
		<input type="hidden" name="storage" value={storage?.name} />
	</form>

	<div class="mt-4 flex w-full flex-col-reverse gap-4 self-center md:w-fit md:flex-row md:self-end">
		<Button class="h-12 w-full md:w-fit" variant="outline" onclick={closeDialog}>Avbryt</Button>
		<Button id="confirm-storage" class="h-12 w-full md:w-fit" onclick={submitForm}>
			{#if processing}
				<LoaderCircle class="animate-spin" />
				Laddar...
			{:else}
				Bekräfta
			{/if}
		</Button>
	</div>
{/snippet}

{#snippet releaseContent()}
	<div class="text-xl font-semibold">
		Avboka {storage?.name.replace(/storage(Short|Medium)Term\//, '').toUpperCase()}?
	</div>
	<div class="text-muted-foreground mt-2">
		Bokad av dig<br />
		sedan {storage?.period?.start
			.toISOString()
			.replace('T', ' ')
			.replace(/\.\d{3}Z/, '')}
	</div>

	<form
		method="POST"
		action="?/release"
		bind:this={form}
		class="mt-2 w-full"
		use:enhance={handleSubmit}
	>
		<input type="hidden" name="uuid" value={storage?.period?.uuid} />
	</form>

	<div class="mt-4 flex w-full flex-col-reverse gap-4 self-center md:w-fit md:flex-row md:self-end">
		<Button class="h-12 w-full md:w-fit" variant="outline" onclick={closeDialog}>Avbryt</Button>
		<Button
			id="confirm-storage"
			class="h-12 w-full md:w-fit"
			variant="destructive"
			onclick={submitForm}
		>
			{#if processing}
				<LoaderCircle class="animate-spin" />
				Laddar...
			{:else}
				Bekräfta
			{/if}
		</Button>
	</div>
{/snippet}

{#snippet occupiedContent()}
	<div class="text-xl font-semibold">
		{storage?.name.replace(/storage(Short|Medium)Term\//, '').toUpperCase()} är upptagen
	</div>
	<div class="text-muted-foreground mt-2">
		Bokad av {storage?.period?.member?.name}<br />
		sedan {periodSince}
	</div>

	<div class="mt-4 flex w-full justify-end">
		<Button class="h-12 w-full md:w-fit" variant="outline" onclick={closeDialog}>Stäng</Button>
	</div>
{/snippet}

{#if !isMobile.current}
	<Dialog.Root bind:open {onOpenChange}>
		<Dialog.Content
			class="flex flex-col items-start gap-0"
			onOpenAutoFocus={focusConfirmButton}
			escapeKeydownBehavior="ignore"
			interactOutsideBehavior="ignore"
		>
			{#if storage}
				{#if storage.period}
					{#if storage.period.member?.slackID === currentUserSlackID}
						{@render releaseContent()}
					{:else}
						{@render occupiedContent()}
					{/if}
				{:else}
					{@render reserveContent()}
				{/if}
			{/if}
		</Dialog.Content>
	</Dialog.Root>
{:else}
	<Drawer.Root bind:open {onOpenChange}>
		<Drawer.Content
			onOpenAutoFocus={focusConfirmButton}
			escapeKeydownBehavior="ignore"
			interactOutsideBehavior="ignore"
		>
			<div class="px-3 pt-4 pb-2">
				{#if storage}
					{#if storage.period}
						{#if storage.period.member?.slackID === currentUserSlackID}
							{@render releaseContent()}
						{:else}
							{@render occupiedContent()}
						{/if}
					{:else}
						{@render reserveContent()}
					{/if}
				{/if}
			</div>
		</Drawer.Content>
	</Drawer.Root>
{/if}
