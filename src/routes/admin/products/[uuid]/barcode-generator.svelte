<script lang="ts">
	import JsBarcode from 'jsbarcode';
	// @ts-expect-error - no types available
	import saveSvgAsPng from 'save-svg-as-png';

	import { onMount } from 'svelte';

	interface Props {
		ean: string;
		name: string;
		details: string | null;
		price: number;
	}

	let { ean, name, details, price }: Props = $props();

	let sticker: SVGElement = $state()!;
	let barcode: SVGElement = $state()!;

	onMount(() => {
		JsBarcode(barcode, ean, {
			format: 'EAN13',
			displayValue: true,
			marginRight: 30
		});
		barcode?.setAttribute('y', '10');
		barcode?.setAttribute('height', '28');
		barcode?.removeAttribute('width');
	});

	async function download() {
		await saveSvgAsPng.saveSvgAsPng(sticker, `${ean}.png`, { scale: 10 });
	}
</script>

<button class="mt-8" onclick={download}>
	<svg
		width="90mm"
		height="38mm"
		viewBox="0 0 90 38"
		xmlns="http://www.w3.org/2000/svg"
		style="background-color: white;"
		bind:this={sticker}
	>
		<text x="45" y="5" font-size="4" text-anchor="middle">{name}</text>
		<text x="45" y="9" font-size="3" text-anchor="middle">
			{price + ' kr'}
			{#if details}
				{' - ' + details}
			{/if}
		</text>
		<svg bind:this={barcode}></svg>
	</svg>
</button>
