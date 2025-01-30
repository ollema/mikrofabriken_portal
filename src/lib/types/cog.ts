import type { z } from 'zod';

import type {
	ClaimsSchema,
	ProductSchema,
	NewProductSchema,
	ProductsSchema,
	ProductCategoriesSchema,
	BillingCategoriesSchema,
	UnitNamesSchema,
	VatPercentagesSchema,
	PurchaseSchema,
	HistoricPurchaseSchema,
	HistoricPurchasesSchema,
	Point2DSchema,
	PolygonSchema,
	PeriodAttributeSchema,
	ResourceSchema,
	ResourcesSchema,
	NewHoldingPeriodSchema
} from '$lib/schemas/cog.js';

// claims
export type Claims = z.infer<typeof ClaimsSchema>;

// products
export type Product = z.infer<typeof ProductSchema>;
export type NewProduct = z.infer<typeof NewProductSchema>;
export type Products = z.infer<typeof ProductsSchema>;
export type ProductCategories = z.infer<typeof ProductCategoriesSchema>;
export type BillingCategories = z.infer<typeof BillingCategoriesSchema>;
export type UnitNames = z.infer<typeof UnitNamesSchema>;
export type VatPercentages = z.infer<typeof VatPercentagesSchema>;

// purchases
export type Purchase = z.infer<typeof PurchaseSchema>;
export type HistoricPurchase = z.infer<typeof HistoricPurchaseSchema>;
export type HistoricPurchases = z.infer<typeof HistoricPurchasesSchema>;

// resources
export type Point2D = z.infer<typeof Point2DSchema>;
export type Polygon = z.infer<typeof PolygonSchema>;
export type PeriodAttribute = z.infer<typeof PeriodAttributeSchema>;
export type Resource = z.infer<typeof ResourceSchema>;
export type Resources = z.infer<typeof ResourcesSchema>;
export type NewHoldingPeriod = z.infer<typeof NewHoldingPeriodSchema>;
