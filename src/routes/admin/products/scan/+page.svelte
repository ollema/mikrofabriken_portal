<script lang="ts">
	import * as PageHeader from '$lib/components/page-header/index.js';
	import { BarqodeStream, type DetectedBarcode } from 'barqode';
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';
	import type { Product } from '$lib/types/cog.js';
	import { paintOutline } from '$lib/utils/scan.js';
	import { goto } from '$app/navigation';
	import { toast } from 'svelte-sonner';

	let paused = $state(false);

	let product: Product | null | undefined = $state(undefined);
	let barcode: string | undefined = $state(undefined);

	let loading = $state(true);
	function onCameraOn() {
		loading = false;
	}

	let recentDetections: string[] = $state([]);

	async function track(detections: DetectedBarcode[], ctx: CanvasRenderingContext2D) {
		paintOutline(detections, ctx);

		if (detections.length > 0) {
			recentDetections = [...recentDetections.slice(-5 + 1), detections[0].rawValue];

			const counts = new Map<string, number>();
			recentDetections.forEach((code) => counts.set(code, (counts.get(code) || 0) + 1));
			const [mostFrequent] = [...counts.entries()].sort((a, b) => b[1] - a[1]);

			if (mostFrequent[1] >= 3) {
				barcode = mostFrequent[0];
				recentDetections = [];
				paused = true;

				try {
					const response = await fetch(`/api/cog/products/${barcode}`);
					if (response.ok) {
						product = await response.json();
						if (product) {
							toast.info('Known barcode: Edit existing product');
							await goto(`/admin/products/${product.uuid}/edit`);
						} else {
							toast.info('Unknown barcode: Add new product');
							await goto('/admin/products/new?barcode=' + barcode);
						}
					} else {
						toast.error('Error fetching product data');
					}
				} catch (error) {
					console.error(error);
					toast.error('Error fetching product data');
				} finally {
					product = null;
					barcode = undefined;
				}
			}
		}
	}
</script>

<div class="mx-auto w-full min-w-0">
	<PageHeader.Root>
		<PageHeader.Heading>
			<PageHeader.Title>Scan product</PageHeader.Title>
			<PageHeader.Description>Scan to edit existing or add new products.</PageHeader.Description>
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
</div>
