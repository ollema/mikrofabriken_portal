<script lang="ts">
	import { goto } from '$app/navigation';
	import * as PageHeader from '$lib/components/page-header/index.js';
	import { formatCurrency } from '$lib/components/finance/currency.js';
	import { ssp, queryParameters } from 'sveltekit-search-params';
	import type {
		ColumnFiltersState,
		SortingState,
		PaginationState,
		VisibilityState,
		Table
	} from '@tanstack/table-core';
	import { DataTable, DataTablePagination } from '$lib/components/data-table/index.js';
	import type { AccountDetails, VoucherRowWithVoucher } from '$lib/server/fortnox/fortnox-util.js';
	import { columns, getVoucherUrl } from './columns.js';

	const params = queryParameters(
		{
			columnFilters: ssp.object<ColumnFiltersState>([]),
			sorting: ssp.object<SortingState>([{ id: 'date', desc: true }]),
			pagination: ssp.object<PaginationState>({
				pageIndex: 1,
				pageSize: 25
			}),
			visibility: ssp.object<VisibilityState>({})
		},
		{
			debounceHistory: 500,
			showDefaults: false
		}
	);

	let { data } = $props();
	const costCenter = data.costCenter;
	const account = data.account as AccountDetails;
	const voucherRows = data.voucherRows as VoucherRowWithVoucher[];

	const formatAccountNumber = (account: number): string => {
		return account.toString().padStart(4, '0');
	};

	const totalDebit = voucherRows.reduce((sum, row) => sum + row.Debit, 0);
	const totalCredit = voucherRows.reduce((sum, row) => sum + row.Credit, 0);
	const net = totalDebit - totalCredit;
</script>

<div class="mx-auto w-full min-w-0">
	<PageHeader.Root>
		<PageHeader.Heading>
			<PageHeader.Title>
				Konto {formatAccountNumber(account.number)} - {costCenter || 'NONE'}
			</PageHeader.Title>
			<PageHeader.Description>{account.description}</PageHeader.Description>
		</PageHeader.Heading>
	</PageHeader.Root>

	<!-- Summary -->
	<div class="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
		<div class="bg-card rounded-lg border p-4">
			<div class="text-muted-foreground text-sm">Total Debet</div>
			<div class="text-2xl font-semibold">{formatCurrency(totalDebit)}</div>
		</div>
		<div class="bg-card rounded-lg border p-4">
			<div class="text-muted-foreground text-sm">Total Kredit</div>
			<div class="text-2xl font-semibold">{formatCurrency(totalCredit)}</div>
		</div>
		<div class="bg-card rounded-lg border p-4">
			<div class="text-muted-foreground text-sm">Netto</div>
			<div class="text-2xl font-semibold {net >= 0 ? 'text-green-600' : 'text-red-600'}">
				{formatCurrency(net)}
			</div>
		</div>
	</div>

	<DataTable
		data={voucherRows}
		{columns}
		{params}
		onRowClick={(row) => {
			const v = row.original.voucher;
			goto(getVoucherUrl(v.Year, v.VoucherSeries, v.VoucherNumber));
		}}
	>
		{#snippet paginationControls(table: Table<VoucherRowWithVoucher>)}
			<DataTablePagination {table} rowName="verifikationsrader" showPerPage />
		{/snippet}
	</DataTable>
</div>
