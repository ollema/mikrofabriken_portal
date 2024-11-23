<script lang="ts">
	import * as PageHeader from '$lib/components/page-header';
	import MemberInfoDialog from '$lib/components/member-info/MemberInfoDialog.svelte';
	import MemberGrid from '$lib/components/member-info/MemberGrid.svelte';

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
			<PageHeader.Title>OMKs</PageHeader.Title>
			<PageHeader.Description>Områdeskommittéer (OMKs).</PageHeader.Description>
		</PageHeader.Heading>
	</PageHeader.Root>

	<MemberInfoDialog bind:selectedMember bind:open />

	{#each data.omks as { label, members }}
		<MemberGrid {label} {members} bind:selectedMember bind:open />
	{/each}
</div>
