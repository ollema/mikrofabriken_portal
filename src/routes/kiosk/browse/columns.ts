import type { ColumnDef } from '@tanstack/table-core';
import type { Product } from '$lib/types/cog.js';
import { renderComponent } from '$lib/components/ui/data-table/index.js';
import { DataTableColumnHeader } from '$lib/components/data-table/index.js';

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
	}
];
