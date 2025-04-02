<script lang="ts">
	import * as PageHeader from '$lib/components/page-header/index.js';
	import MemberInfoDialog from '$lib/components/mikrofabriken/member-info-dialog.svelte';
	import MemberGrid from '$lib/components/mikrofabriken/member-grid.svelte';

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
			<PageHeader.Title>Board</PageHeader.Title>
			<PageHeader.Description>Board of Mikrofabriken.</PageHeader.Description>
		</PageHeader.Heading>
	</PageHeader.Root>

	<MemberInfoDialog bind:selectedMember bind:open />

	{#each data.board as { label, members } (label)}
		{#if members.length > 0}
			<MemberGrid {label} {members} bind:selectedMember bind:open />
		{/if}
	{/each}
</div>
