<script lang="ts">
	import * as PageHeader from '$lib/components/page-header/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import BarcodeGenerator from './barcode-generator.svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	let { data } = $props();

	let href = $derived('/admin/products/' + $page.params.uuid);

	function onEditProductSelected() {
		goto(href + '/edit');
	}

	function onDeleteProductSelected() {
		goto(href + '/delete');
	}
</script>

<div class="mx-auto w-full min-w-0">
	<PageHeader.Root>
		<PageHeader.Heading>
			<PageHeader.Title>{data.product?.name ?? 'Not found'}</PageHeader.Title>
		</PageHeader.Heading>
		<PageHeader.Actions>
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					{#snippet child({ props })}
						<Button {...props} variant="outline" size="sm" class="data-[state=open]:bg-muted">
							Edit
							<span class="sr-only">Open Menu</span>
						</Button>
					{/snippet}
				</DropdownMenu.Trigger>
				<DropdownMenu.Content class="w-fit" align="end">
					<DropdownMenu.Item onSelect={onEditProductSelected}>Edit product</DropdownMenu.Item>
					<DropdownMenu.Item onSelect={onDeleteProductSelected}>Delete product</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</PageHeader.Actions>
	</PageHeader.Root>

	{#snippet row({ label, value }: { label: string; value: string | number | boolean | null })}
		<div class="flex flex-col">
			<div class="text-xs font-medium uppercase text-muted-foreground">{label}</div>
			<div>{value ?? '-'}</div>
		</div>
	{/snippet}

	{#if data.product}
		<div class="flex flex-col gap-4">
			{@render row({ label: 'Name', value: data.product.name })}
			{@render row({ label: 'Category', value: data.product.category })}
			{@render row({ label: 'Details', value: data.product.details })}
			{@render row({ label: 'Unit type', value: data.product.unitType })}
			{@render row({ label: 'Unit name', value: data.product.unitName })}
			{@render row({ label: 'Price per unit', value: data.product.pricePerUnit })}
			{@render row({ label: 'VAT', value: data.product.vat })}
			{@render row({ label: 'EAN', value: data.product.ean })}
			{@render row({ label: 'Billing category', value: data.product.billingCategory })}
			{@render row({ label: 'Seller ID', value: data.product.sellerId })}
			{@render row({ label: 'Stock status', value: data.product.stockStatus })}
		</div>

		{#if data.product.ean}
			<BarcodeGenerator
				ean={data.product.ean}
				name={data.product.name}
				price={data.product.pricePerUnit}
				details={data.product.details}
			/>
		{/if}
	{:else}
		<div>Product not found</div>
	{/if}
</div>
