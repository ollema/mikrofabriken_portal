import type { ColumnDef } from '@tanstack/table-core';
import type { Product } from '$lib/types/cog.js';
import { createRawSnippet } from 'svelte';
import { renderComponent, renderSnippet } from '$lib/components/ui/data-table/index.js';
import { DataTableColumnHeader } from '$lib/components/data-table/index.js';
import DataTableRowActions from './data-table-row-actions.svelte';

export const columns: ColumnDef<Product>[] = [
	{
		id: 'UUID',
		accessorKey: 'uuid',
		header: 'UUID'
	},
	{
		id: 'Namn',
		accessorKey: 'name',
		header: ({ column }) =>
			renderComponent(DataTableColumnHeader<Product, unknown>, { column, title: 'Namn' }),
		cell: ({ row }) => {
			const name = row.original.name;
			const uuid = row.original.uuid;
			const href = '/admin/products/' + uuid;

			const nameCellSnippet = createRawSnippet<[string]>(() => {
				return {
					render: () => `<a class="hover:underline" href=${href}>${name}</div>`
				};
			});

			return renderSnippet(nameCellSnippet, href);
		},
		enableHiding: false
	},
	{
		id: 'Detaljer',
		accessorKey: 'details',
		header: 'Detaljer'
	},
	{
		id: 'Kategori',
		accessorKey: 'category',
		header: ({ column }) =>
			renderComponent(DataTableColumnHeader<Product, unknown>, {
				column,
				title: 'Kategori'
			})
	},
	{
		id: 'Pris',
		accessorKey: 'pricePerUnit',
		header: ({ column }) =>
			renderComponent(DataTableColumnHeader<Product, unknown>, {
				column,
				title: 'Pris'
			})
	},
	{
		id: 'Moms',
		accessorFn: (row) => row.vat.toString() + '%',
		header: 'Moms'
	},
	{
		id: 'EAN',
		accessorKey: 'ean',
		header: 'EAN'
	},
	{
		id: 'actions',
		cell: ({ row }) => renderComponent(DataTableRowActions, { row })
	}
];
