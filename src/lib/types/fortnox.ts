import type { z } from 'zod';

import type {
	AccountSchema,
	CustomerDetailsSchema,
	CustomerSchema,
	InvoiceDetailSchema,
	InvoiceRowsSchema,
	InvoiceSchema,
	VoucherListItemSchema,
	VoucherRowSchema,
	VoucherSchema,
	VouchersResponseSchema
} from '$lib/schemas/fortnox.js';

export type Account = z.infer<typeof AccountSchema>;
export type Customer = z.infer<typeof CustomerSchema>;
export type CustomerDetails = z.infer<typeof CustomerDetailsSchema>;
export type Invoice = z.infer<typeof InvoiceSchema>;
export type InvoiceRow = z.infer<typeof InvoiceRowsSchema>;
export type InvoiceDetail = z.infer<typeof InvoiceDetailSchema>;
export type VoucherListItem = z.infer<typeof VoucherListItemSchema>;
export type VouchersResponse = z.infer<typeof VouchersResponseSchema>;
export type VoucherRow = z.infer<typeof VoucherRowSchema>;
export type Voucher = z.infer<typeof VoucherSchema>;
