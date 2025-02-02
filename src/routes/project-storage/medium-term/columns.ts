import type { ColumnDef } from '@tanstack/table-core';
import { renderComponent } from '$lib/components/ui/data-table/index.js';
import { DataTableColumnHeader } from '$lib/components/data-table/index.js';
import type { OpenPeriod } from '$lib/types/cog.js';

export const columns: ColumnDef<OpenPeriod>[] = [
	{
		id: 'Resource',
		accessorKey: 'resourceName',
		accessorFn: (row) => {
			return row.resourceName.replace('storage/', '').toUpperCase();
		},
		header: ({ column }) =>
			renderComponent(DataTableColumnHeader<OpenPeriod, unknown>, {
				column,
				title: 'Resource'
			})
	},
	{
		id: 'Start',
		accessorFn: (row) =>
			row.start.toLocaleDateString(undefined, { day: '2-digit', month: '2-digit' }),
		header: ({ column }) =>
			renderComponent(DataTableColumnHeader<OpenPeriod, unknown>, {
				column,
				title: 'Start'
			})
	},
	{
		id: 'End',
		accessorFn: (row) =>
			row.end?.toLocaleDateString(undefined, { day: '2-digit', month: '2-digit' }) ?? '-',
		header: ({ column }) =>
			renderComponent(DataTableColumnHeader<OpenPeriod, unknown>, {
				column,
				title: 'End'
			})
	},
	{
		id: 'Cost',
		accessorKey: 'cost',
		header: ({ column }) =>
			renderComponent(DataTableColumnHeader<OpenPeriod, unknown>, { column, title: 'Cost' })
	}
];
