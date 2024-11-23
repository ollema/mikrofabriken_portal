<script lang="ts">
	import type { Artifact } from '$lib/types/members';
	import { isArtifactActive } from '$lib/helpers';

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
			You have an active <span class="font-semibold">RFID tag</span> with RFID data
			<span class="font-mono">{activeRFIDArtifact.attributes?.data}</span> and code hash
			<span class="font-mono">{activeRFIDArtifact.attributes?.codeHash}</span>
			since
			<span class="font-semibold">{activeRFIDArtifact.startDate}</span>.
		</div>
	{/if}

	{#if activeKeyArtifact}
		<div>
			You have been entrusted with <span class="font-semibold">
				key #{activeKeyArtifact.attributes?.number ?? 0}
			</span>
			since <span class="font-semibold">{activeKeyArtifact.startDate}</span>.
		</div>
	{/if}
</div>
