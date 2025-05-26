<script lang="ts">
	import type { Icon as IconType } from '@lucide/svelte';
	import type { ComponentType, Snippet } from 'svelte';

	type Props = {
		Icon?: ComponentType<IconType>;
		children?: Snippet;
	};

	let { Icon, children }: Props = $props();
</script>

<div class="flex items-center gap-2 text-sm">
	{#if Icon}
		<Icon class="h-6 w-6" />
	{/if}
	<div>
		{@render children?.()}
	</div>
</div>
