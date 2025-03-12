import type { ColumnDef } from '@tanstack/table-core';
import { renderComponent } from '$lib/components/ui/data-table/index.js';
import { DataTableColumnHeader } from '$lib/components/data-table/index.js';
import type { Period } from '$lib/types/cog.js';
import { fromDate, toCalendarDate, toTime } from '@internationalized/date';

export const columns: ColumnDef<Period & { cost: number | null }>[] = [
	{
		id: 'Ruta',
		accessorKey: 'resourceName',
		accessorFn: (row) => {
			return row.resourceName.replace('storageShortTerm/', '').toUpperCase();
		},
		header: ({ column }) =>
			renderComponent(DataTableColumnHeader<Period & { cost: number | null }, unknown>, {
				column,
				title: 'Ruta'
			})
	},
	{
		id: 'Start',
		accessorKey: 'start',
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
		id: 'Slut',
		accessorKey: 'end',
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
				title: 'Slut'
			})
	},
	{
		id: 'Kostnad',
		accessorFn: (row) => (row.cost ? `${row.cost.toFixed(2)} kr` : '-'),
		header: ({ column }) =>
			renderComponent(DataTableColumnHeader<Period & { cost: number | null }, unknown>, {
				column,
				title: 'Kostnad'
			})
	}
];
