<script lang="ts">
	import ProfileItem from './profile-item.svelte';
	import IconEntry from './icon-entry.svelte';
	import Heart from 'lucide-svelte/icons/heart';
	import OctagonAlert from 'lucide-svelte/icons/octagon-alert';
	import type { Member } from '$lib/types/members';

	interface Props {
		member: Member;
	}

	let { member }: Props = $props();

	function getMemberSince(member: Member) {
		for (const agreement of member.agreements) {
			if (agreement.type === 'membership') {
				return new Date(agreement.startDate).toLocaleDateString('sv-SE');
			}
		}
		return '-';
	}
</script>

{#snippet subtitle(title: string)}
	<div class="mb-4 mt-6 w-full text-xl font-semibold">{title}</div>
{/snippet}

<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
	<div class="flex flex-col gap-4 rounded-xl border bg-card p-6 text-card-foreground shadow">
		<ProfileItem label="Name" value={member.name} />
		<ProfileItem label="PIN" value={member.crNumber} />
		<ProfileItem label="Member since" value={getMemberSince(member)} />
	</div>
	<div class="flex flex-col gap-4 rounded-xl border bg-card p-6 text-card-foreground shadow">
		<ProfileItem label="Email" value={member.email} />
		<ProfileItem label="Slack Email" value={member.slackEmail} />
		<ProfileItem label="Phone" value={member.phone} />
	</div>
	<div class="flex flex-col gap-4 rounded-xl border bg-card p-6 text-card-foreground shadow">
		<ProfileItem label="Address" value={member.postalAdress} />
		<ProfileItem label="Postal code" value={member.postalCode} />
		<ProfileItem label="City" value={member.postalCity} />
	</div>
</div>

{@render subtitle('ICE contacts')}
{#if member.iceContacts.length > 0}
	{#each member.iceContacts as contact}
		<IconEntry Icon={Heart}>
			{contact.name} - {contact.phone}
		</IconEntry>
	{/each}
{:else}
	<IconEntry Icon={OctagonAlert}>
		<div class="text-sm">No ICE contacts. Consider adding one!</div>
	</IconEntry>
{/if}
