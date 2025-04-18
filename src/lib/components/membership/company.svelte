<script lang="ts">
	import Item from './profile-item.svelte';
	import type { Company } from '$lib/types/members.js';
	import { InvoiceCategoryTypes } from '$lib/schemas/members.js';

	interface Props {
		company: Company;
	}

	let { company }: Props = $props();

	const categoriesIncludedInPersonalInvoice = $derived.by(() => {
		if (company.invoiceDefaultTo === 'personal') {
			const categories = company.invoiceExcludeCategoriesFromDefault || [];
			return InvoiceCategoryTypes.options.filter((category) => !categories.includes(category));
		} else {
			const categories = company.invoiceExcludeCategoriesFromDefault || [];
			return InvoiceCategoryTypes.options.filter((category) => categories.includes(category));
		}
	});

	const categoriesIncludedInCompanyInvoice = $derived.by(() => {
		if (company.invoiceDefaultTo === 'company') {
			const categories = company.invoiceExcludeCategoriesFromDefault || [];
			return InvoiceCategoryTypes.options.filter((category) => !categories.includes(category));
		} else {
			const categories = company.invoiceExcludeCategoriesFromDefault || [];
			return InvoiceCategoryTypes.options.filter((category) => categories.includes(category));
		}
	});
</script>

<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
	<div class="flex flex-col gap-4 text-sm">
		<Item label="Företagets namn" value={company.name} />
		<Item label="Organisationsnummer" value={company.orgNum} />
		<Item label="Företagets email" value={company.email || ''} />
	</div>
	<div class="flex flex-col gap-4 text-sm">
		<Item label="Företagets adress" value={company.postalAdress} />
		<Item label="Företagets postnummer" value={company.postalCode} />
		<Item label="Företagets ort" value={company.postalCity} />
	</div>
	<div class="flex flex-col gap-4 text-sm">
		<Item label="Kategorier i personlig faktura" value={categoriesIncludedInPersonalInvoice} />
		<div></div>
		<Item label="Kategorier i företagets faktura" value={categoriesIncludedInCompanyInvoice} />
	</div>
</div>
