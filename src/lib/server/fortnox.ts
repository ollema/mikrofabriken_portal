import type { Member } from '$lib/types/members.js';
import { error } from '@sveltejs/kit';
import {
	CustomersResponseSchema,
	InvoiceResponseSchema,
	InvoicesResponseSchema
} from '$lib/schemas/fortnox.js';

import { env } from '$env/dynamic/private';

/**
 * The base URL for the Fortnox API.
 */
const BASE_URL = 'https://fnp.mikrofabriken.se/proxy/3';

/**
 * Sends a GET request to the Fortnox API with the specified path and returns the response as JSON.
 * @param path - The path to send the GET request to.
 * @returns A Promise that resolves to the JSON response from the Fortnox API.
 */
const get = async (path: string) => {
	const headers = {
		Accept: 'application/json',
		'Content-Type': 'application/json',
		'Authorization': env.FNP_KEY as string,
	};

	const response = await fetch(`${BASE_URL}${path}`, {
		method: 'GET',
		headers
	});
	return await response.json();
};

/**
 * Retrieves all customers from the Fortnox API.
 * @returns A promise that resolves to an array of Customer objects.
 */
const getCustomers = async () => {
	let page = 1;
	let data = await get(`/customers?page=${page}`);
	let validatedData = CustomersResponseSchema.parse(data);

	let allCustomers = [...validatedData.Customers];

	while (
		validatedData.MetaInformation['@CurrentPage'] < validatedData.MetaInformation['@TotalPages']
	) {
		page += 1;
		data = await get(`/customers?page=${page}`);
		validatedData = CustomersResponseSchema.parse(data);
		allCustomers = [...allCustomers, ...validatedData.Customers];
	}

	return allCustomers;
};

/**
 * Retrieves all invoices for a given customer number.
 * @param customerNumber The customer number to retrieve invoices for.
 * @returns An array of invoices for the given customer, sorted by invoice date in descending order.
 */
export const getInvoicesForCustomer = async (customerNumber: string) => {
	const sortBy = 'invoicedate';
	let page = 1;
	let queryParams = `?page=${page}&customernumber=${customerNumber}&sortby=${sortBy}`;

	let data = await get(`/invoices${queryParams}`);
	let validatedData = InvoicesResponseSchema.parse(data);

	let allInvoices = [...validatedData.Invoices];

	while (
		validatedData.MetaInformation['@CurrentPage'] < validatedData.MetaInformation['@TotalPages']
	) {
		page += 1;
		queryParams = `?page=${page}&customernumber=${customerNumber}&sortby=${sortBy}`;
		data = await get(`/invoices${queryParams}`);
		validatedData = InvoicesResponseSchema.parse(data);
		allInvoices = [...allInvoices, ...validatedData.Invoices];
	}

	// filter out any invoices that are cancelled
	const filteredInvoices = allInvoices.filter((invoice) => !invoice.Cancelled).reverse();

	return filteredInvoices;
};

/**
 * Retrieves invoices for a member from Fortnox API.
 * @param member - The member for whom to retrieve invoices.
 * @returns An object containing personal and company invoices, if any.
 * @throws An error with status code 404 if no invoices are found for the member.
 */
export const getInvoices = async (member: Member) => {
	const customers = await getCustomers();

	const personalCustomer = customers.find(
		(customer) => customer.OrganisationNumber === member.crNumber
	);
	const personalInvoices = personalCustomer
		? await getInvoicesForCustomer(personalCustomer.CustomerNumber)
		: null;

	const companyCustomer = customers.find(
		(customer) => customer.OrganisationNumber === member.company?.orgNum
	);
	const companyInvoices = companyCustomer
		? await getInvoicesForCustomer(companyCustomer.CustomerNumber)
		: null;

	if (!personalInvoices && !companyInvoices) {
		error(
			404,
			`No invoices found for member with ${member.crNumber}. Post in #it-system if you think that this is an error.`
		);
	}

	return {
		personal: personalInvoices,
		company: companyInvoices
	};
};

/**
 * Retrieves an invoice by its document number and checks if the requesting member is allowed to view it.
 * @param documentNumber - The document number of the invoice to retrieve.
 * @param requestedBy - The member who is requesting to view the invoice.
 * @param requestedByRole - The role of the member who is requesting to view the invoice.
 * @returns The invoice object if the requesting member is allowed to view it.
 * @throws An error with status code 403 if the requesting member is not allowed to view the invoice.
 */
export const getInvoice = async (
	documentNumber: string,
	requestedBy: Member,
	requestedByRole: 'admin' | 'user'
) => {
	const data = await get(`/invoices/${documentNumber}`);
	const validatedData = InvoiceResponseSchema.parse(data);
	const invoice = validatedData.Invoice;

	const personalInvoiceBelongsToMember = invoice.OrganisationNumber === requestedBy.crNumber;
	const companyInvoiceBelongsToMember = invoice.OrganisationNumber === requestedBy.company?.orgNum;
	const invoiceBelongsToMember = personalInvoiceBelongsToMember || companyInvoiceBelongsToMember;

	const allowedToViewInvoice = invoiceBelongsToMember || requestedByRole === 'admin';

	if (!allowedToViewInvoice) {
		error(403, 'You are not allowed to view this invoice');
	}

	return invoice;
};

/**
 * Downloads the PDF version of the invoice with the specified document number from Fortnox API.
 * @param documentNumber The document number of the invoice to download.
 * @returns A Promise that resolves with a Blob containing the PDF data.
 */
export const downloadInvoicePdf = async (documentNumber: string) => {
	const headers = {
		Accept: 'application/json',
		'Content-Type': 'application/json',
		'Access-Token': env.FORTNOX_ACCESS_TOKEN as string,
		'Client-Secret': env.FORTNOX_CLIENT_SECRET as string
	};

	const response = await fetch(`${BASE_URL}/invoices/${documentNumber}/print`, {
		method: 'GET',
		headers
	});
	return response.blob();
};
