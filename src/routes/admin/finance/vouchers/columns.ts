import { createRawSnippet } from 'svelte';
import type { ColumnDef } from '@tanstack/table-core';
import type { VoucherListItem } from '$lib/types/fortnox.js';
import { renderComponent, renderSnippet } from '$lib/components/ui/data-table/index.js';
import { DataTableColumnHeader } from '$lib/components/data-table/index.js';

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
			const series = row.original.VoucherSeries;
			const number = row.original.VoucherNumber;
			const href = `/admin/finance/vouchers/${series}/${number}`;
			
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

