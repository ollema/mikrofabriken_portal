<script lang="ts">
	import * as PageHeader from '$lib/components/page-header/index.js';
	import MemberInfoDialog from '$lib/components/mikrofabriken/member-info-dialog.svelte';
	import MemberGrid from '$lib/components/mikrofabriken/member-grid.svelte';
	import { formatCurrency } from '$lib/components/finance/currency.js';

	let { data } = $props();

	let open = $state(false);

	let selectedMember: {
		name: string;
		avatar: string;
		here: boolean;
		commissions: string[];
	} | null = $state(null);
</script>

<div class="mx-auto w-full min-w-0">
	<PageHeader.Root>
		<PageHeader.Heading>
			<PageHeader.Title>{data.committee.friendlyName}</PageHeader.Title>
			{#if data.committee.description}
				<PageHeader.Description>{data.committee.description}</PageHeader.Description>
			{/if}
		</PageHeader.Heading>
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
			<p>Investeringsbudget: {formatCurrency(data.budgetThisYear.investment)}</p>
			<p>Förbrukningsbudget: {formatCurrency(data.budgetThisYear.expenditure)}</p>
		</div>
	{/if}

	{#if data.netResultThisYear !== null}
		<div class="mt-8">
			<h2 class="mb-4 text-xl font-semibold">Resultat för {new Date().getFullYear()}</h2>
			<p>Förbrukning: {formatCurrency(data.netResultThisYear)}</p>
			{#if data.budgetLeftThisYear !== null}
				<p>
					Förbrukningsbudget kvar: <span
						class={data.budgetLeftThisYear < 0 ? 'text-red-600' : 'text-green-600'}
						>{formatCurrency(data.budgetLeftThisYear)}</span
					>
				</p>
			{/if}
		</div>
	{/if}
</div>
