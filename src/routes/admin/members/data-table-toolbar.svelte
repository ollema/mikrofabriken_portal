<script lang="ts">
	import X from 'lucide-svelte/icons/x';
	import type { Table } from '@tanstack/table-core';
	import {
		DataTableFacetedFilter,
		DataTableViewOptions
	} from '$lib/components/data-table/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import ExportDialog from './data-table-export-dialog.svelte';
	import type { ExtendedMember } from '$lib/types/members';

	let { table }: { table: Table<ExtendedMember> } = $props();

	const isFiltered = $derived(table.getState().columnFilters.length > 0);
	const membershipCol = $derived(table.getColumn('Membership'));
	const investmentCol = $derived(table.getColumn('Investment'));
	const asylumCol = $derived(table.getColumn('Asylum'));
	const asylumOutsideCol = $derived(table.getColumn('Asylum (outside)'));
	const palletCol = $derived(table.getColumn('Pallet'));
	const companyCol = $derived(table.getColumn('Company'));
</script>

<div class="flex items-center justify-between">
	<Input
		placeholder="Filter members..."
		value={(table.getColumn('Name')?.getFilterValue() as string) ?? ''}
		oninput={(e) => {
			table.getColumn('Name')?.setFilterValue(e.currentTarget.value);
		}}
		onchange={(e) => {
			table.getColumn('Name')?.setFilterValue(e.currentTarget.value);
		}}
		class="h-8 w-[150px] lg:w-[250px]"
		autocomplete="off"
	/>

	<ExportDialog {table} />
</div>

<div class="flex items-end justify-between">
	<div class="flex flex-1 flex-wrap items-center gap-2">
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

		{#if investmentCol}
			<DataTableFacetedFilter
				column={investmentCol}
				title="Investment"
				enableSearch={false}
				options={[
					{ label: 'Yes', value: 'true' },
					{ label: 'No', value: 'false' }
				]}
			/>
		{/if}

		{#if asylumCol}
			<DataTableFacetedFilter
				column={asylumCol}
				title="Asylum"
				enableSearch={false}
				options={[
					{ label: 'Yes', value: 'true' },
					{ label: 'No', value: 'false' }
				]}
			/>
		{/if}

		{#if asylumOutsideCol}
			<DataTableFacetedFilter
				column={asylumOutsideCol}
				title="Asylum (outside)"
				enableSearch={false}
				options={[
					{ label: 'Yes', value: 'true' },
					{ label: 'No', value: 'false' }
				]}
			/>
		{/if}

		{#if palletCol}
			<DataTableFacetedFilter
				column={palletCol}
				title="Pallet"
				enableSearch={false}
				options={[
					{ label: 'Yes', value: 'true' },
					{ label: 'No', value: 'false' }
				]}
			/>
		{/if}

		{#if companyCol}
			<DataTableFacetedFilter
				column={companyCol}
				title="Company"
				enableSearch={false}
				options={[
					{ label: 'Yes', value: 'true' },
					{ label: 'No', value: 'false' }
				]}
			/>
		{/if}

		{#if isFiltered}
			<Button variant="ghost" onclick={() => table.resetColumnFilters()} class="h-8 px-2 text-xs">
				Reset
				<X />
			</Button>
		{/if}
	</div>
	<DataTableViewOptions {table} />
</div>
