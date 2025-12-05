<script lang="ts">
	import * as PageHeader from '$lib/components/page-header/index.js';
	import MemberInfoDialog from '$lib/components/mikrofabriken/member-info-dialog.svelte';
	import MemberGrid from '$lib/components/mikrofabriken/member-grid.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import ArrowLeft from '@lucide/svelte/icons/arrow-left';

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
			<PageHeader.Title>{data.omk.label}</PageHeader.Title>
			{#if data.omk.description}
				<PageHeader.Description>{data.omk.description}</PageHeader.Description>
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
		members={data.omk.members}
		bind:selectedMember
		bind:open
	/>
</div>

