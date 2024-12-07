<script lang="ts">
	import { cn } from '$lib/utils.js';

	interface Props {
		class?: string | undefined | null;
		children?: import('svelte').Snippet;
	}

	let { class: className = undefined, children }: Props = $props();
</script>

<section class={cn('mb-4 flex items-end gap-2', className)}>
	{@render children?.()}
</section>
