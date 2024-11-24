<script lang="ts">
	import Check from 'lucide-svelte/icons/check';
	import X from 'lucide-svelte/icons/x';

	let { value }: { value: string } = $props();
</script>

<div class="flex w-[100px] items-center">
	{#if value === 'true'}
		<Check class="mr-2 size-4 text-green-500" />
	{:else}
		<X class="mr-2 size-4 text-red-500" />
	{/if}
</div>
