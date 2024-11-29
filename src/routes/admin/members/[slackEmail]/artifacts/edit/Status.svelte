<script lang="ts">
	type Props = {
		endDate: string | undefined;
	};

	let { endDate }: Props = $props();
</script>

<div class="mb-4">
	Status:
	{#if endDate}
		<span class="text-neutral-500">Inactive</span>
	{:else}
		<span class="text-green-500">Active</span>
	{/if}
</div>
