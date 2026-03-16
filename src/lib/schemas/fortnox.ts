import { z } from 'zod';

const MetaInformationSchema = z.object({
	'@TotalResources': z.number(),
	'@TotalPages': z.number(),
	'@CurrentPage': z.number()
});

export const CustomerSchema = z.object({
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

export const CustomerDetailsSchema = z.object({
	Active: z.boolean(),
	Address1: z.string().max(1024).nullable(),
	Address2: z.string().max(1024).nullable(),
	City: z.string().max(1024).nullable(),
	Comments: z.string().nullable(),
	CostCenter: z.string().nullable(),
	Country: z.string().max(1024).nullable(),
	CountryCode: z.string().length(2).nullable(),
	Currency: z.string().nullable(),
	CustomerNumber: z.string(),

	DefaultDeliveryTypes: z.record(z.string(), z.unknown()).nullable(),
	DefaultTemplates: z.record(z.string(), z.unknown()).nullable(),
	DeliveryAddress1: z.string().max(1024).nullable(),
	DeliveryAddress2: z.string().max(1024).nullable(),
	DeliveryCity: z.string().max(1024).nullable(),
	DeliveryCountry: z.string().max(1024).nullable(),
	DeliveryCountryCode: z.string().length(2).nullable(),
	DeliveryFax: z.string().max(1024).nullable(),
	DeliveryName: z.string().max(1024).nullable(),
	DeliveryPhone1: z.string().max(1024).nullable(),
	DeliveryPhone2: z.string().max(1024).nullable(),
	DeliveryZipCode: z.string().max(10).nullable(),

	Email: z.string().max(1024).nullable(),
	EmailInvoice: z.string().max(1024).nullable(),
	EmailInvoiceBCC: z.string().max(1024).nullable(),
	EmailInvoiceCC: z.string().max(1024).nullable(),
	EmailOffer: z.string().max(1024).nullable(),
	EmailOfferBCC: z.string().max(1024).nullable(),
	EmailOfferCC: z.string().max(1024).nullable(),
	EmailOrder: z.string().max(1024).nullable(),
	EmailOrderBCC: z.string().max(1024).nullable(),
	EmailOrderCC: z.string().max(1024).nullable(),

	ExternalReference: z.string().max(1024).nullable(),
	Fax: z.string().max(1024).nullable(),
	GLN: z.string().length(13).nullable(),
	GLNDelivery: z.string().length(13).nullable(),
	InvoiceAdministrationFee: z.string().nullable(),
	InvoiceDiscount: z.number().nullable(),
	InvoiceFreight: z.string().nullable(),
	InvoiceRemark: z.string().max(1024).nullable(),

	Name: z.string().min(1).max(1024),
	OrganisationNumber: z.string().nullable(),
	OurReference: z.string().max(50).nullable(),
	Phone1: z.string().max(1024).nullable(),
	Phone2: z.string().max(1024).nullable(),
	PriceList: z.string().nullable(),
	Project: z.string().nullable(),
	SalesAccount: z.string().length(4).nullable(),
	ShowPriceVATIncluded: z.boolean().nullable(),
	TermsOfDelivery: z.string().nullable(),
	TermsOfPayment: z.string().nullable(),
	Type: z.enum(['PRIVATE', 'COMPANY']).nullable(),
	VATNumber: z.string().nullable(),
	VATType: z
		.enum(['SEVAT', 'SEREVERSEDVAT', 'EUREVERSEDVAT', 'EUVAT', 'EXPORT'])
		.nullable(),
	VisitingAddress: z.string().max(128).nullable(),
	VisitingCity: z.string().max(128).nullable(),
	VisitingCountry: z.string().max(128).nullable(),
	VisitingCountryCode: z.string().length(2).nullable(),
	VisitingZipCode: z.string().max(10).nullable(),
	WWW: z.string().max(128).nullable(),
	WayOfDelivery: z.string().nullable(),
	YourReference: z.string().max(50).nullable(),
	ZipCode: z.string().max(10).nullable()
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
	'ACCRUAL',
	'' // The Fortnox API spec doesn't allow this, but it's returned sometimes
]);

export const VoucherListItemSchema = z.object({
	'@url': z.string(),
	ApprovalState: z.number().int(),
	Comments: z.string().nullable(),
	Description: z.string(),
	ReferenceNumber: z.string().nullable(),
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
	ReferenceNumber: z.string().nullable(),
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

const CostCenterSettingsEnum = z.enum(['ALLOWED', 'MANDATORY', 'NOTALLOWED']);
const ProjectSettingsEnum = z.enum(['ALLOWED', 'MANDATORY', 'NOTALLOWED']);

export const AccountSchema = z.object({
	'@url': z.string(),
	Active: z.boolean(),
	BalanceBroughtForward: z.number().nullable(),
	CostCenter: z.string().nullable(),
	CostCenterSettings: CostCenterSettingsEnum,
	Description: z.string().min(1).max(200),
	Number: z.number().int().min(1000).max(9999),
	Project: z.string().nullable(),
	ProjectSettings: ProjectSettingsEnum,
	SRU: z.number().int().nullable(),
	VATCode: z.string().nullable(),
	Year: z.number().int()
});

export const AccountsResponseSchema = z.object({
	MetaInformation: MetaInformationSchema,
	Accounts: z.array(AccountSchema)
});
