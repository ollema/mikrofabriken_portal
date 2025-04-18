<script lang="ts">
	import { type Member } from '$lib/types/members.js';
	import PersonalInfo from './personal-info.svelte';
	import Company from './company.svelte';
	import IceContacts from './ice-contacts.svelte';
	import WorkPools from './work-pools.svelte';
	import Agreements from './agreements.svelte';
	import Artifacts from './artifacts.svelte';
	import Commissions from './commissions.svelte';
	import Pending from './pending.svelte';
	import { isAgreementActive, isArtifactActive, isCommissionActive } from '$lib/utils/member.js';

	type PendingMemberUpdate = {
		member: Member | undefined;
		sourceBranch: string | undefined;
	};

	type Props = {
		member: Member;
		workPoolNameMapping: Record<string, string>;
		pending: PendingMemberUpdate;
	};

	let { member, pending, workPoolNameMapping }: Props = $props();

	let showPending = $state(false);
</script>

{#snippet subtitle(title: string)}
	<div class="mb-4 mt-6 w-full text-xl">{title}</div>
{/snippet}

{#snippet profile(member: Member)}
	<div class="mb-4 w-full text-xl">Personlig information</div>

	<PersonalInfo {member} />

	{#if member.company}
		{@render subtitle('Företagsinformation')}
		<Company company={member.company} />
	{/if}

	{@render subtitle('ICE-kontakter ')}
	<IceContacts iceContacts={member.iceContacts} />

	{@render subtitle('Arbetspooler')}
	<WorkPools workPools={member.workPools} {workPoolNameMapping} />

	{#if member.agreements.filter((agreement) => isAgreementActive(agreement)).length > 0}
		{@render subtitle('Avtal')}
		<Agreements agreements={member.agreements} />
	{/if}

	{#if member.artifacts.filter((artifact) => isArtifactActive(artifact)).length > 0}
		{@render subtitle('RFID taggar & nycklar')}
		<Artifacts artifacts={member.artifacts} />
	{/if}

	{#if member.commissions.filter((commission) => isCommissionActive(commission)).length > 0}
		{@render subtitle('Roller')}
		<Commissions commissions={member.commissions} />
	{/if}
{/snippet}

{#if pending.member}
	<Pending bind:showPending />
{/if}

{@render profile(showPending ? (pending.member ?? member) : member)}
