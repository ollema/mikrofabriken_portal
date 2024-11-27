import type { ColumnDef } from '@tanstack/table-core';
import type { Product } from '$lib/types/cog';
import { renderComponent } from '$lib/components/ui/data-table/index.js';
import { DataTableColumnHeader } from '$lib/components/data-table/index.js';

export const columns: ColumnDef<Product>[] = [
	{
		id: 'UUID',
		accessorKey: 'uuid',
		header: 'UUID'
	},
	{
		id: 'Name',
		accessorKey: 'name',
		header: ({ column }) =>
			renderComponent(DataTableColumnHeader<Product, unknown>, { column, title: 'Name' }),
		enableHiding: false
	},
	{
		id: 'Details',
		accessorKey: 'details',
		header: 'Details'
	},
	{
		id: 'Category',
		accessorKey: 'category',
		header: ({ column }) =>
			renderComponent(DataTableColumnHeader<Product, unknown>, {
				column,
				title: 'Category'
			})
	},
	{
		id: 'Price',
		accessorKey: 'pricePerUnit',
		header: ({ column }) =>
			renderComponent(DataTableColumnHeader<Product, unknown>, {
				column,
				title: 'Price'
			})
	},
	{
		id: 'VAT',
		accessorFn: (row) => row.vat.toString() + '%',
		header: 'VAT'
	},
	{
		id: 'EAN',
		accessorKey: 'ean',
		header: 'EAN'
	}
];
