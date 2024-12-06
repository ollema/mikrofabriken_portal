<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';
	import type { Readable } from 'svelte/store';

	type Props = {
		delayed: Readable<boolean>;
		label: string;
		variant?: 'default' | 'destructive';
	};

	let { delayed, label, variant = 'default' }: Props = $props();
</script>

<Separator class="my-4" />

<Form.Button class="w-full" {variant}>
	{#if $delayed}
		<LoaderCircle class="animate-spin" />
		Processing...
	{:else}
		{label}
	{/if}
</Form.Button>
