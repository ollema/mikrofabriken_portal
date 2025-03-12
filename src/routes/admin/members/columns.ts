import type { ColumnDef } from '@tanstack/table-core';
import type { ExtendedMember } from '$lib/types/members.js';
import { createRawSnippet } from 'svelte';
import { renderComponent, renderSnippet } from '$lib/components/ui/data-table/index.js';
import {
	DataTableCheckbox,
	DataTableColumnHeader,
	DataTableBooleanCell
} from '$lib/components/data-table/index.js';
import DataTableRowActions from './data-table-row-actions.svelte';

export const columns: ColumnDef<ExtendedMember>[] = [
	{
		id: 'select',
		header: ({ table }) =>
			renderComponent(DataTableCheckbox, {
				checked: table.getIsAllPageRowsSelected(),
				onCheckedChange: (value) => table.toggleAllRowsSelected(!!value),
				'aria-label': 'Välj alla rader',
				class: 'translate-y-[2px]'
			}),
		cell: ({ row }) =>
			renderComponent(DataTableCheckbox, {
				checked: row.getIsSelected(),
				onCheckedChange: (value) => row.toggleSelected(!!value),
				'aria-label': 'Völj den här raden',
				class: 'translate-y-[2px]'
			}),
		enableHiding: false
	},
	{
		id: 'Namn',
		accessorKey: 'name',
		header: ({ column }) =>
			renderComponent(DataTableColumnHeader<ExtendedMember, unknown>, { column, title: 'Namn' }),
		cell: ({ row }) => {
			const name = row.original.name;
			const slackID = row.original.slackID;
			const href = '/admin/members/' + slackID;

			const nameCellSnippet = createRawSnippet<[string]>(() => {
				return {
					render: () => `<a class="hover:underline" href=${href}>${name}</div>`
				};
			});

			return renderSnippet(nameCellSnippet, href);
		},
		enableHiding: false
	},
	{
		id: 'Slack ID',
		accessorKey: 'slackID',
		header: 'Slack ID'
	},
	{
		id: 'Email',
		accessorKey: 'email',
		header: 'Email'
	},
	{
		id: 'Telefonnummer',
		accessorKey: 'phone',
		header: 'Telefonnummer'
	},
	{
		id: 'Medlemskap',
		accessorKey: 'membership',
		header: 'Medlemskap',
		cell: ({ row }) => {
			const membership = row.original.membership;
			if (membership === 'active') {
				return 'Aktivt';
			} else if (membership === 'passive') {
				return 'Vilande';
			} else {
				return 'Inget';
			}
		},
		filterFn: (row, id, value) => {
			return value.includes(row.getValue(id));
		}
	},
	{
		id: 'Medlem sedan',
		accessorKey: 'memberSince',
		header: ({ column }) =>
			renderComponent(DataTableColumnHeader<ExtendedMember, unknown>, {
				column,
				title: 'Medlem sedan'
			})
	},
	{
		id: 'Investering',
		accessorKey: 'hasInvestment',
		header: 'Investering',
		cell: ({ row }) => {
			return renderComponent(DataTableBooleanCell, {
				value: row.original.hasInvestment
			});
		},
		filterFn: (row, id, value) => {
			return value.includes(row.getValue(id));
		}
	},
	{
		id: 'Asylum',
		accessorKey: 'hasAsylumInside',
		header: 'Asylum',
		cell: ({ row }) => {
			return renderComponent(DataTableBooleanCell, {
				value: row.original.hasAsylumInside
			});
		},
		filterFn: (row, id, value) => {
			return value.includes(row.getValue(id));
		}
	},
	{
		id: 'Asylum (ute)',
		accessorKey: 'hasAsylumOutside',
		header: 'Asylum (ute)',
		cell: ({ row }) => {
			return renderComponent(DataTableBooleanCell, {
				value: row.original.hasAsylumOutside
			});
		},
		filterFn: (row, id, value) => {
			return value.includes(row.getValue(id));
		}
	},
	{
		id: 'Pallplats',
		accessorKey: 'hasPallet',
		header: 'Pallplats',
		cell: ({ row }) => {
			return renderComponent(DataTableBooleanCell, {
				value: row.original.hasPallet
			});
		},
		filterFn: (row, id, value) => {
			return value.includes(row.getValue(id));
		}
	},
	{
		id: 'Företag',
		accessorKey: 'hasCompany',
		header: 'Företag',
		cell: ({ row }) => {
			return renderComponent(DataTableBooleanCell, {
				value: row.original.hasCompany
			});
		},
		filterFn: (row, id, value) => {
			return value.includes(row.getValue(id));
		}
	},
	{
		id: 'actions',
		cell: ({ row }) => renderComponent(DataTableRowActions, { row })
	}
];
