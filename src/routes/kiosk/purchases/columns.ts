import type { ColumnDef } from '@tanstack/table-core';
import type { HistoricPurchase } from '$lib/types/cog.js';
import { renderComponent } from '$lib/components/ui/data-table/index.js';
import { DataTableColumnHeader } from '$lib/components/data-table/index.js';

export const columns: ColumnDef<HistoricPurchase>[] = [
	{
		id: 'Namn',
		accessorKey: 'productName',
		header: ({ column }) =>
			renderComponent(DataTableColumnHeader<HistoricPurchase, unknown>, { column, title: 'Namn' }),
		enableHiding: false
	},
	{
		id: 'Datum',
		accessorFn: (row) => row.dateTime.toLocaleDateString(),
		header: ({ column }) =>
			renderComponent(DataTableColumnHeader<HistoricPurchase, unknown>, { column, title: 'Datum' })
	},
	{
		id: 'Pris',
		accessorFn: (row) => row.pricePerUnit.toString() + ' kr',
		header: ({ column }) =>
			renderComponent(DataTableColumnHeader<HistoricPurchase, unknown>, {
				column,
				title: 'Pris'
			})
	},
	{
		id: 'Antal',
		accessorFn: (row) => row.quantity.toString(),
		header: 'Antal'
	},
	{
		id: 'Totalt',
		accessorFn: (row) => `${row.pricePerUnit * row.quantity} kr`,
		header: 'Totalt'
	}
];
