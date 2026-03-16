import { error } from '@sveltejs/kit';
import type { Member } from '$lib/types/members.js';
import type {
	AccountsResponse,
	Customer,
	CustomerDetails,
	Invoice,
	InvoiceDetail,
	Voucher,
	VouchersResponse
} from '$lib/types/fortnox';
import {
	AccountsResponseSchema,
	CustomerDetailsSchema,
	CustomersResponseSchema,
	InvoiceResponseSchema,
	InvoicesResponseSchema,
	VoucherResponseSchema,
	VouchersResponseSchema
} from '$lib/schemas/fortnox.js';

export class FortnoxApi {
	private readonly baseUrl: string;
	private readonly fnpKey: string;

	constructor(baseUrl: string, fnpKey: string) {
		this.baseUrl = baseUrl;
		this.fnpKey = fnpKey;
	}

	private async fortnoxGet(path: string) {
		if (!this.baseUrl) {
			throw new Error('Fortnox API: BASE_URL is not set');
		}
		if (!this.fnpKey) {
			throw new Error('Fortnox API: FNP_KEY is not set');
		}
		const headers = {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: this.fnpKey
		};
		for (let retriesLeft = 3; ; ) {
			const response = await fetch(`${this.baseUrl}${path}`, {
				method: 'GET',
				headers
			});
			if (response.ok) {
				return response;
			} else if (response.status === 429 && --retriesLeft > 0) {
				console.log(`Rate limit exceeded, waiting 5.1 seconds and trying again`);
				await new Promise((resolve) => setTimeout(resolve, 5100));
			} else if (response.status === 401 || response.status === 403) {
				error(502, 'Fortnox-proxyn är inte autentiserad. Kontakta #it-system på Slack.');
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
	async getCustomers(): Promise<Array<Customer>> {
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

	async getCustomer(customerNumber: string): Promise<CustomerDetails> {
		const data = await this.fortnoxGetJson(`/customers/${customerNumber}`);
		const customerData = data['Customer'];
		return CustomerDetailsSchema.parse(customerData);
	}

	async getCustomerByOrganisationNumber(
		organisationNumber: string
	): Promise<CustomerDetails | null> {
		const customers = await this.getCustomers();
		const customer = customers.find(
			(customer) => customer.OrganisationNumber === organisationNumber
		);
		return customer ? this.getCustomer(customer.CustomerNumber) : null;
	}

	/**
	 * Retrieves all invoices for a given customer number.
	 */
	async getInvoicesForCustomer(customerNumber: string): Promise<Array<Invoice>> {
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
		// TODO: we don't need to get all customers just to get the invoices for one member
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
		const companyInvoiceBelongsToMember =
			invoice.OrganisationNumber === requestedBy.company?.orgNum;
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

	// Gets a voucher page for the given year
	async getVoucherPageThisYearAsync(page: number): Promise<VouchersResponse> {
		const data = await this.fortnoxGetJson(`/vouchers/sublist?page=${page}`);
		return VouchersResponseSchema.parse(data);
	}

	async countVouchersThisYear(): Promise<number> {
		const firstPage = await this.getVoucherPageThisYearAsync(1);
		return firstPage.MetaInformation['@TotalResources'];
	}

	/**
	 * Retrieves a single voucher by number.
	 */
	async getVoucher(financialYear: number, series: string, voucherNumber: number): Promise<Voucher> {
		const data = await this.fortnoxGetJson(
			`/vouchers/${series}/${voucherNumber}?financialyear=${financialYear}`
		);
		const validatedData = VoucherResponseSchema.parse(data);
		return validatedData.Voucher;
	}

	async countAccountsThisYear(): Promise<number> {
		const firstPage = await this.getAccountPageThisYearAsync(1);
		return firstPage.MetaInformation['@TotalResources'];
	}

	async getAccountPageThisYearAsync(page: number): Promise<AccountsResponse> {
		const data = await this.fortnoxGetJson(`/accounts?page=${page}`);
		return AccountsResponseSchema.parse(data);
	}
}
