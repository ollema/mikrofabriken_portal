import { createRawSnippet } from 'svelte';
import type { ColumnDef } from '@tanstack/table-core';
import { renderComponent, renderSnippet } from '$lib/components/ui/data-table/index.js';
import { DataTableColumnHeader } from '$lib/components/data-table/index.js';
import { formatCurrency } from '$lib/components/finance/currency.js';
import type { VoucherRowWithVoucher } from '$lib/server/fortnox/fortnox-util.js';

/**
 * Generate URL for a voucher detail page
 * @param financialYear - The financial year
 * @param series - The voucher series
 * @param number - The voucher number
 * @returns The URL path for the voucher detail page
 */
function getVoucherUrl(financialYear: number, series: string, number: number): string {
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
		cell: ({ row }) => {
			const voucher = row.original.voucher;
			const href = getVoucherUrl(voucher.Year, voucher.VoucherSeries, voucher.VoucherNumber);
			const display = `${voucher.VoucherSeries}${voucher.VoucherNumber}`;
			
			const linkSnippet = createRawSnippet<[string]>(() => {
				return {
					render: () => `<a class="hover:underline font-mono" href=${href}>${display}</a>`
				};
			});
			
			return renderSnippet(linkSnippet, href);
		}
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

