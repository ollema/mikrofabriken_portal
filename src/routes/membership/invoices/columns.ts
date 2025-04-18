import type { ColumnDef } from '@tanstack/table-core';
import type { Invoice } from '$lib/types/fortnox.js';
import { renderComponent } from '$lib/components/ui/data-table/index.js';
import { DataTableColumnHeader, DataTableBooleanCell } from '$lib/components/data-table/index.js';

export const columns: ColumnDef<Invoice>[] = [
	{
		id: 'Status',
		accessorKey: 'FinalPayDate',
		header: 'Status',
		cell: ({ row }) => {
			return renderComponent(DataTableBooleanCell, {
				value: row.original.FinalPayDate !== null ? 'true' : 'false'
			});
		}
	},
	{
		id: 'Due',
		accessorKey: 'DueDate',
		header: ({ column }) =>
			renderComponent(DataTableColumnHeader<Invoice, unknown>, {
				column,
				title: 'Förfallodatum'
			})
	},
	{
		id: 'Paid',
		accessorKey: 'FinalPayDate',
		header: 'Betaldatum',
		cell: ({ row }) => {
			if (row.original.FinalPayDate !== null) {
				return row.original.FinalPayDate;
			} else {
				return '-';
			}
		}
	},
	{
		id: 'Invoice',
		accessorKey: 'DocumentNumber',
		header: 'Faktura'
	}
];
