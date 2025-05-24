import { http, HttpResponse } from 'msw';
import { db } from './data';
import { BASE_URL } from '$lib/server/fortnox';
import type {
	CustomersResponseSchema,
	InvoiceResponseSchema,
	InvoicesResponseSchema
} from '$lib/schemas/fortnox';
import type { z } from 'zod';

type CustomersResponse = z.infer<typeof CustomersResponseSchema>;
type InvoiceResponse = z.infer<typeof InvoiceResponseSchema>;
type InvoicesResponse = z.infer<typeof InvoicesResponseSchema>;

const logProbablyCrMissingError = (context: string) => {
	console.warn(`[MSW] ⚠️  No ${context} found`);
	console.warn(`[MSW] 💡 This likely means the server was restarted and mock data was lost.`);
	console.warn(
		`[MSW] 🔄 To fix this: Clear your session cookies and log in again to reseed mock data.`
	);
};

const createEmptyResponse = (page: number = 1) => {
	const { metaInformation } = paginate([], page);
	return {
		MetaInformation: metaInformation,
		Invoices: []
	};
};

const paginate = <T>(items: T[], page: number, pageSize: number = 100) => {
	const totalResources = items.length;
	const totalPages = Math.ceil(totalResources / pageSize);
	const startIndex = (page - 1) * pageSize;
	const endIndex = startIndex + pageSize;
	const paginatedItems = items.slice(startIndex, endIndex);

	return {
		items: paginatedItems,
		metaInformation: {
			'@TotalResources': totalResources,
			'@TotalPages': totalPages,
			'@CurrentPage': page
		}
	};
};

export const invoiceHandlers = [
	http.get(`${BASE_URL}/customers`, ({ request }) => {
		const url = new URL(request.url);
		const page = parseInt(url.searchParams.get('page') || '1');

		console.log(`[MSW] Fortnox customers endpoint called - page: ${page}`);

		const allCustomers = db.customer.findMany({});

		if (allCustomers.length === 0) {
			logProbablyCrMissingError('customers');
		}

		const { items: customers, metaInformation } = paginate(allCustomers, page);

		return HttpResponse.json<CustomersResponse>({
			MetaInformation: metaInformation,
			Customers: customers
		});
	}),

	http.get(`${BASE_URL}/invoices`, ({ request }) => {
		const url = new URL(request.url);
		const page = parseInt(url.searchParams.get('page') || '1');
		const customerNumber = url.searchParams.get('customernumber');
		const sortBy = url.searchParams.get('sortby');

		console.log(
			`[MSW] Fortnox invoices endpoint called - page: ${page}, customerNumber: ${customerNumber}, sortBy: ${sortBy}`
		);

		if (!customerNumber) {
			return HttpResponse.json(createEmptyResponse(page));
		}

		const customer = db.customer.findFirst({
			where: { CustomerNumber: { equals: customerNumber } }
		});

		if (!customer) {
			logProbablyCrMissingError(`customer: ${customerNumber}`);
			return HttpResponse.json(createEmptyResponse(page));
		}

		const invoices = db.invoice.findMany({
			where: { CustomerNumber: { equals: customerNumber } }
		});

		if (sortBy === 'invoicedate') {
			invoices.sort(
				(a, b) =>
					new Date(a.InvoiceDate as string).getTime() - new Date(b.InvoiceDate as string).getTime()
			);
		}

		const { items: paginatedInvoices, metaInformation } = paginate(invoices, page);

		return HttpResponse.json<InvoicesResponse>({
			MetaInformation: metaInformation,
			Invoices: paginatedInvoices
		});
	}),

	http.get(`${BASE_URL}/invoices/:documentNumber`, ({ params }) => {
		const documentNumber = params.documentNumber as string;
		console.log(`[MSW] Fortnox invoice detail endpoint called for document: ${documentNumber}`);

		const detail = db.invoiceDetail.findFirst({
			where: { DocumentNumber: { equals: documentNumber } }
		});

		const invoiceRows = db.invoiceRow.findMany({
			where: { DocumentNumber: { equals: documentNumber } }
		});

		const customer = db.customer.findFirst({
			where: { CustomerNumber: { equals: detail?.CustomerNumber } }
		});

		if (!detail || !customer || !invoiceRows) {
			logProbablyCrMissingError(`invoice: ${documentNumber}`);
			return HttpResponse.json({ Invoice: {} });
		}

		const invoiceWithRows = {
			...detail,
			InvoiceRows: invoiceRows || [],
			EmailInformation: { EmailAddressTo: customer.Email },
			OrganisationNumber: customer.OrganisationNumber
		};

		return HttpResponse.json<InvoiceResponse>({ Invoice: invoiceWithRows });
	}),

	http.get(`${BASE_URL}/invoices/:documentNumber/print`, async ({ params }) => {
		const documentNumber = params.documentNumber as string;
		console.log(`[MSW] Fortnox invoice PDF endpoint called for document: ${documentNumber}`);

		const pdfContent = `PDF content for Invoice ${documentNumber}`;
		const blob = new Blob([pdfContent], { type: 'application/pdf' });

		return HttpResponse.arrayBuffer(await blob.arrayBuffer());
	})
];
