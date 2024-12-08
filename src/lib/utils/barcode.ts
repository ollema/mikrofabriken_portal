// @ts-expect-error - no @types package available
import validbarcode from 'barcode-validator';

function calculateChecksum(digits: string): number {
	if (digits.length !== 12) {
		throw new Error(
			`barcode must be a string of 12 digits. got: ${digits} which has length ${digits.length}`
		);
	}

	if (!/^\d+$/.test(digits)) {
		throw new Error(
			`barcode must be a string of 12 digits. got: ${digits} which contains non-digit characters`
		);
	}

	// calculate the sum of the digits with the specific weights
	let sum = 0;
	for (let i = 0; i < 12; i++) {
		const digit = parseInt(digits.charAt(i), 10);
		if (i % 2 === 0) {
			sum += digit * 1; // multiply by 1 if the position is even
		} else {
			sum += digit * 3; // multiply by 3 if the position is odd
		}
	}

	// calculate the checksum digit
	const checksum = (10 - (sum % 10)) % 10;

	return checksum;
}

export function generateEAN13(): string {
	const prefix = '20';
	const digits =
		prefix +
		Math.floor(Math.random() * 1e10)
			.toString()
			.padStart(10, '0');

	const checksum = calculateChecksum(digits);
	const ean13 = digits + checksum;

	if (!validbarcode(ean13)) {
		throw new Error(`could not generate valid EAN13, invalid checksum: ${ean13}`);
	}

	return ean13;
}
