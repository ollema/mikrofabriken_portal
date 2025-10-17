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
	import { invoiceRowColumns as columns } from '$lib/components/invoice/invoice-row-columns.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Invoice from '$lib/components/invoice/index.js';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import type { InvoiceDetail } from '$lib/types/fortnox.js';

	interface Props {
		data: {
			invoice: InvoiceDetail;
		};
		getPdfUrl: (documentNumber: string) => string;
	}

	let { data, getPdfUrl }: Props = $props();

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

	function downloadPDF() {
		goto(getPdfUrl($page.params.documentNumber!));
	}
</script>

<div class="mx-auto w-full min-w-0">
	<PageHeader.Root>
		<PageHeader.Heading>
			<PageHeader.Title>Faktura {data.invoice.DocumentNumber}</PageHeader.Title>
		</PageHeader.Heading>
		<PageHeader.Actions>
			<Button variant="outline" size="sm" onclick={downloadPDF}>Ladda ner som PDF</Button>
		</PageHeader.Actions>
	</PageHeader.Root>

	<div class="flex flex-col gap-4">
		<Invoice.Root>
			<Invoice.Group>
				<Invoice.Item label="Namn" value={data.invoice.CustomerName} />
				<Invoice.Item label="Person/organisationsnummer" value={data.invoice.OrganisationNumber} />
				<Invoice.Item label="Customer Number" value={data.invoice.CustomerNumber} />
			</Invoice.Group>
			<Invoice.Group>
				<Invoice.Item label="Adress" value={data.invoice.Address1} />
				<Invoice.Item label="Postkod" value={data.invoice.ZipCode} />
				<Invoice.Item label="Ort" value={data.invoice.City} />
			</Invoice.Group>
			<Invoice.Group>
				<Invoice.Item label="OCR" value={data.invoice.OCR} />
				<Invoice.Item label="Faktureringsdatum" value={data.invoice.InvoiceDate} />
				<Invoice.Item label="Förfallodatum" value={data.invoice.DueDate} />
			</Invoice.Group>
		</Invoice.Root>

		<Invoice.Root>
			<Invoice.Group>
				<Invoice.Item label="Exkl. moms" value={data.invoice.Gross} />
				<Invoice.Item label="Moms" value={data.invoice.TotalVAT} />
				<Invoice.Item label="Öresutjämning" value={data.invoice.RoundOff} />
			</Invoice.Group>
			<Invoice.Group>
				<Invoice.Item label="Totalt" value={data.invoice.TotalToPay} />
				<Invoice.Item label="Betaldatum" value={data.invoice.FinalPayDate || '-'} />
			</Invoice.Group>
		</Invoice.Root>

		<DataTable data={data.invoice.InvoiceRows} {params} {columns} />
	</div>
</div>
