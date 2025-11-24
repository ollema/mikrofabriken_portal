import type { z } from 'zod';

import type {
	AccountSchema,
	CustomerSchema,
	InvoiceDetailSchema,
	InvoiceRowsSchema,
	InvoiceSchema,
	VoucherListItemSchema,
	VoucherRowSchema,
	VoucherSchema
} from '$lib/schemas/fortnox.js';

export type Account = z.infer<typeof AccountSchema>;
export type Customer = z.infer<typeof CustomerSchema>;
export type Invoice = z.infer<typeof InvoiceSchema>;
export type InvoiceRow = z.infer<typeof InvoiceRowsSchema>;
export type InvoiceDetail = z.infer<typeof InvoiceDetailSchema>;
export type VoucherListItem = z.infer<typeof VoucherListItemSchema>;
export type VoucherRow = z.infer<typeof VoucherRowSchema>;
export type Voucher = z.infer<typeof VoucherSchema>;
