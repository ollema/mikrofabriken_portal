import { http, passthrough } from 'msw';
import { invoiceHandlers } from './invoice-handlers';
import { seedDatabase } from './data';

export const handlers = [
	/**
	 * COG API Claims Interceptor
	 *
	 * Intercepts the COG API claims request to capture the organization number (crNumber)
	 * and seeds the mock invoice database with test data.
	 *
	 * Data persists until server restart.
	 */
	http.get('*/persons/claims/:crNumber', ({ request, params }) => {
		const crNumber = params.crNumber as string;
		console.log(
			`[MSW] COG API /persons/claims/${crNumber} intercepted: ${request.method} ${request.url}`
		);

		try {
			const result = seedDatabase(crNumber);
			if (result.customer && result.invoices.length > 0) {
				console.log(`[MSW] ✅ Successfully seeded invoice data for crNumber: ${crNumber}`);
				console.log(
					`[MSW] 📄 Created ${result.invoices.length} invoices for customer: ${result.customer.Name}`
				);
			} else {
				console.log(`[MSW] ℹ️  Invoice data already exists for crNumber: ${crNumber}`);
			}
		} catch (error) {
			console.error(`[MSW] ❌ Failed to seed invoice data for crNumber: ${crNumber}`, error);
		}

		return passthrough();
	}),

	...invoiceHandlers
];
