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
				'aria-label': 'Select all',
				class: 'translate-y-[2px]'
			}),
		cell: ({ row }) =>
			renderComponent(DataTableCheckbox, {
				checked: row.getIsSelected(),
				onCheckedChange: (value) => row.toggleSelected(!!value),
				'aria-label': 'Select row',
				class: 'translate-y-[2px]'
			}),
		enableHiding: false
	},
	{
		id: 'Name',
		accessorKey: 'name',
		header: ({ column }) =>
			renderComponent(DataTableColumnHeader<ExtendedMember, unknown>, { column, title: 'Name' }),
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
		id: 'Phone',
		accessorKey: 'phone',
		header: 'Phone'
	},
	{
		id: 'Membership',
		accessorKey: 'membership',
		header: 'Membership',
		filterFn: (row, id, value) => {
			return value.includes(row.getValue(id));
		}
	},
	{
		id: 'Member since',
		accessorKey: 'memberSince',
		header: ({ column }) =>
			renderComponent(DataTableColumnHeader<ExtendedMember, unknown>, {
				column,
				title: 'Member since'
			})
	},
	{
		id: 'Investment',
		accessorKey: 'hasInvestment',
		header: 'Investment',
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
		id: 'Asylum (outside)',
		accessorKey: 'hasAsylumOutside',
		header: 'Asylum (outside)',
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
		id: 'Pallet',
		accessorKey: 'hasPallet',
		header: 'Pallet',
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
		id: 'Company',
		accessorKey: 'hasCompany',
		header: 'Company',
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
