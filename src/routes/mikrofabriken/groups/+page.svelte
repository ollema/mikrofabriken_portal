<script lang="ts">
	import * as PageHeader from '$lib/components/page-header/index.js';
	import MemberInfoDialog from '$lib/components/mikrofabriken/member-info-dialog.svelte';
	import MemberGrid from '$lib/components/mikrofabriken/member-grid.svelte';

	let { data } = $props();

	let open = $state(false);

	let selectedMember: {
		name: string;
		avatar: Promise<string | undefined>;
		here: boolean;
		commissions: string[];
	} | null = $state(null);
</script>

<div class="mx-auto w-full min-w-0">
	<PageHeader.Root>
		<PageHeader.Heading>
			<PageHeader.Title>Other groups</PageHeader.Title>
			<PageHeader.Description>Other groups at Mikrofabriken.</PageHeader.Description>
		</PageHeader.Heading>
	</PageHeader.Root>

	<MemberInfoDialog bind:selectedMember bind:open />

	{#each data.groups as { label, members }}
		<MemberGrid {label} {members} bind:selectedMember bind:open />
	{/each}
</div>
