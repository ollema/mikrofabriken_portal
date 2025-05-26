<script lang="ts">
	import * as Form from '$lib/components/ui/form/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';
	import type { Readable } from 'svelte/store';

	type Props = {
		delayed: Readable<boolean>;
		label: string;
		variant?: 'default' | 'destructive';
		separator?: boolean;
	};

	let { delayed, label, variant = 'default', separator = true }: Props = $props();
</script>

{#if separator}
	<Separator class="my-4" />
{/if}

<Form.Button class="w-full" {variant}>
	{#if $delayed}
		<LoaderCircle class="animate-spin" />
		Laddar...
	{:else}
		{label}
	{/if}
</Form.Button>
