<script lang="ts">
	import { cn } from '$lib/utils.js';

	interface Props {
		class?: string | undefined | null;
		children?: import('svelte').Snippet;
	}

	let { class: className = undefined, children }: Props = $props();
</script>

<h1 class={cn('w-full text-3xl font-bold', className)}>
	{@render children?.()}
</h1>
