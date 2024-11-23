<script lang="ts">
	import * as PageHeader from '$lib/components/page-header/index.js';
	import { Agreements, Pending } from '$lib/components/membership/index.js';

	let { data } = $props();

	let showPending = $state(false);
</script>

<div class="mx-auto w-full min-w-0">
	<PageHeader.Root>
		<PageHeader.Heading>
			<PageHeader.Title>Agreements</PageHeader.Title>
			<PageHeader.Description>Your agreements.</PageHeader.Description>
		</PageHeader.Heading>
	</PageHeader.Root>

	{#await data.pending}
		<Agreements agreements={data.member.agreements} />
	{:then pending}
		{#if pending.member}
			<Pending bind:showPending />
		{/if}
		{@const member = showPending ? (pending.member ?? data.member) : data.member}
		<Agreements agreements={member.agreements} />
	{/await}
</div>
