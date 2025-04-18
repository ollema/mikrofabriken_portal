<script lang="ts">
	import IconEntry from './icon-entry.svelte';
	import type { Artifact } from '$lib/types/members.js';
	import { isArtifactActive } from '$lib/utils/member.js';
	import Nfc from 'lucide-svelte/icons/nfc';
	import KeyRound from 'lucide-svelte/icons/key-round';

	interface Props {
		artifacts: Artifact[];
	}

	let { artifacts }: Props = $props();

	let activeArtifacts = $derived(artifacts.filter((artifacts) => isArtifactActive(artifacts)));

	let activeRFIDArtifacts = $derived(
		activeArtifacts.filter((artifacts) => artifacts.type === 'rfid')
	);

	let activeKeyArtifacts = $derived(
		activeArtifacts.filter((artifacts) => artifacts.type === 'key')
	);
</script>

<div class="space-y-4">
	{#each activeRFIDArtifacts as activeRFIDArtifact (activeRFIDArtifact)}
		<IconEntry Icon={Nfc}>
			RFID-tagg
			<span class="font-mono">[{activeRFIDArtifact.attributes?.data}]</span>
			sedan {activeRFIDArtifact.startDate}
		</IconEntry>
	{/each}

	{#each activeKeyArtifacts as activeKeyArtifact (activeKeyArtifact)}
		<IconEntry Icon={KeyRound}>
			Nyckel #{activeKeyArtifact.attributes?.number ?? 0} sedan {activeKeyArtifact.startDate}
		</IconEntry>
	{/each}
</div>
