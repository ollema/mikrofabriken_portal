import type { z } from 'zod';

import type { InvoiceRowsSchema, InvoiceSchema } from '$lib/schemas/fortnox.js';

export type Invoice = z.infer<typeof InvoiceSchema>;
export type InvoiceRow = z.infer<typeof InvoiceRowsSchema>;
