<script lang="ts">
	import * as PageHeader from '$lib/components/page-header/index.js';
	import MemberInfoDialog from '$lib/components/mikrofabriken/member-info-dialog.svelte';
	import MemberGrid from '$lib/components/mikrofabriken/member-grid.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import { formatCurrency } from '$lib/components/finance/currency.js';
	import ArrowLeft from '@lucide/svelte/icons/arrow-left';

	let { data } = $props();

	let open = $state(false);

	let selectedMember: {
		name: string;
		avatar: string;
		here: boolean;
		commissions: string[];
	} | null = $state(null);

	function formatDate(dateString: string): string {
		return new Date(dateString).toLocaleDateString('sv-SE');
	}
</script>

<div class="mx-auto w-full min-w-0">
	<PageHeader.Root>
		<PageHeader.Heading>
			<PageHeader.Title>{data.committee.friendlyName}</PageHeader.Title>
			{#if data.committee.description}
				<PageHeader.Description>{data.committee.description}</PageHeader.Description>
			{/if}
		</PageHeader.Heading>
		<PageHeader.Actions>
			<Button href="/mikrofabriken/omks" variant="outline">
				<ArrowLeft class="mr-2 h-4 w-4" />
				Tillbaka till OMKs
			</Button>
		</PageHeader.Actions>
	</PageHeader.Root>

	<MemberInfoDialog bind:selectedMember bind:open />

	<MemberGrid
		label={undefined}
		description={undefined}
		members={data.members}
		bind:selectedMember
		bind:open
	/>

	{#if data.budgetThisYear}
		<div class="mt-8">
			<h2 class="mb-4 text-xl font-semibold">Budget för {data.budgetThisYear.budgetYear}</h2>
			<p>Investeringar: {formatCurrency(data.budgetThisYear.investment)}</p>
			<p>Kostnader: {formatCurrency(data.budgetThisYear.expenditure)}</p>
			<p>Totalt: {formatCurrency(data.budgetThisYear.investment + data.budgetThisYear.expenditure)}</p>
		</div>
	{/if}
</div>

