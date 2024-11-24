<script lang="ts" module>
	type TData = unknown;
</script>

<script lang="ts" generics="TData">
	import X from 'lucide-svelte/icons/x';
	import type { Table } from '@tanstack/table-core';
	import { DataTableFacetedFilter, DataTableViewOptions } from './index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';

	let { table }: { table: Table<TData> } = $props();

	const isFiltered = $derived(table.getState().columnFilters.length > 0);
	const membershipCol = $derived(table.getColumn('membership'));
	const hasInvestmentCol = $derived(table.getColumn('hasInvestment'));
	const hasAsylumCol = $derived(table.getColumn('hasAsylumInside'));
	const hasAsylumOutsideCol = $derived(table.getColumn('hasAsylumOutside'));
	const hasPalletCol = $derived(table.getColumn('hasPallet'));
	const hasCompanyCol = $derived(table.getColumn('hasCompany'));
</script>

<div class="flex items-center justify-between">
	<div class="flex flex-1 items-center space-x-2">
		<Input
			placeholder="Filter members..."
			value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
			oninput={(e) => {
				table.getColumn('name')?.setFilterValue(e.currentTarget.value);
			}}
			onchange={(e) => {
				table.getColumn('name')?.setFilterValue(e.currentTarget.value);
			}}
			class="h-8 w-[150px] lg:w-[250px]"
		/>

		{#if membershipCol}
			<DataTableFacetedFilter
				column={membershipCol}
				title="Membership"
				enableSearch={false}
				options={[
					{ label: 'Active', value: 'active' },
					{ label: 'Passive', value: 'passive' },
					{ label: 'None', value: 'none' }
				]}
			/>
		{/if}

		{#if hasInvestmentCol}
			<DataTableFacetedFilter
				column={hasInvestmentCol}
				title="Investment"
				enableSearch={false}
				options={[
					{ label: 'Yes', value: 'true' },
					{ label: 'No', value: 'false' }
				]}
			/>
		{/if}

		{#if hasAsylumCol}
			<DataTableFacetedFilter
				column={hasAsylumCol}
				title="Asylum"
				enableSearch={false}
				options={[
					{ label: 'Yes', value: 'true' },
					{ label: 'No', value: 'false' }
				]}
			/>
		{/if}

		{#if hasAsylumOutsideCol}
			<DataTableFacetedFilter
				column={hasAsylumOutsideCol}
				title="Asylum outside"
				enableSearch={false}
				options={[
					{ label: 'Yes', value: 'true' },
					{ label: 'No', value: 'false' }
				]}
			/>
		{/if}

		{#if hasPalletCol}
			<DataTableFacetedFilter
				column={hasPalletCol}
				title="Pallet"
				enableSearch={false}
				options={[
					{ label: 'Yes', value: 'true' },
					{ label: 'No', value: 'false' }
				]}
			/>
		{/if}

		{#if hasCompanyCol}
			<DataTableFacetedFilter
				column={hasCompanyCol}
				title="Company"
				enableSearch={false}
				options={[
					{ label: 'Yes', value: 'true' },
					{ label: 'No', value: 'false' }
				]}
			/>
		{/if}

		{#if isFiltered}
			<Button variant="ghost" onclick={() => table.resetColumnFilters()} class="h-8 px-2 lg:px-3">
				Reset
				<X />
			</Button>
		{/if}
	</div>
	<DataTableViewOptions {table} />
</div>
