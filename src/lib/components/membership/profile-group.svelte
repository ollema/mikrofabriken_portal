<script lang="ts">
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<div class="flex flex-col gap-4 rounded-xl border bg-card p-6 text-card-foreground shadow">
	{@render children?.()}
</div>
