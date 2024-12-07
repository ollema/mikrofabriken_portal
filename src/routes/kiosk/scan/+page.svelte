<script lang="ts">
	import * as PageHeader from '$lib/components/page-header/index.js';
	import { BarqodeStream, type DetectedBarcode } from 'barqode';
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';
	import PurchaseDialog from '$lib/components/kiosk/purchase-dialog.svelte';
	import type { Product } from '$lib/types/cog.js';
	import { paintOutline } from '$lib/utils/scan.js';

	let open = $state(false);
	let paused = $state(false);

	let product: Product | null | undefined = $state(undefined);
	let barcode: string | undefined = $state(undefined);

	let loading = $state(true);
	function onCameraOn() {
		loading = false;
	}

	const requiredNumberOfConsistentDetections = 5;
	let lastDetectedBarcode = $state('');
	let consistentDetectionCount = $state(0);

	async function track(detections: DetectedBarcode[], ctx: CanvasRenderingContext2D) {
		paintOutline(detections, ctx);

		for (const detection of detections) {
			if (detection.rawValue !== lastDetectedBarcode) {
				lastDetectedBarcode = detection.rawValue;
				consistentDetectionCount = 0;
			} else {
				consistentDetectionCount++;
			}

			if (consistentDetectionCount >= requiredNumberOfConsistentDetections) {
				barcode = detection.rawValue;
				lastDetectedBarcode = '';
				consistentDetectionCount = 0;

				paused = true;
				break;
			} else {
				return;
			}
		}

		try {
			const response = await fetch(`/api/cog/products/${barcode}`);
			if (response.ok) {
				product = await response.json();
			} else {
				product = null;
			}
		} catch (e) {
			console.log(`could not fetch product: ${e}`);
			product = null;
		}

		open = true;
	}

	function onClose() {
		setTimeout(() => {
			paused = false;
		}, 1000);
	}
</script>

<div class="mx-auto w-full min-w-0">
	<PageHeader.Root>
		<PageHeader.Heading>
			<PageHeader.Title>Scan products</PageHeader.Title>
			<PageHeader.Description>Scan and purchase products.</PageHeader.Description>
		</PageHeader.Heading>
	</PageHeader.Root>

	<div class="mx-auto max-w-3xl">
		<div class="aspect-video">
			<BarqodeStream
				constraints={{ facingMode: 'environment' }}
				formats={['ean_8', 'ean_13']}
				{onCameraOn}
				{track}
				bind:paused
			>
				{#if loading}
					<Skeleton class="h-full w-full" />
				{/if}
			</BarqodeStream>
		</div>
	</div>

	<PurchaseDialog {onClose} bind:open bind:product bind:barcode />
</div>
