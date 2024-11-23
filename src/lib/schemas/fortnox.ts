import { z } from 'zod';

const MetaInformationSchema = z.object({
	'@TotalResources': z.number(),
	'@TotalPages': z.number(),
	'@CurrentPage': z.number()
});

const CustomerSchema = z.object({
	Address1: z.string(),
	Address2: z.string(),
	City: z.string(),
	CustomerNumber: z.string(),
	Email: z.string(),
	Name: z.string(),
	OrganisationNumber: z.string(),
	Phone: z.string(),
	ZipCode: z.string()
});

export const CustomersResponseSchema = z.object({
	MetaInformation: MetaInformationSchema,
	Customers: z.array(CustomerSchema)
});

export const InvoiceSchema = z.object({
	CustomerName: z.string(),
	CustomerNumber: z.string(),
	DocumentNumber: z.string(),
	DueDate: z.string(),
	InvoiceDate: z.string(),
	Total: z.number(),
	FinalPayDate: z.string().nullable()
});

export const InvoicesResponseSchema = z.object({
	MetaInformation: MetaInformationSchema,
	Invoices: z.array(InvoiceSchema)
});

const EmailInformationSchema = z.object({
	EmailAddressTo: z.string().nullable()
});

export const InvoiceRowsSchema = z.object({
	DeliveredQuantity: z.string(),
	Description: z.string(),
	PriceExcludingVAT: z.number(),
	TotalExcludingVAT: z.number(),
	Unit: z.string()
});

export const InvoiceDetailSchema = z.object({
	Address1: z.string(),
	Address2: z.string(),
	City: z.string(),
	Currency: z.string(),
	CustomerName: z.string(),
	CustomerNumber: z.string(),
	DocumentNumber: z.string(),
	DueDate: z.string(),
	EmailInformation: EmailInformationSchema,
	Gross: z.number(),
	InvoiceDate: z.string(),
	InvoiceRows: z.array(InvoiceRowsSchema),
	Net: z.number(),
	OCR: z.string(),
	OrganisationNumber: z.string(),
	RoundOff: z.number(),
	TotalToPay: z.number(),
	TotalVAT: z.number(),
	ZipCode: z.string(),
	FinalPayDate: z.string().nullable().default('-')
});

export const InvoiceResponseSchema = z.object({
	Invoice: InvoiceDetailSchema
});
