<script lang="ts">
	import { cn } from '$lib/utils.js';

	interface Props {
		class?: string | undefined | null;
		children?: import('svelte').Snippet;
	}

	let { class: className = undefined, children }: Props = $props();
</script>

<div class={cn('flex flex-col items-start gap-2', className)}>
	{@render children?.()}
</div>
