<script lang="ts">
	interface Props {
		label: string;
		value: string | number;
	}

	let { label, value }: Props = $props();
</script>

<div class="flex flex-col">
	<div class="text-muted-foreground text-xs font-medium uppercase">{label}</div>
	<div>{value}</div>
</div>
