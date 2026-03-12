import { createRawSnippet } from 'svelte';
import type { ColumnDef } from '@tanstack/table-core';
import type { Committee } from '$lib/types/committees.js';
import { renderComponent, renderSnippet } from '$lib/components/ui/data-table/index.js';
import { DataTableColumnHeader } from '$lib/components/data-table/index.js';
import { formatCurrency } from '$lib/components/finance/currency.js';

/**
 * Generate URL for a cost center results page
 * @param costCenter - The cost center identifier (empty string becomes 'NONE')
 * @returns The URL path for the cost center results page
 */
export function getCostCenterUrl(costCenter: string): string {
	const costCenterParam = costCenter === '' ? 'NONE' : costCenter;
	return `/admin/finance/results/${costCenterParam}`;
}

export type BudgetRow = {
	committee?: Committee;
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
			})
	},
	{
		id: 'committee',
		accessorKey: 'committee',
		header: ({ column }) =>
			renderComponent(DataTableColumnHeader<BudgetRow, unknown>, {
				column,
				title: 'OmK'
			}),
		cell: ({ row }) => {
			const name = row.original.committee?.friendlyName || '';
			return name;
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
