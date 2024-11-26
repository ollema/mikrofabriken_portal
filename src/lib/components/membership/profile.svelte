<script lang="ts">
	import { type Member } from '$lib/types/members.js';
	import PersonalInfo from './profile-personal-info.svelte';
	import Company from './company.svelte';
	import Agreements from './agreements.svelte';
	import Artifacts from './artifacts.svelte';
	import Commissions from './commissions.svelte';
	import Pending from './pending.svelte';
	import { isAgreementActive, isArtifactActive, isCommissionActive } from '$lib/helpers.js';

	type PendingMemberUpdate = {
		member: Member | undefined;
		sourceBranch: string | undefined;
	};

	type Props = {
		member: Member;
		pending: PendingMemberUpdate | Promise<PendingMemberUpdate>;
	};

	let { member, pending }: Props = $props();

	let showPending = $state(false);
</script>

{#snippet subtitle(title: string)}
	<div class="mb-4 mt-6 w-full text-2xl font-semibold">{title}</div>
{/snippet}

{@render subtitle('Personal information')}

{#snippet profile(member: Member)}
	<PersonalInfo {member} />

	{#if member.company}
		{@render subtitle('Company information')}
		<Company company={member.company} />
	{/if}

	{#if member.agreements.filter((agreement) => isAgreementActive(agreement)).length > 0}
		{@render subtitle('Agreements')}
		<Agreements agreements={member.agreements} />
	{/if}

	{#if member.artifacts.filter((artifact) => isArtifactActive(artifact)).length > 0}
		{@render subtitle('RFID tags & keys')}
		<Artifacts artifacts={member.artifacts} />
	{/if}

	{#if member.commissions.filter((commission) => isCommissionActive(commission)).length > 0}
		{@render subtitle('Roles')}
		<Commissions commissions={member.commissions} />
	{/if}
{/snippet}

{#await pending}
	{@render profile(member)}
{:then pending}
	{#if pending.member}
		<Pending bind:showPending />
	{/if}
	{@render profile(showPending ? (pending.member ?? member) : member)}
{/await}
