import type { ColumnDef } from '@tanstack/table-core';
import type { HistoricPurchase } from '$lib/types/cog.js';
import { renderComponent } from '$lib/components/ui/data-table/index.js';
import { DataTableColumnHeader } from '$lib/components/data-table/index.js';

export const columns: ColumnDef<HistoricPurchase>[] = [
	{
		id: 'Name',
		accessorKey: 'productName',
		header: ({ column }) =>
			renderComponent(DataTableColumnHeader<HistoricPurchase, unknown>, { column, title: 'Name' }),
		enableHiding: false
	},
	{
		id: 'Date',
		accessorFn: (row) => row.dateTime.toLocaleDateString(),
		header: ({ column }) =>
			renderComponent(DataTableColumnHeader<HistoricPurchase, unknown>, { column, title: 'Date' })
	},
	{
		id: 'Price',
		accessorFn: (row) => row.pricePerUnit.toString() + ' kr',
		header: ({ column }) =>
			renderComponent(DataTableColumnHeader<HistoricPurchase, unknown>, {
				column,
				title: 'Price'
			})
	},
	{
		id: 'Quantity',
		accessorFn: (row) => row.quantity.toString(),
		header: 'Quantity'
	},
	{
		id: 'Total',
		accessorFn: (row) => `${row.pricePerUnit * row.quantity} kr`,
		header: 'Total'
	}
];
