import { factory, primaryKey, nullable } from '@mswjs/data';
import { faker } from '@faker-js/faker';
import type { InvoiceRow, Invoice } from '$lib/types/fortnox.js';
import type { InvoiceDetailSchema, CustomersResponseSchema } from '$lib/schemas/fortnox.js';
import type { z } from 'zod';

type InvoiceDetail = z.infer<typeof InvoiceDetailSchema>;
type Customer = z.infer<typeof CustomersResponseSchema>['Customers'][number];

// Create the data model for mocking invoice data
// https://github.com/mswjs/data?tab=readme-ov-file#factory
export const db = factory({
	customer: {
		CustomerNumber: primaryKey(String),
		OrganisationNumber: String,
		Name: String,
		Address1: String,
		Address2: String,
		City: String,
		Email: String,
		Phone: String,
		ZipCode: String
	},
	invoice: {
		DocumentNumber: primaryKey(String),
		CustomerNumber: String,
		CustomerName: String,
		OrganisationNumber: String,
		InvoiceDate: String,
		DueDate: String,
		Total: Number,
		Cancelled: Boolean,
		FinalPayDate: nullable(String)
	},
	invoiceDetail: {
		DocumentNumber: primaryKey(String),
		CustomerNumber: String,
		CustomerName: String,
		OrganisationNumber: String,
		InvoiceDate: String,
		DueDate: String,
		Address1: String,
		Address2: String,
		City: String,
		ZipCode: String,
		Currency: String,
		EmailAddressTo: nullable(String),
		Gross: Number,
		Net: Number,
		TotalToPay: Number,
		TotalVAT: Number,
		RoundOff: Number,
		OCR: String,
		FinalPayDate: nullable(String)
	},
	invoiceRow: {
		RowId: primaryKey(String),
		DocumentNumber: String,
		Description: String,
		DeliveredQuantity: String,
		Unit: String,
		PriceExcludingVAT: Number,
		TotalExcludingVAT: Number
	}
});

/**
 * Generates and stores mock invoice line items for a given invoice.
 *
 * @param documentNumber - The invoice document number
 * @param count - Number of invoice rows to generate
 * @returns Array of InvoiceRow objects (as stored in db)
 */
export const generateInvoiceRows = (documentNumber: string, count: number = 5): InvoiceRow[] => {
	const productGenerators = [
		faker.animal.type,
		faker.food.vegetable,
		faker.commerce.productMaterial,
		() => faker.science.chemicalElement().name,
		faker.food.fruit,
		faker.vehicle.model,
		faker.animal.bird,
		faker.hacker.noun,
		faker.word.noun,
		faker.color.human,
		faker.animal.insect
	];

	return Array.from({ length: count }, () => {
		const quantity = faker.number.int({ min: 1, max: 10 });
		const price = faker.number.int({ min: 10, max: 500 });
		const total = quantity * price;
		const productGenerator = faker.helpers.arrayElement(productGenerators);
		const description = `${faker.commerce.productAdjective()} ${productGenerator()}`;
		const row = {
			RowId: faker.string.uuid(),
			DocumentNumber: documentNumber,
			Description: description,
			DeliveredQuantity: quantity.toString(),
			Unit: faker.helpers.arrayElement(['st', 'kg', 'l', 'h', 'pack', 'box', 'meter']),
			PriceExcludingVAT: price,
			TotalExcludingVAT: total
		};
		db.invoiceRow.create(row);
		return row;
	});
};

/**
 * Generates a mock customer object.
 *
 * @param crNumber - Organisation number
 * @returns Customer object
 */
const generateCustomer = (crNumber: string): Customer => ({
	CustomerNumber: faker.string.numeric({ length: 5 }),
	OrganisationNumber: crNumber,
	Name: faker.person.fullName(),
	Address1: faker.location.streetAddress(),
	Address2: faker.location.secondaryAddress(),
	City: faker.location.city(),
	Email: faker.internet.email(),
	Phone: faker.phone.number(),
	ZipCode: faker.location.zipCode()
});

/**
 * Extends basic invoice data to create detailed invoice data (without InvoiceRows inline).
 *
 * @param basicInvoice - The basic invoice data
 * @param customer - The customer object
 * @param subtotal - Invoice subtotal
 * @param vat - VAT amount
 * @returns Detailed invoice data object
 */
export const generateInvoiceDetail = (
	basicInvoice: Invoice,
	customer: ReturnType<typeof generateCustomer>,
	subtotal: number,
	vat: number
): InvoiceDetail => ({
	...basicInvoice,
	Address1: customer.Address1,
	Address2: customer.Address2,
	City: customer.City,
	ZipCode: customer.ZipCode,
	Currency: 'SEK',
	EmailInformation: {
		EmailAddressTo: customer.Email
	},
	Gross: subtotal,
	Net: subtotal,
	TotalToPay: basicInvoice.Total,
	TotalVAT: vat,
	RoundOff: 0,
	InvoiceRows: [],
	OCR: `000${basicInvoice.DocumentNumber}000`,
	OrganisationNumber: customer.OrganisationNumber
});

/**
 * Generates mock invoices with line items for a customer.
 *
 * The generated invoices are in descending monthly order (most recent first).
 *
 * @param customer - The customer object to generate invoices for
 * @param count - Number of invoices to generate (default: 6)
 * @returns Array of objects with basic and detailed invoice data
 */
const generateInvoices = (customer: ReturnType<typeof generateCustomer>, count: number = 6) => {
	const invoices: Array<{
		basic: Invoice;
		detail: InvoiceDetail;
	}> = [];
	const today = new Date();

	for (let i = 0; i < count; i++) {
		const invoiceDate = new Date(today.getFullYear(), today.getMonth() - i, 1);
		const dueDate = new Date(invoiceDate);
		dueDate.setMonth(invoiceDate.getMonth() + 1);
		dueDate.setDate(0);
		const documentNumber = (1000 + i).toString();
		const invoiceRows = generateInvoiceRows(documentNumber, faker.number.int({ min: 4, max: 8 }));
		const subtotal = invoiceRows.reduce((sum, row) => sum + row.TotalExcludingVAT, 0);
		const vat = Math.round(subtotal * 0.25);
		const total = subtotal + vat;
		const finalPayDate = i === 0 ? null : dueDate.toISOString().split('T')[0];
		const basicInvoice: Invoice = {
			DocumentNumber: documentNumber,
			CustomerNumber: customer.CustomerNumber,
			CustomerName: customer.Name,
			Cancelled: false,
			InvoiceDate: invoiceDate.toISOString().split('T')[0],
			DueDate: dueDate.toISOString().split('T')[0],
			Total: total,
			FinalPayDate: finalPayDate
		};
		invoices.push({
			basic: basicInvoice,
			detail: generateInvoiceDetail(basicInvoice, customer, subtotal, vat)
		});
	}
	return invoices;
};

/**
 * Seeds the mock database with a customer and their invoices and rows.
 *
 * @param crNumber - Organisation number
 * @returns The created customer and their invoices
 */
export const seedDatabase = (crNumber: string) => {
	const existingCustomer = db.customer.findFirst({
		where: { OrganisationNumber: { equals: crNumber } }
	});
	if (existingCustomer) {
		const existingInvoices = db.invoice.findMany({
			where: { OrganisationNumber: { equals: crNumber } }
		});
		return { customer: existingCustomer, invoices: existingInvoices };
	}
	const customer = db.customer.create(generateCustomer(crNumber));
	const invoices = generateInvoices(customer).map(({ basic, detail }) => {
		const invoice = db.invoice.create(basic);
		db.invoiceDetail.create(detail);
		generateInvoiceRows(basic.DocumentNumber);
		return invoice;
	});
	return { customer, invoices };
};
