import { createRawSnippet } from 'svelte';
import type { ColumnDef } from '@tanstack/table-core';
import type { VoucherListItem } from '$lib/types/fortnox.js';
import { renderComponent, renderSnippet } from '$lib/components/ui/data-table/index.js';
import { DataTableColumnHeader } from '$lib/components/data-table/index.js';

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

export const columns: Array<ColumnDef<VoucherListItem>> = [
	{
		id: 'VoucherSeries',
		accessorKey: 'VoucherSeries',
		header: 'Serie'
	},
	{
		id: 'VoucherNumber',
		accessorKey: 'VoucherNumber',
		header: ({ column }) =>
			renderComponent(DataTableColumnHeader<VoucherListItem, unknown>, {
				column,
				title: 'Nummer'
			}),
		cell: ({ row }) => {
			const financialYear = row.original.Year;
			const series = row.original.VoucherSeries;
			const number = row.original.VoucherNumber;
			const href = getVoucherUrl(financialYear, series, number);
			
			const linkSnippet = createRawSnippet<[string]>(() => {
				return {
					render: () => `<a class="hover:underline" href=${href}>${number}</a>`
				};
			});
			
			return renderSnippet(linkSnippet, href);
		},
		enableHiding: false
	},
	{
		id: 'TransactionDate',
		accessorKey: 'TransactionDate',
		header: ({ column }) =>
			renderComponent(DataTableColumnHeader<VoucherListItem, unknown>, {
				column,
				title: 'Datum'
			})
	},
	{
		id: 'Description',
		accessorKey: 'Description',
		header: 'Beskrivning'
	},
];

