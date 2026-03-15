import type { z } from 'zod';

import type {
	ClaimsSchema,
	HistoricPurchaseSchema,
	NewHoldingPeriodSchema,
	NewProductSchema,
	PeriodsSchema,
	ProductSchema,
	PurchaseSchema
} from '$lib/schemas/cog.js';

// claims
export type Claims = z.infer<typeof ClaimsSchema>;

// products
export type Product = z.infer<typeof ProductSchema>;
export type NewProduct = z.infer<typeof NewProductSchema>;

// purchases
export type Purchase = z.infer<typeof PurchaseSchema>;
export type HistoricPurchase = z.infer<typeof HistoricPurchaseSchema>;

// resources
export type NewHoldingPeriod = z.infer<typeof NewHoldingPeriodSchema>;
export type Period = z.infer<typeof PeriodsSchema.element>;
