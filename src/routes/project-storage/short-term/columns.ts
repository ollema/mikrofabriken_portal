import type { ColumnDef } from '@tanstack/table-core';
import { renderComponent } from '$lib/components/ui/data-table/index.js';
import { DataTableColumnHeader } from '$lib/components/data-table/index.js';
import type { Period } from '$lib/types/cog.js';

export const columns: ColumnDef<Period>[] = [
	{
		id: 'Resource',
		accessorKey: 'resourceName',
		accessorFn: (row) => {
			return row.resourceName.replace('storageShortTerm/', '').toUpperCase();
		},
		header: ({ column }) =>
			renderComponent(DataTableColumnHeader<Period, unknown>, {
				column,
				title: 'Resource'
			})
	},
	{
		id: 'Start',
		accessorFn: (row) =>
			row.start.toLocaleDateString(undefined, { day: '2-digit', month: '2-digit' }),
		header: ({ column }) =>
			renderComponent(DataTableColumnHeader<Period, unknown>, {
				column,
				title: 'Start'
			})
	},
	{
		id: 'End',
		accessorFn: (row) =>
			row.end?.toLocaleDateString(undefined, { day: '2-digit', month: '2-digit' }) ?? '-',
		header: ({ column }) =>
			renderComponent(DataTableColumnHeader<Period, unknown>, {
				column,
				title: 'End'
			})
	},
	{
		id: 'Cost',
		accessorKey: 'cost',
		header: ({ column }) =>
			renderComponent(DataTableColumnHeader<Period, unknown>, { column, title: 'Cost' })
	}
];
