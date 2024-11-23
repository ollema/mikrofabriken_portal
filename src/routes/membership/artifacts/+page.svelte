<script lang="ts">
	import * as PageHeader from '$lib/components/page-header/index.js';
	import { Button } from '$lib/components/ui/button';
	import { Artifacts, Pending } from '$lib/components/membership/index.js';

	let { data } = $props();

	let showPending = $state(false);
</script>

<div class="mx-auto w-full min-w-0">
	<PageHeader.Root>
		<PageHeader.Heading>
			<PageHeader.Title>Artifacts</PageHeader.Title>
			<PageHeader.Description>Your artifacts.</PageHeader.Description>
		</PageHeader.Heading>
		<PageHeader.Actions>
			<Button variant="outline" href="/membership/artifacts/rfid/edit">Edit RFID code</Button>
		</PageHeader.Actions>
	</PageHeader.Root>

	{#await data.pending}
		<Artifacts artifacts={data.member.artifacts} />
	{:then pending}
		{#if pending.member}
			<Pending bind:showPending />
		{/if}
		{@const member = showPending ? (pending.member ?? data.member) : data.member}
		<Artifacts artifacts={member.artifacts} />
	{/await}
</div>
