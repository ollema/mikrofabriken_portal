import type { z } from 'zod';

import type { InvoiceSchema, InvoiceRowsSchema } from '$lib/schemas/fortnox';

export type Invoice = z.infer<typeof InvoiceSchema>;
export type InvoiceRow = z.infer<typeof InvoiceRowsSchema>;
