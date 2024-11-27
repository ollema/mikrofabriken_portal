<script lang="ts">
	import { IsMobile } from '$lib/hooks/is-mobile.svelte.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';
	import type { Product } from '$lib/types/cog';

	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';

	interface Props {
		// props
		open: boolean;
		product: Product | null | undefined;
		barcode?: string | undefined;
		processing?: boolean;
	}

	let {
		open = $bindable(),
		product = $bindable(),
		barcode = $bindable(),
		processing = $bindable(false)
	}: Props = $props();

	// internal
	let form: HTMLFormElement | undefined = $state();
	let quantity: number = $state(1);
	let purchasing: boolean = $state(false);

	async function handleCancel() {
		open = false;
		product = undefined;
		quantity = 1;

		// delay setting product to undefined to prevent double scanning
		await new Promise((resolve) => setTimeout(resolve, 2000));
		processing = false;
	}

	async function handleConfirm() {
		form?.requestSubmit();
	}

	const handleSubmit = (async () => {
		purchasing = true;
		return async ({ update }) => {
			purchasing = false;
			await update({ invalidateAll: false });

			open = false;
			product = undefined;
			quantity = 1;

			// delay setting processing to prevent double scanning
			await new Promise((resolve) => setTimeout(resolve, 2000));
			processing = false;
		};
	}) satisfies SubmitFunction;

	let isMobile = new IsMobile();

	function focusConfirmButton(e: Event) {
		e.preventDefault();
		const confirmButton = document.getElementById('confirm-purchase');
		confirmButton?.focus();
	}
</script>

{#snippet content(product: Product)}
	<div class="text-xl font-semibold">Purchase {product.name}?</div>
	<div class="mt-2 text-muted-foreground">EAN: {product.ean}</div>
	<div class="mt-2 text-muted-foreground">Price: {product.pricePerUnit} kr</div>
	<div class="text-muted-foreground">Details: {product.details}</div>
	<div class="text-muted-foreground">Category: {product.category}</div>
	<form
		method="POST"
		action="?/purchase"
		bind:this={form}
		class="mt-2 w-full"
		use:enhance={handleSubmit}
	>
		<input type="hidden" name="uuid" value={product.uuid} />
		<div class="mx-auto my-4 flex w-full flex-col items-center gap-3">
			<div class="text-md text-muted-foreground">Quantity:</div>
			<div class="flex items-center gap-2">
				<Button
					class="hidden h-12 w-12 px-2 py-0 sm:inline-flex"
					variant="secondary"
					onclick={() => (quantity = Math.max(1, quantity - 10))}
				>
					-10
				</Button>
				<Button
					class="h-12 w-12 px-2 py-0"
					variant="secondary"
					onclick={() => (quantity = Math.max(1, quantity - 5))}
				>
					-5
				</Button>
				<Button
					class="h-12 w-12 px-2 py-0"
					variant="secondary"
					onclick={() => (quantity = Math.max(1, quantity - 1))}
				>
					-1
				</Button>
				<Input
					class="h-12 w-16 px-1 py-1 text-[16px]"
					type="number"
					name="quantity"
					min="1"
					max="1000"
					tabindex={-1}
					bind:value={quantity}
				/>
				<Button
					class="h-12 w-12 px-2 py-0"
					variant="secondary"
					onclick={() => (quantity = Math.min(1000, quantity + 1))}
				>
					+1
				</Button>
				<Button
					class="h-12 w-12 px-2 py-0"
					variant="secondary"
					onclick={() => (quantity = Math.min(1000, quantity + 5))}
				>
					+5
				</Button>
				<Button
					class="hidden h-12 w-12 px-2 py-0 sm:inline-flex"
					variant="secondary"
					onclick={() => (quantity = Math.min(1000, quantity + 10))}
				>
					+10
				</Button>
			</div>
		</div>
	</form>

	<div class="mt-4 flex w-full flex-col-reverse gap-4 self-center md:w-fit md:flex-row md:self-end">
		<Button class="h-12 w-full md:w-fit" variant="outline" onclick={handleCancel}>Cancel</Button>
		<Button id="confirm-purchase" class="h-12 w-full md:w-fit" onclick={handleConfirm}>
			{#if purchasing}
				<LoaderCircle class="animate-spin" />
				Processing...
			{:else}
				Confirm
			{/if}
		</Button>
	</div>
{/snippet}

{#snippet missingProductContent()}
	<div class="text-xl font-semibold">Unknown product</div>
	<div class="mt-2 text-muted-foreground">
		Barcode:
		<span class="font-mono text-lg text-foreground">{barcode}</span>
	</div>
	<div class="text-muted-foreground">did not match any known products.</div>
	<div class="mt-2 text-muted-foreground">
		If the problem persists, the product might not exist in our database records.
	</div>
	<Button class="mt-4 max-w-40 self-end" onclick={handleCancel}>OK</Button>
{/snippet}

{#if !isMobile.current}
	<Dialog.Root bind:open>
		{#if product !== null && product !== undefined}
			<Dialog.Content
				class="flex flex-col items-start gap-0"
				onOpenAutoFocus={focusConfirmButton}
				escapeKeydownBehavior={'ignore'}
				interactOutsideBehavior={'ignore'}
			>
				{@render content(product)}
			</Dialog.Content>
		{:else}
			<Dialog.Content
				class="flex flex-col items-start gap-0"
				escapeKeydownBehavior={'ignore'}
				interactOutsideBehavior={'ignore'}
			>
				{@render missingProductContent()}
			</Dialog.Content>
		{/if}
	</Dialog.Root>
{:else}
	<Drawer.Root bind:open>
		{#if product !== null && product !== undefined}
			<Drawer.Content
				onOpenAutoFocus={focusConfirmButton}
				escapeKeydownBehavior={'ignore'}
				interactOutsideBehavior={'ignore'}
			>
				<div class="px-3 pb-2 pt-4">
					{@render content(product)}
				</div>
			</Drawer.Content>
		{:else}
			<Drawer.Content escapeKeydownBehavior={'ignore'} interactOutsideBehavior={'ignore'}>
				<div class="px-3 py-4 pb-2">
					{@render missingProductContent()}
				</div>
			</Drawer.Content>
		{/if}
	</Drawer.Root>
{/if}
