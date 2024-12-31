<script lang="ts">
	import * as PageHeader from '$lib/components/page-header/index.js';
	import type { Row } from '@tanstack/table-core';
	import { DataTable, DataTablePagination } from '$lib/components/data-table/index.js';
	import { columns } from './columns.js';
	import { goto } from '$app/navigation';
	import type { Invoice } from '$lib/types/fortnox.js';

	let personalParams = $state({
		columnFilters: [],
		sorting: [{ id: 'Due', desc: true }],
		pagination: {
			pageIndex: 1,
			pageSize: 3
		},
		visibility: {
			Invoice: false
		}
	});

	let companyParams = $state({
		columnFilters: [],
		sorting: [{ id: 'Due', desc: true }],
		pagination: {
			pageIndex: 1,
			pageSize: 3
		},
		visibility: {
			Invoice: false
		}
	});

	let { data } = $props();

	function onRowClick(row: Row<Invoice>) {
		goto(`/membership/invoices/${row.original.DocumentNumber}`);
	}
</script>

{#snippet subtitle(title: string)}
	<div class="mb-4 w-full text-xl">{title}</div>
{/snippet}

<div class="mx-auto w-full min-w-0">
	<PageHeader.Root class="mb-1">
		<PageHeader.Heading>
			<PageHeader.Title>Invoices</PageHeader.Title>
		</PageHeader.Heading>
	</PageHeader.Root>

	{#if data.invoices.personal !== null}
		{@render subtitle('Personal')}
		<DataTable data={data.invoices.personal} {columns} params={personalParams} {onRowClick}>
			{#snippet paginationControls(table)}
				<DataTablePagination {table} showPerPage={false} />
			{/snippet}
		</DataTable>
	{/if}

	{#if data.invoices.company !== null}
		{@render subtitle('Company')}
		<DataTable data={data.invoices.company} {columns} params={companyParams} {onRowClick}>
			{#snippet paginationControls(table)}
				<DataTablePagination {table} showPerPage={false} />
			{/snippet}
		</DataTable>
	{/if}
</div>
