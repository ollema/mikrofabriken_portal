import type { ColumnDef } from '@tanstack/table-core';
import type { VoucherRowWithVoucher } from '$lib/server/fortnox/fortnox-util.js';
import { renderComponent } from '$lib/components/ui/data-table/index.js';
import { DataTableColumnHeader } from '$lib/components/data-table/index.js';
import { formatCurrency } from '$lib/components/finance/currency.js';

/**
 * Generate URL for a voucher detail page
 * @param financialYear - The financial year
 * @param series - The voucher series
 * @param number - The voucher number
 * @returns The URL path for the voucher detail page
 */
export function getVoucherUrl(financialYear: number, series: string, number: number): string {
	return `/admin/finance/vouchers/${financialYear}/${series}/${number}`;
}

const formatDate = (dateString: string): string => {
	const date = new Date(dateString);
	return date.toLocaleDateString('sv-SE');
};

export const columns: Array<ColumnDef<VoucherRowWithVoucher>> = [
	{
		id: 'date',
		accessorFn: (row) => row.voucher.TransactionDate,
		header: ({ column }) =>
			renderComponent(DataTableColumnHeader<VoucherRowWithVoucher, unknown>, {
				column,
				title: 'Datum'
			}),
		cell: ({ row }) => formatDate(row.original.voucher.TransactionDate)
	},
	{
		id: 'voucher',
		accessorFn: (row) => `${row.voucher.VoucherSeries}${row.voucher.VoucherNumber}`,
		header: ({ column }) =>
			renderComponent(DataTableColumnHeader<VoucherRowWithVoucher, unknown>, {
				column,
				title: 'Verifikation'
			}),
		cell: ({ row }) => `${row.original.voucher.VoucherSeries}${row.original.voucher.VoucherNumber}`
	},
	{
		id: 'description',
		accessorFn: (row) => row.Description || row.voucher.Description,
		header: ({ column }) =>
			renderComponent(DataTableColumnHeader<VoucherRowWithVoucher, unknown>, {
				column,
				title: 'Beskrivning'
			}),
		cell: ({ row }) => row.original.Description || row.original.voucher.Description
	},
	{
		id: 'project',
		accessorKey: 'Project',
		header: ({ column }) =>
			renderComponent(DataTableColumnHeader<VoucherRowWithVoucher, unknown>, {
				column,
				title: 'Projekt'
			}),
		cell: ({ row }) => row.original.Project || '-'
	},
	{
		id: 'debit',
		accessorKey: 'Debit',
		header: ({ column }) =>
			renderComponent(DataTableColumnHeader<VoucherRowWithVoucher, unknown>, {
				column,
				title: 'Debet'
			}),
		cell: ({ row }) => formatCurrency(row.original.Debit)
	},
	{
		id: 'credit',
		accessorKey: 'Credit',
		header: ({ column }) =>
			renderComponent(DataTableColumnHeader<VoucherRowWithVoucher, unknown>, {
				column,
				title: 'Kredit'
			}),
		cell: ({ row }) => formatCurrency(row.original.Credit)
	}
];
