import { error } from '@sveltejs/kit';
import type { Member } from '$lib/types/members.js';
import {
	CustomersResponseSchema,
	InvoiceResponseSchema,
	InvoicesResponseSchema,
	VouchersResponseSchema,
	VoucherResponseSchema
} from '$lib/schemas/fortnox.js';

import type { Customer, Invoice, InvoiceDetail, Voucher, VoucherListItem } from '$lib/types/fortnox';

export class FortnoxApi {
	private readonly baseUrl: string;
	private readonly fnpKey: string;

	constructor(baseUrl: string, fnpKey: string) {
		this.baseUrl = baseUrl;
		this.fnpKey = fnpKey;
	}

	private async fortnoxGet(path: string) {
		const headers = {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: this.fnpKey
		};
        let retriesLeft = 3;

        while (true) {
            const response = await fetch(`${this.baseUrl}${path}`, {
                method: 'GET',
                headers
            });
            if (response.ok) {
                return response;
            } else if (response.status === 429 && --retriesLeft > 0) {
                console.log(`Rate limit exceeded, waiting 5.1 seconds and trying again`);
                await new Promise(resolve => setTimeout(resolve, 5100));
            } else {
                const msg = await response.text();
                throw new Error(`Fortnox API error: ${response.status} - ${msg}`);
            }
        }
	}

	/**
	 * Sends a GET request to the Fortnox API with the specified path and returns the response as JSON.
	 */
	private async fortnoxGetJson(path: string) {
		const response = await this.fortnoxGet(path);
		return await response.json();
	}

	private async fortnoxGetBlob(path: string) {
		const response = await this.fortnoxGet(path);
		return response.blob();
	}

	/**
	 * Retrieves all customers from the Fortnox API.
	 */
	async getCustomers(): Promise<Customer[]> {
		let page = 1;
		let data = await this.fortnoxGetJson(`/customers?page=${page}`);
		let validatedData = CustomersResponseSchema.parse(data);

		let allCustomers = [...validatedData.Customers];

		while (
			validatedData.MetaInformation['@CurrentPage'] < validatedData.MetaInformation['@TotalPages']
		) {
			page += 1;
			data = await this.fortnoxGetJson(`/customers?page=${page}`);
			validatedData = CustomersResponseSchema.parse(data);
			allCustomers = [...allCustomers, ...validatedData.Customers];
		}

		return allCustomers;
	}

	/**
	 * Retrieves all invoices for a given customer number.
	 */
	async getInvoicesForCustomer(customerNumber: string): Promise<Invoice[]> {
		const sortBy = 'invoicedate';
		let page = 1;
		let queryParams = `?page=${page}&customernumber=${customerNumber}&sortby=${sortBy}`;

		let data = await this.fortnoxGetJson(`/invoices${queryParams}`);
		let validatedData = InvoicesResponseSchema.parse(data);

		let allInvoices = [...validatedData.Invoices];

		while (
			validatedData.MetaInformation['@CurrentPage'] < validatedData.MetaInformation['@TotalPages']
		) {
			page += 1;
			queryParams = `?page=${page}&customernumber=${customerNumber}&sortby=${sortBy}`;
			data = await this.fortnoxGetJson(`/invoices${queryParams}`);
			validatedData = InvoicesResponseSchema.parse(data);
			allInvoices = [...allInvoices, ...validatedData.Invoices];
		}

		const filteredInvoices = allInvoices.filter((invoice) => !invoice.Cancelled).reverse();

		return filteredInvoices;
	}

	/**
	 * Retrieves invoices for a member from Fortnox API.
	 */
	async getInvoices(member: Member) {
		const customers = await this.getCustomers();

		const personalCustomer = customers.find(
			(customer) => customer.OrganisationNumber === member.crNumber
		);
		const personalInvoices = personalCustomer
			? await this.getInvoicesForCustomer(personalCustomer.CustomerNumber)
			: null;

		const companyCustomer = customers.find(
			(customer) => customer.OrganisationNumber === member.company?.orgNum
		);
		const companyInvoices = companyCustomer
			? await this.getInvoicesForCustomer(companyCustomer.CustomerNumber)
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
	}

	/**
	 * Retrieves an invoice by its document number and checks authorization.
	 */
	async getInvoice(
		documentNumber: string,
		requestedBy: Member,
		requestedByRole: 'admin' | 'user'
	): Promise<InvoiceDetail> {
		const data = await this.fortnoxGetJson(`/invoices/${documentNumber}`);
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
	}

	/**
	 * Downloads the PDF for an invoice.
	 */
	async downloadInvoicePdf(documentNumber: string) {
		return await this.fortnoxGetBlob(`/invoices/${documentNumber}/print`);
	}

	/**
	 * Retrieves voucher list for the current year.
	 */
	async getVouchersThisYear(): Promise<VoucherListItem[]> {
		let allVouchers: VoucherListItem[] = [];
		let page = 1;
		let totalPages = 1;
		let totalVouchers = 0;

		do {
			const data = await this.fortnoxGetJson(`/vouchers/sublist?page=${page}`);
			const validatedData = VouchersResponseSchema.parse(data);
			allVouchers = [...allVouchers, ...validatedData.Vouchers];
			totalPages = validatedData.MetaInformation['@TotalPages'];
			totalVouchers = validatedData.MetaInformation['@TotalResources'];
			console.log(`Got page ${page} of ${totalPages}. Total vouchers: ${allVouchers.length} of ${totalVouchers}`);
		} while (page++ < totalPages);

		return allVouchers;
	}

	/**
	 * Retrieves a single voucher by number.
	 */
	async getVoucher(financialYear: number, series: string, voucherNumber: number): Promise<Voucher> {
		const data = await this.fortnoxGetJson(`/vouchers/${series}/${voucherNumber}?financialyear=${financialYear}`);
		const validatedData = VoucherResponseSchema.parse(data);
		return validatedData.Voucher;
	}
}

export default FortnoxApi;