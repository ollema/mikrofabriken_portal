import { createRawSnippet } from 'svelte';
import type { ColumnDef } from '@tanstack/table-core';
import { renderComponent, renderSnippet } from '$lib/components/ui/data-table/index.js';
import { DataTableColumnHeader } from '$lib/components/data-table/index.js';
import { formatCurrency } from '$lib/components/finance/currency.js';
import type { AccountDetails } from '$lib/server/fortnox/fortnox-util.js';

export type AccountBreakdownRow = {
	account: AccountDetails;
	debit: number;
	credit: number;
	net: number;
};

/**
 * Generate URL for an account detail page within a cost center
 * @param costCenter - The cost center identifier (empty string becomes 'NONE')
 * @param accountNumber - The account number
 * @returns The URL path for the account detail page
 */
function getAccountUrl(costCenter: string, accountNumber: number): string {
	const costCenterParam = costCenter === '' ? 'NONE' : costCenter;
	return `/admin/finance/results/${costCenterParam}/${accountNumber}`;
}

const formatAccountNumber = (account: number): string => {
	return account.toString().padStart(4, '0');
};

export const createColumns = (costCenter: string): Array<ColumnDef<AccountBreakdownRow>> => [
	{
		id: 'account',
		accessorKey: 'account.number',
		header: ({ column }) =>
			renderComponent(DataTableColumnHeader<AccountBreakdownRow, unknown>, {
				column,
				title: 'Konto'
			}),
		cell: ({ row }) => {
			const accountNumber = row.original.account.number;
			const href = getAccountUrl(costCenter, accountNumber);
			const formatted = formatAccountNumber(accountNumber);
			
			const linkSnippet = createRawSnippet<[string]>(() => {
				return {
					render: () => `<a class="hover:underline font-mono" href=${href}>${formatted}</a>`
				};
			});
			
			return renderSnippet(linkSnippet, href);
		}
	},
	{
		id: 'description',
		accessorKey: 'account.description',
		header: ({ column }) =>
			renderComponent(DataTableColumnHeader<AccountBreakdownRow, unknown>, {
				column,
				title: 'Typ'
			}),
		cell: ({ row }) => row.original.account.description
	},
	{
		id: 'debit',
		accessorKey: 'debit',
		header: ({ column }) =>
			renderComponent(DataTableColumnHeader<AccountBreakdownRow, unknown>, {
				column,
				title: 'Debet'
			}),
		cell: ({ row }) => formatCurrency(row.original.debit)
	},
	{
		id: 'credit',
		accessorKey: 'credit',
		header: ({ column }) =>
			renderComponent(DataTableColumnHeader<AccountBreakdownRow, unknown>, {
				column,
				title: 'Kredit'
			}),
		cell: ({ row }) => formatCurrency(row.original.credit)
	},
	{
		id: 'net',
		accessorKey: 'net',
		header: ({ column }) =>
			renderComponent(DataTableColumnHeader<AccountBreakdownRow, unknown>, {
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

