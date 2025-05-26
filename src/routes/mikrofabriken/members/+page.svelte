<script lang="ts">
	import * as PageHeader from '$lib/components/page-header/index.js';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import MemberInfoDialog from '$lib/components/mikrofabriken/member-info-dialog.svelte';
	import MemberGrid from '$lib/components/mikrofabriken/member-grid.svelte';

	let open = $state(false);

	let { data } = $props();

	let selectedMember: {
		name: string;
		avatar: string;
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
		<PageHeader.Title>Medlemmar</PageHeader.Title>
		<PageHeader.Description>Medlemmar i Mikrofabriken.</PageHeader.Description>
	</PageHeader.Heading>
</PageHeader.Root>

<div class="text-muted-foreground mb-5 text-sm">
	<div class="flex items-center space-x-2">
		<Switch id="on-site-switch" bind:checked={onsiteOnly} />
		<Label for="on-site-switch">Visa bara incheckade medlemmar</Label>
	</div>
</div>

<MemberInfoDialog bind:selectedMember bind:open />

<MemberGrid label={undefined} members={filteredMembers} bind:selectedMember bind:open />
