<script lang="ts">
	import { cn } from '$lib/utils';

	interface Props {
		class?: string | undefined | null;
		children?: import('svelte').Snippet;
	}

	let { class: className = undefined, children }: Props = $props();
</script>

<h1 class={cn('w-full scroll-m-20 text-4xl font-bold tracking-tight', className)}>
	{@render children?.()}
</h1>
