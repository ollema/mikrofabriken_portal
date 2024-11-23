<script lang="ts">
	import { blur } from 'svelte/transition';

	interface Props {
		label: string;
		value: string | number | boolean | string[];
	}

	let { label, value = $bindable() }: Props = $props();

	function formatValue(value: string | number | boolean | string[]) {
		if (Array.isArray(value)) {
			if (value.length === 0) {
				return '-';
			}

			return value.join(', ');
		}

		if (typeof value === 'boolean') {
			return value ? 'yes' : 'no';
		}

		if (value === 'personal') {
			return 'Personal';
		}

		if (value === 'company') {
			return 'Company';
		}

		return value;
	}

	let formattedValue = $derived(formatValue(value));
</script>

<div class="flex flex-col">
	<div class="text-xs font-medium uppercase text-muted-foreground">{label}</div>
	<div class="grid h-6">
		{#key formattedValue}
			<div
				in:blur={{ duration: 300 }}
				out:blur={{ duration: 300 }}
				class="col-start-1 col-end-2 row-start-1 row-end-2"
			>
				{formattedValue}
			</div>
		{/key}
	</div>
</div>
