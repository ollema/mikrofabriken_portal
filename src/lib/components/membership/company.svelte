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
		<Item label="Name" value={company.name} />
		<Item label="Org. num" value={company.orgNum} />
		<Item label="Email" value={company.email || ''} />
	</div>
	<div class="flex flex-col gap-4 text-sm">
		<Item label="Address" value={company.postalAdress} />
		<Item label="Postal code" value={company.postalCode} />
		<Item label="City" value={company.postalCity} />
	</div>
	<div class="flex flex-col gap-4 text-sm">
		<Item label="Categories in personal invoice" value={categoriesIncludedInPersonalInvoice} />
		<div></div>
		<Item label="Categories in company invoice" value={categoriesIncludedInCompanyInvoice} />
	</div>
</div>
