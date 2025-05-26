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
			<PageHeader.Title
				>{data.product?.name ?? 'Kunde inte hitta produkten du söker.'}</PageHeader.Title
			>
		</PageHeader.Heading>
		<PageHeader.Actions>
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					{#snippet child({ props })}
						<Button {...props} variant="outline" size="sm" class="data-[state=open]:bg-muted">
							Redigera
						</Button>
					{/snippet}
				</DropdownMenu.Trigger>
				<DropdownMenu.Content class="w-fit" align="end">
					<DropdownMenu.Item onSelect={onEditProductSelected}>Redigera produkt</DropdownMenu.Item>
					<DropdownMenu.Item onSelect={onDeleteProductSelected}>Ta bort produkt</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</PageHeader.Actions>
	</PageHeader.Root>

	{#snippet row({ label, value }: { label: string; value: string | number | boolean | null })}
		<div class="flex flex-col">
			<div class="text-muted-foreground text-xs font-medium uppercase">{label}</div>
			<div>{value ?? '-'}</div>
		</div>
	{/snippet}

	{#if data.product}
		<div class="flex flex-col gap-4">
			{@render row({ label: 'Namn', value: data.product.name })}
			{@render row({ label: 'Kategori', value: data.product.category })}
			{@render row({ label: 'Detaljer', value: data.product.details })}
			{@render row({ label: 'Enhetstyp', value: data.product.unitType })}
			{@render row({ label: 'Enhetsnamn', value: data.product.unitName })}
			{@render row({ label: 'Pris per enhet', value: data.product.pricePerUnit })}
			{@render row({ label: 'Moms', value: data.product.vat })}
			{@render row({ label: 'EAN', value: data.product.ean })}
			{@render row({ label: 'Faktureringskategori', value: data.product.billingCategory })}
			{@render row({ label: 'Säljare', value: data.product.sellerId })}
			{@render row({ label: 'Lagerstatus', value: data.product.stockStatus })}
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
		<div>Kunde inte hitta produkten du söker.</div>
	{/if}
</div>
