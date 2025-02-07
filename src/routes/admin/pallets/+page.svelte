<script lang="ts">
	import * as PageHeader from '$lib/components/page-header/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import { IsMobile } from '$lib/hooks/is-mobile.svelte.js';

	let { data } = $props();
	let isMobile = new IsMobile();
</script>

{#snippet palletTable(pallets: typeof data.pallets)}
	<div class="rounded-md border [&_tr_td]:py-1.5">
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head class="w-4">#</Table.Head>
					<Table.Head>Member</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each pallets as pallet}
					<Table.Row>
						<Table.Cell class="w-4">{pallet.id}</Table.Cell>
						<Table.Cell>
							{#if pallet.member}
								<a href="/admin/members/{pallet.member.slackID}" class="hover:underline">
									{pallet.member.name}
								</a>
							{:else}
								-
							{/if}
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>
{/snippet}

<div class="mx-auto w-full min-w-0">
	<PageHeader.Root>
		<PageHeader.Heading>
			<PageHeader.Title>Pallets</PageHeader.Title>
			<PageHeader.Description>Overview of pallet agreements.</PageHeader.Description>
		</PageHeader.Heading>
	</PageHeader.Root>

	{#if isMobile.current}
		{@render palletTable(data.pallets)}
	{:else}
		<div class="grid grid-cols-2 gap-4">
			<div>
				{@render palletTable(data.leftPallets)}
			</div>
			<div>
				{@render palletTable(data.rightPallets)}
			</div>
		</div>
	{/if}
</div>
