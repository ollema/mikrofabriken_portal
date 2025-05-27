<script lang="ts">
	import { cn } from '$lib/utils.js';

	interface Props {
		class?: string | undefined | null;
		children?: import('svelte').Snippet;
	}

	let { class: className = undefined, children }: Props = $props();
</script>

<p class={cn('text-muted-foreground w-full text-lg', className)}>
	{@render children?.()}
</p>
