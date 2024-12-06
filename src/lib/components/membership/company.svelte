<script lang="ts">
	import Item from './profile-item.svelte';
	import type { Company } from '$lib/types/company';

	interface Props {
		company: Company;
	}

	let { company }: Props = $props();
</script>

<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
	<div class="flex flex-col gap-4 rounded-xl border bg-card p-6 text-card-foreground shadow">
		<Item label="Name" value={company.name} />
		<Item label="Org. num" value={company.orgNum} />
		<Item label="Email" value={company.email || ''} />
	</div>
	<div class="flex flex-col gap-4 rounded-xl border bg-card p-6 text-card-foreground shadow">
		<Item label="Address" value={company.postalAdress} />
		<Item label="Postal code" value={company.postalCode} />
		<Item label="City" value={company.postalCity} />
	</div>
	<div class="flex flex-col gap-4 rounded-xl border bg-card p-6 text-card-foreground shadow">
		<Item label="Default invoice recipient" value={company.invoiceDefaultTo} />
		<Item
			label="Categories excluded from default recipient"
			value={company.invoiceExcludeCategoriesFromDefault}
		/>
	</div>
</div>
