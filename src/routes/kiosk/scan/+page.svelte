<script lang="ts">
	import * as PageHeader from '$lib/components/page-header/index.js';
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';
	import PurchaseDialog from '$lib/components/kiosk/purchase-dialog.svelte';
	import type { Product } from '$lib/types/cog.js';

	import { BarqodeStream, type DetectedBarcode, type BarcodeFormat } from 'barqode';

	let open: boolean = $state(false);
	let product: Product | null | undefined = $state(undefined);
	let barcode: string | undefined = $state(undefined);
	let processing = $state(false);

	let loading = $state(true);

	function onCameraOn() {
		loading = false;
	}

	const requiredNumberOfConsistentDetections = 5;
	let lastDetectedBarcode = $state('');
	let consistentDetectionCount = $state(0);

	async function track(detections: DetectedBarcode[], ctx: CanvasRenderingContext2D) {
		paintOutline(detections, ctx);

		if (processing) return;

		for (const detection of detections) {
			const detectedBarcode = detection.rawValue;

			if (detectedBarcode !== lastDetectedBarcode) {
				lastDetectedBarcode = detectedBarcode;
				consistentDetectionCount = 0;
			} else {
				consistentDetectionCount++;
			}

			if (consistentDetectionCount >= requiredNumberOfConsistentDetections) {
				barcode = detectedBarcode;
				lastDetectedBarcode = '';
				consistentDetectionCount = 0;
				break;
			} else {
				return;
			}
		}

		processing = true;

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

	function paintOutline(
		detectedCodes: {
			cornerPoints: { x: number; y: number }[];
			boundingBox: DOMRectReadOnly;
			rawValue: string;
			format: Exclude<BarcodeFormat, 'linear_codes' | 'matrix_codes'>;
		}[],
		ctx: CanvasRenderingContext2D
	) {
		for (const detectedCode of detectedCodes) {
			const [firstPoint, ...otherPoints] = detectedCode.cornerPoints;

			ctx.strokeStyle = 'red';
			ctx.beginPath();
			ctx.moveTo(firstPoint.x, firstPoint.y);

			for (const { x, y } of otherPoints) {
				ctx.lineTo(x, y);
			}

			ctx.lineTo(firstPoint.x, firstPoint.y);
			ctx.closePath();
			ctx.stroke();
		}
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
			>
				{#if loading}
					<Skeleton class="h-full w-full" />
				{/if}
			</BarqodeStream>
		</div>
	</div>

	<PurchaseDialog bind:open bind:product bind:barcode bind:processing />
</div>
