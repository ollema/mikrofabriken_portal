import type { BarcodeFormat } from 'barqode';

export function paintOutline(
	detectedCodes: {
		cornerPoints: { x: number; y: number }[];
		boundingBox: DOMRectReadOnly;
		rawValue: string;
		format: BarcodeFormat;
	}[],
	ctx: CanvasRenderingContext2D
) {
	for (const detectedCode of detectedCodes) {
		const [firstPoint, ...otherPoints] = detectedCode.cornerPoints;

		ctx.strokeStyle = 'red';
		ctx.lineWidth = 2;
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
