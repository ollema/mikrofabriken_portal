<script lang="ts">
	import IconEntry from './icon-entry.svelte';
	import Hospital from 'lucide-svelte/icons/hospital';
	import OctagonAlert from 'lucide-svelte/icons/octagon-alert';
	import type { IceContact } from '$lib/types/members';

	type Props = {
		iceContacts: IceContact[];
	};

	let { iceContacts }: Props = $props();
</script>

{#if iceContacts.length > 0}
	{#each iceContacts as contact}
		<IconEntry Icon={Hospital}>
			{contact.name} - {contact.phone}
		</IconEntry>
	{/each}
{:else}
	<IconEntry Icon={OctagonAlert}>
		<div class="text-sm">No ICE contacts. Consider adding one!</div>
	</IconEntry>
{/if}
