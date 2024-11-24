<script lang="ts">
	import type { Artifact } from '$lib/types/members';
	import { isArtifactActive } from '$lib/helpers';
	import Nfc from 'lucide-svelte/icons/nfc';
	import KeyRound from 'lucide-svelte/icons/key-round';

	interface Props {
		artifacts: Artifact[];
	}

	let { artifacts }: Props = $props();

	let activeArtifacts = $derived(artifacts.filter((artifacts) => isArtifactActive(artifacts)));

	let activeRFIDArtifact = $derived(activeArtifacts.find((artifacts) => artifacts.type === 'rfid'));

	let activeKeyArtifact = $derived(activeArtifacts.find((artifacts) => artifacts.type === 'key'));
</script>

<div class="space-y-4">
	{#if activeRFIDArtifact}
		<div>
			<Nfc class="mr-2 inline" /> Active <span class="font-semibold">RFID tag</span> with RFID data
			<span class="font-mono">{activeRFIDArtifact.attributes?.data}</span> since
			<span class="font-semibold">{activeRFIDArtifact.startDate}</span>.
		</div>
	{/if}

	{#if activeKeyArtifact}
		<div>
			<KeyRound class="mr-2 inline" /> entrusted with
			<span class="font-semibold">
				key #{activeKeyArtifact.attributes?.number ?? 0}
			</span>
			since <span class="font-semibold">{activeKeyArtifact.startDate}</span>.
		</div>
	{/if}
</div>
