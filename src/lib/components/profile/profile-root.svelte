<script lang="ts">
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
	{@render children?.()}
</div>
