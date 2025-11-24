import { createRawSnippet } from 'svelte';
import type { ColumnDef } from '@tanstack/table-core';
import { renderComponent, renderSnippet } from '$lib/components/ui/data-table/index.js';
import { DataTableColumnHeader } from '$lib/components/data-table/index.js';
import { formatCurrency } from '$lib/components/finance/currency.js';

export type BudgetRow = {
	costCenter: string;
	cost: number;
	revenue: number;
	net: number;
};

export const columns: Array<ColumnDef<BudgetRow>> = [
	{
		id: 'costCenter',
		accessorKey: 'costCenter',
		header: ({ column }) =>
			renderComponent(DataTableColumnHeader<BudgetRow, unknown>, {
				column,
				title: 'Kostnadsställe'
			}),
		cell: ({ row }) => {
			const costCenter = row.original.costCenter;
			const href = `/admin/finance/budget/${costCenter === '' ? 'NONE' : costCenter}`;
			
			const linkSnippet = createRawSnippet<[string]>(() => {
				return {
					render: () => `<a class="hover:underline" href=${href}>${costCenter}</a>`
				};
			});
			
			return renderSnippet(linkSnippet, href);
		}
	},
	{
		id: 'cost',
		accessorKey: 'cost',
		header: ({ column }) =>
			renderComponent(DataTableColumnHeader<BudgetRow, unknown>, {
				column,
				title: 'Kostnader'
			}),
		cell: ({ row }) => formatCurrency(row.original.cost)
	},
    {
		id: 'revenue',
		accessorKey: 'revenue',
		header: ({ column }) =>
			renderComponent(DataTableColumnHeader<BudgetRow, unknown>, {
				column,
				title: 'Intäkter'
			}),
		cell: ({ row }) => formatCurrency(row.original.revenue)
	},
	{
		id: 'net',
		accessorKey: 'net',
		header: ({ column }) =>
			renderComponent(DataTableColumnHeader<BudgetRow, unknown>, {
				column,
				title: 'Netto'
			}),
		cell: ({ row }) => {
			const net = row.original.net;
			const formatted = formatCurrency(net);
			const className = net >= 0 ? 'text-green-600' : 'text-red-600';
			
			const netCellSnippet = createRawSnippet<[]>(() => {
				return {
					render: () => `<span class="${className}">${formatted}</span>`
				};
			});
			
			return renderSnippet(netCellSnippet);
		}
	}
];

