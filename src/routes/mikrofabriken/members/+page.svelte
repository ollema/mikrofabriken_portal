<script lang="ts">
	import * as PageHeader from '$lib/components/page-header/index.js';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import MemberInfoDialog from '$lib/components/mikrofabriken/MemberInfoDialog.svelte';
	import MemberGrid from '$lib/components/mikrofabriken/MemberGrid.svelte';

	let open = $state(false);

	let { data } = $props();

	let selectedMember: {
		name: string;
		avatar: Promise<string | undefined>;
		here: boolean;
		commissions: string[];
	} | null = $state(null);

	let onsiteOnly = $state(false);

	let filteredMembers = $derived(
		onsiteOnly ? data.members.filter((member) => member.here) : data.members
	);
</script>

<PageHeader.Root>
	<PageHeader.Heading>
		<PageHeader.Title>Members</PageHeader.Title>
		<PageHeader.Description>Members of Mikrofabriken.</PageHeader.Description>
	</PageHeader.Heading>
</PageHeader.Root>

<div class="mb-5 text-sm text-muted-foreground">
	<div class="flex items-center space-x-2">
		<Switch id="on-site-switch" bind:checked={onsiteOnly} />
		<Label for="on-site-switch">Show on-site members only.</Label>
	</div>
</div>

<MemberInfoDialog bind:selectedMember bind:open />

<MemberGrid label={undefined} members={filteredMembers} bind:selectedMember bind:open />
