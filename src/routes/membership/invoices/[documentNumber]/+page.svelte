<script lang="ts">
	import * as PageHeader from '$lib/components/page-header/index.js';
	import { ssp, queryParameters } from 'sveltekit-search-params';
	import type {
		ColumnFiltersState,
		SortingState,
		PaginationState,
		VisibilityState
	} from '@tanstack/table-core';
	import { DataTable } from '$lib/components/data-table/index.js';
	import { columns } from './columns.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Invoice from '$lib/components/invoice/index.js';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	const params = queryParameters(
		{
			columnFilters: ssp.object<ColumnFiltersState>([]),
			sorting: ssp.object<SortingState>([]),
			pagination: ssp.object<PaginationState>({
				pageIndex: 1,
				pageSize: 10
			}),
			visibility: ssp.object<VisibilityState>({
				Invoice: false
			})
		},
		{
			debounceHistory: 500,
			showDefaults: false
		}
	);

	let { data } = $props();

	function downloadPDF() {
		goto(`/membership/invoices/${$page.params.documentNumber}/pdf`);
	}
</script>

<div class="mx-auto w-full min-w-0">
	<PageHeader.Root>
		<PageHeader.Heading>
			<PageHeader.Title>Invoice {data.invoice.DocumentNumber}</PageHeader.Title>
		</PageHeader.Heading>
		<PageHeader.Actions>
			<Button variant="outline" onclick={downloadPDF}>Download PDF</Button>
		</PageHeader.Actions>
	</PageHeader.Root>

	<div class="flex flex-col gap-4">
		<Invoice.Root>
			<Invoice.Group>
				<Invoice.Item label="Name" value={data.invoice.CustomerName} />
				<Invoice.Item label="Org. Number" value={data.invoice.OrganisationNumber} />
				<Invoice.Item label="Customer Number" value={data.invoice.CustomerNumber} />
			</Invoice.Group>
			<Invoice.Group>
				<Invoice.Item label="Address" value={data.invoice.Address1} />
				<Invoice.Item label="Postal code" value={data.invoice.ZipCode} />
				<Invoice.Item label="City" value={data.invoice.City} />
			</Invoice.Group>
			<Invoice.Group>
				<Invoice.Item label="OCR" value={data.invoice.OCR} />
				<Invoice.Item label="Invoice Date" value={data.invoice.InvoiceDate} />
				<Invoice.Item label="Due Date" value={data.invoice.DueDate} />
			</Invoice.Group>
		</Invoice.Root>

		<Invoice.Root>
			<Invoice.Group>
				<Invoice.Item label="Gross" value={data.invoice.Gross} />
				<Invoice.Item label="Net" value={data.invoice.Net} />
				<Invoice.Item label="VAT" value={data.invoice.TotalVAT} />
			</Invoice.Group>
			<Invoice.Group>
				<Invoice.Item label="Round Off" value={data.invoice.RoundOff} />
				<Invoice.Item label="Total" value={data.invoice.TotalToPay} />
				<Invoice.Item label="Paid Date" value={data.invoice.FinalPayDate || '-'} />
			</Invoice.Group>
		</Invoice.Root>

		<DataTable data={data.invoice.InvoiceRows} {params} {columns} />
	</div>
</div>
