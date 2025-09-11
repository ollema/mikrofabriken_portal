import type { RequestEvent } from '@sveltejs/kit';
import { handleInvoicePdfRequest } from '$lib/components/invoice/invoice-pdf.js';

export async function GET({ locals, params, url }: RequestEvent) {
	return handleInvoicePdfRequest(locals, params as { documentNumber: string }, url);
}
