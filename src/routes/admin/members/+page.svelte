<script lang="ts">
	import * as PageHeader from '$lib/components/page-header';
	import { ssp, queryParameters } from 'sveltekit-search-params';
	import type {
		ColumnFiltersState,
		SortingState,
		PaginationState,
		VisibilityState
	} from '@tanstack/table-core';
	import { DataTable } from '$lib/components/data-table/index.js';
	import { columns } from './columns.js';

	const params = queryParameters(
		{
			columnFilters: ssp.object<ColumnFiltersState>([
				{ id: 'membership', value: ['active', 'passive'] }
			]),
			sorting: ssp.object<SortingState>([{ id: 'memberSince', desc: false }]),
			pagination: ssp.object<PaginationState>({
				pageIndex: 1,
				pageSize: 10
			}),
			visibility: ssp.object<VisibilityState>({
				email: false,
				slackEmail: false,
				phone: false,
				memberSince: false
			})
		},
		{
			debounceHistory: 500,
			showDefaults: false
		}
	);

	let { data } = $props();
</script>

<div class="mx-auto w-full min-w-0">
	<PageHeader.Root>
		<PageHeader.Heading>
			<PageHeader.Title>Members</PageHeader.Title>
			<PageHeader.Description>Manage members of Mikrofabriken.</PageHeader.Description>
		</PageHeader.Heading>
	</PageHeader.Root>

	<DataTable data={data.members} {columns} {params} />
</div>
