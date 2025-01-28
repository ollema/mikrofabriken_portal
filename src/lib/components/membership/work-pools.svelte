<script lang="ts">
	type Props = {
		workPools: string[];
		workPoolNameMapping: Record<string, string>;
	};

	let { workPools, workPoolNameMapping }: Props = $props();
</script>

<div class="space-y-2">
	{#each workPools as workPool}
		<div class="text-sm">
			{workPoolNameMapping[workPool]}
		</div>
	{/each}
</div>
