import type { ColumnDef } from '@tanstack/table-core';
import { renderComponent } from '$lib/components/ui/data-table/index.js';
import { DataTableColumnHeader } from '$lib/components/data-table/index.js';
import type { Period } from '$lib/types/cog.js';
import { fromDate, toCalendarDate, toTime } from '@internationalized/date';

export const columns: ColumnDef<Period & { cost: number | null }>[] = [
	{
		id: 'Resource',
		accessorKey: 'resourceName',
		accessorFn: (row) => {
			return row.resourceName.replace('storageMediumTerm/', '').toUpperCase();
		},
		header: ({ column }) =>
			renderComponent(DataTableColumnHeader<Period & { cost: number | null }, unknown>, {
				column,
				title: 'Resource'
			})
	},
	{
		id: 'Start',
		accessorFn: (row) => {
			const date = fromDate(row.start, 'Europe/Stockholm');
			return toCalendarDate(date) + ' ' + toTime(date).toString().split('.')[0];
		},
		header: ({ column }) =>
			renderComponent(DataTableColumnHeader<Period & { cost: number | null }, unknown>, {
				column,
				title: 'Start'
			})
	},
	{
		id: 'End',
		accessorFn: (row) => {
			if (row.end) {
				const date = fromDate(row.end, 'Europe/Stockholm');
				return toCalendarDate(date) + ' ' + toTime(date).toString().split('.')[0];
			} else {
				return '';
			}
		},
		header: ({ column }) =>
			renderComponent(DataTableColumnHeader<Period & { cost: number | null }, unknown>, {
				column,
				title: 'End'
			})
	},
	{
		id: 'Cost',
		accessorFn: (row) => (row.cost ? `${row.cost.toFixed(2)} kr` : '-'),
		header: ({ column }) =>
			renderComponent(DataTableColumnHeader<Period & { cost: number | null }, unknown>, {
				column,
				title: 'Cost'
			})
	}
];
