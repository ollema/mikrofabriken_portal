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
			<PageHeader.Title>Övriga roller</PageHeader.Title>
			<PageHeader.Description>Övriga roller i Mikrofabriken.</PageHeader.Description>
		</PageHeader.Heading>
	</PageHeader.Root>

	<MemberInfoDialog bind:selectedMember bind:open />

	{#each data.groups as { label, members } (label)}
		<MemberGrid {label} {members} bind:selectedMember bind:open />
	{/each}
</div>
