<script lang="ts">
	import X from '@lucide/svelte/icons/x';
	import type { Table } from '@tanstack/table-core';
	import {
		DataTableFacetedFilter,
		DataTableViewOptions
	} from '$lib/components/data-table/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import ExportDialog from './data-table-export-dialog.svelte';
	import type { ExtendedMember } from '$lib/types/members.js';

	let { table }: { table: Table<ExtendedMember> } = $props();

	const isFiltered = $derived(table.getState().columnFilters.length > 0);
	const membershipCol = $derived(table.getColumn('Medlemskap'));
	const investmentCol = $derived(table.getColumn('Investering'));
	const asylumCol = $derived(table.getColumn('Asylum'));
	const asylumOutsideCol = $derived(table.getColumn('Asylum (ute)'));
	const palletCol = $derived(table.getColumn('Pallplats'));
	const companyCol = $derived(table.getColumn('Företag'));
</script>

<div class="flex items-center justify-between">
	<Input
		placeholder="Filtrera medlemmar..."
		value={(table.getColumn('Namn')?.getFilterValue() as string) ?? ''}
		oninput={(e) => {
			table.getColumn('Namn')?.setFilterValue(e.currentTarget.value);
		}}
		onchange={(e) => {
			table.getColumn('Namn')?.setFilterValue(e.currentTarget.value);
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
				title="Medlemskap"
				enableSearch={false}
				options={[
					{ label: 'Aktivt', value: 'active' },
					{ label: 'Vilande', value: 'passive' },
					{ label: 'Inget', value: 'none' }
				]}
			/>
		{/if}

		{#if investmentCol}
			<DataTableFacetedFilter
				column={investmentCol}
				title="Investering"
				enableSearch={false}
				options={[
					{ label: 'Ja', value: 'true' },
					{ label: 'Nej', value: 'false' }
				]}
			/>
		{/if}

		{#if asylumCol}
			<DataTableFacetedFilter
				column={asylumCol}
				title="Asylum"
				enableSearch={false}
				options={[
					{ label: 'Ja', value: 'true' },
					{ label: 'Nej', value: 'false' }
				]}
			/>
		{/if}

		{#if asylumOutsideCol}
			<DataTableFacetedFilter
				column={asylumOutsideCol}
				title="Asylum (ute)"
				enableSearch={false}
				options={[
					{ label: 'Ja', value: 'true' },
					{ label: 'Nej', value: 'false' }
				]}
			/>
		{/if}

		{#if palletCol}
			<DataTableFacetedFilter
				column={palletCol}
				title="Pallplats"
				enableSearch={false}
				options={[
					{ label: 'Ja', value: 'true' },
					{ label: 'Nej', value: 'false' }
				]}
			/>
		{/if}

		{#if companyCol}
			<DataTableFacetedFilter
				column={companyCol}
				title="Företag"
				enableSearch={false}
				options={[
					{ label: 'Ja', value: 'true' },
					{ label: 'Nej', value: 'false' }
				]}
			/>
		{/if}

		{#if isFiltered}
			<Button variant="ghost" onclick={() => table.resetColumnFilters()} class="h-8 px-2 text-xs">
				Återställ
				<X />
			</Button>
		{/if}
	</div>
	<DataTableViewOptions {table} />
</div>
