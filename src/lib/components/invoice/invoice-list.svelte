<script lang="ts">
	import * as PageHeader from '$lib/components/page-header/index.js';
	import type { Row } from '@tanstack/table-core';
	import { DataTable, DataTablePagination } from '$lib/components/data-table/index.js';
	import { columns } from '$lib/components/invoice/invoice-columns.js';
	import { goto } from '$app/navigation';
	import type { Invoice } from '$lib/types/fortnox.js';

	interface Props {
		data: {
			member: Member;
			invoices: {
				personal: Invoice[] | null;
				company: Invoice[] | null;
			};
		};
		getInvoiceUrl: (invoice: Invoice) => string;
	}

	let { data, getInvoiceUrl }: Props = $props();

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

	function onRowClick(row: Row<Invoice>) {
		goto(getInvoiceUrl(row.original));
	}
</script>

{#snippet subtitle(title: string)}
	<div class="mb-4 w-full text-xl">{title}</div>
{/snippet}

<div class="mx-auto w-full min-w-0">
	<PageHeader.Root class="mb-1">
		<PageHeader.Heading>
			<PageHeader.Title>Fakturor för {data.member.name}</PageHeader.Title>
		</PageHeader.Heading>
	</PageHeader.Root>

	{#if data.invoices.personal !== null}
		{@render subtitle('Personliga')}
		<DataTable data={data.invoices.personal} {columns} params={personalParams} {onRowClick}>
			{#snippet paginationControls(table)}
				<DataTablePagination {table} showPerPage={false} />
			{/snippet}
		</DataTable>
	{/if}

	{#if data.invoices.company !== null}
		{@render subtitle('Företag')}
		<DataTable data={data.invoices.company} {columns} params={companyParams} {onRowClick}>
			{#snippet paginationControls(table)}
				<DataTablePagination {table} showPerPage={false} />
			{/snippet}
		</DataTable>
	{/if}
</div>
