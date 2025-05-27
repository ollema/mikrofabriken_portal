<script lang="ts">
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<div class="bg-card text-card-foreground flex flex-col gap-4 rounded-xl border p-6 shadow-sm">
	{@render children?.()}
</div>
