<script lang="ts">
	import Root from './profile-root.svelte';
	import Group from './profile-group.svelte';
	import Item from './profile-item.svelte';
	import type { Company } from '$lib/types/company';

	interface Props {
		company: Company;
	}

	let { company }: Props = $props();
</script>

<Root>
	<Group>
		<Item label="Name" value={company.name} />
		<Item label="Org. num" value={company.orgNum} />
		<Item label="Email" value={company.email || ''} />
	</Group>
	<Group>
		<Item label="Address" value={company.postalAdress} />
		<Item label="Postal code" value={company.postalCode} />
		<Item label="City" value={company.postalCity} />
	</Group>
	<Group>
		<Item label="Default invoice recipent" value={company.invoiceDefaultTo} />
		<Item
			label="Categories excluded from default recipent"
			value={company.invoiceExcludeCategoriesFromDefault}
		/>
	</Group>
</Root>
