<script lang="ts">
	import { cn } from '$lib/utils';

	interface Props {
		class?: string | undefined | null;
		children?: import('svelte').Snippet;
	}

	let { class: className = undefined, children }: Props = $props();
</script>

<p class={cn('w-full text-lg text-muted-foreground', className)}>
	{@render children?.()}
</p>
