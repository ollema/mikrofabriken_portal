import type { z } from 'zod';

import type {
	ProductSchema,
	NewProductSchema,
	ProductsSchema,
	HistoricPurchaseSchema,
	HistoricPurchasesSchema,
	PurchaseSchema,
	ProductCategoriesSchema,
	BillingCategoriesSchema,
	UnitNamesSchema,
	VatPercentagesSchema,
	ClaimsSchema
} from '$lib/schemas/cog';

export type Product = z.infer<typeof ProductSchema>;

export type NewProduct = z.infer<typeof NewProductSchema>;

export type Products = z.infer<typeof ProductsSchema>;

export type HistoricPurchase = z.infer<typeof HistoricPurchaseSchema>;

export type HistoricPurchases = z.infer<typeof HistoricPurchasesSchema>;

export type Purchase = z.infer<typeof PurchaseSchema>;

export type ProductCategories = z.infer<typeof ProductCategoriesSchema>;

export type BillingCategoriesSchema = z.infer<typeof BillingCategoriesSchema>;

export type UnitNames = z.infer<typeof UnitNamesSchema>;

export type VatPercentages = z.infer<typeof VatPercentagesSchema>;

export type Claims = z.infer<typeof ClaimsSchema>;
