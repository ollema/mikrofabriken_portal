<script lang="ts">
	import type { Artifact } from '$lib/types/members';
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
	{#each activeRFIDArtifacts as activeRFIDArtifact}
		<div class="text-sm">
			<Nfc class="mr-1 inline" /> RFID tag
			<span class="font-mono">[{activeRFIDArtifact.attributes?.data}]</span>
			since {activeRFIDArtifact.startDate}
		</div>
	{/each}

	{#each activeKeyArtifacts as activeKeyArtifact}
		<div class="text-sm">
			<KeyRound class="mr-1 inline" /> Entrusted with key #{activeKeyArtifact.attributes?.number ??
				0} since {activeKeyArtifact.startDate}
		</div>
	{/each}
</div>
