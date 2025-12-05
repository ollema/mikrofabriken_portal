import { createRawSnippet } from 'svelte';
import type { ColumnDef } from '@tanstack/table-core';
import { renderComponent, renderSnippet } from '$lib/components/ui/data-table/index.js';
import { DataTableColumnHeader } from '$lib/components/data-table/index.js';
import { formatCurrency } from '$lib/components/finance/currency.js';

export type OmkBudgetRow = {
	committee: string;
	investmentBudget: number;
	expenditureBudget: number;
	netResult: number;
	budgetLeft: number;
};

export const columns: Array<ColumnDef<OmkBudgetRow>> = [
	{
		id: 'committee',
		accessorKey: 'committee',
		header: ({ column }) =>
			renderComponent(DataTableColumnHeader<OmkBudgetRow, unknown>, {
				column,
				title: 'OmK'
			}),
		cell: ({ row }) => row.original.committee
	},
	{
		id: 'investment',
		accessorKey: 'investment',
		header: ({ column }) =>
			renderComponent(DataTableColumnHeader<OmkBudgetRow, unknown>, {
				column,
				title: 'Investeringsbudget'
			}),
		cell: ({ row }) => formatCurrency(row.original.investmentBudget)
	},
	{
		id: 'expenditure',
		accessorKey: 'expenditure',
		header: ({ column }) =>
			renderComponent(DataTableColumnHeader<OmkBudgetRow, unknown>, {
				column,
				title: 'Förbrukningsbudget'
			}),
		cell: ({ row }) => formatCurrency(row.original.expenditureBudget)
	},
	{
		id: 'result',
		accessorKey: 'result',
		header: ({ column }) =>
			renderComponent(DataTableColumnHeader<OmkBudgetRow, unknown>, {
				column,
				title: 'Resultat AB'
			}),
		cell: ({ row }) => formatCurrency(row.original.netResult)
	},
	{
		id: 'budgetLeft',
		accessorKey: 'budgetLeft',
		header: ({ column }) =>
			renderComponent(DataTableColumnHeader<OmkBudgetRow, unknown>, {
				column,
				title: 'Förbrukningsbudget kvar'
			}),
		cell: ({ row }) => {
			const budgetLeft = row.original.budgetLeft;
			const formatted = formatCurrency(budgetLeft);
			const className = budgetLeft >= 0 ? 'text-green-600' : 'text-red-600';
			
			const budgetLeftCellSnippet = createRawSnippet<[]>(() => {
				return {
					render: () => `<span class="${className}">${formatted}</span>`
				};
			});
			
			return renderSnippet(budgetLeftCellSnippet);
		}
	},
];

