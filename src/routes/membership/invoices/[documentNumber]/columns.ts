import type { ColumnDef } from '@tanstack/table-core';
import type { InvoiceRow } from '$lib/types/fortnox.js';

export const columns: ColumnDef<InvoiceRow>[] = [
	{
		id: 'Description',
		accessorKey: 'Description',
		header: 'Description'
	},
	{
		id: 'Quantity',
		accessorKey: 'DeliveredQuantity',
		header: 'Quantity'
	},
	{
		id: 'Price',
		accessorKey: 'PriceExcludingVAT',
		header: 'Price'
	},
	{
		id: 'Total',
		accessorKey: 'TotalExcludingVAT',
		header: 'Total'
	}
];
