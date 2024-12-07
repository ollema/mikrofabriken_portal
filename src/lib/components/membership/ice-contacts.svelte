<script lang="ts">
	import IconEntry from './icon-entry.svelte';
	import Bandage from 'lucide-svelte/icons/bandage';
	import OctagonAlert from 'lucide-svelte/icons/octagon-alert';
	import type { IceContact } from '$lib/types/members';

	type Props = {
		iceContacts: IceContact[];
	};

	let { iceContacts }: Props = $props();

	function phoneHref(phone: string) {
		return `tel:${phone.replace(/^0/, '+46')}`;
	}
</script>

{#if iceContacts.length > 0}
	{#each iceContacts as contact}
		<IconEntry Icon={Bandage}>
			{contact.name} - <a href={phoneHref(contact.phone)}>{contact.phone}</a>
		</IconEntry>
	{/each}
{:else}
	<IconEntry Icon={OctagonAlert}>
		<div class="text-sm">No ICE contacts. Consider adding one!</div>
	</IconEntry>
{/if}
