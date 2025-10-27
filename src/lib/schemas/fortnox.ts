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
	Cancelled: z.boolean(),
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

const ReferenceTypeEnum = z.enum([
	'INVOICE',
	'SUPPLIERINVOICE',
	'INVOICEPAYMENT',
	'SUPPLIERPAYMENT',
	'MANUAL',
	'CASHINVOICE',
	'ACCRUAL'
]);

export const VoucherListItemSchema = z.object({
	'@url': z.string(),
	ApprovalState: z.number().int(),
	Comments: z.string().nullable(),
	Description: z.string(),
	ReferenceNumber: z.string(),
	ReferenceType: ReferenceTypeEnum,
	TransactionDate: z.string(),
	VoucherNumber: z.number().int(),
	VoucherSeries: z.string(),
	Year: z.number().int()
});

export const VouchersResponseSchema = z.object({
	MetaInformation: MetaInformationSchema,
	Vouchers: z.array(VoucherListItemSchema)
});

export const VoucherRowSchema = z.object({
	Account: z.number().int(),
	CostCenter: z.string(),
	Credit: z.number(),
	Debit: z.number(),
	Description: z.string(),
	Project: z.string(),
	Quantity: z.number(),
	Removed: z.boolean(),
	TransactionInformation: z.string()
});

// Full Voucher schema (includes VoucherRows)
export const VoucherSchema = z.object({
	'@url': z.string(),
	ApprovalState: z.number().int(),
	Comments: z.string().nullable(),
	CostCenter: z.string(),
	Description: z.string(),
	Project: z.string(),
	ReferenceNumber: z.string(),
	ReferenceType: ReferenceTypeEnum,
	TransactionDate: z.string(),
	VoucherNumber: z.number().int(),
	VoucherRows: z.array(VoucherRowSchema),
	VoucherSeries: z.string(),
	Year: z.number().int()
});

export const VoucherResponseSchema = z.object({
	Voucher: VoucherSchema
});

