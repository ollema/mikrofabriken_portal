import { z } from 'zod';

// ----------------------------------------------------------------------------
// claims schemas
// ----------------------------------------------------------------------------
export const ClaimSchema = z.object({
	resource: z.string().min(1, { message: 'Resource needs to be at least 1 character long' }),
	action: z.enum([
		'Create',
		'CreateOthers',
		'Read',
		'ReadOthers',
		'Update',
		'UpdateOthers',
		'Delete',
		'DeleteOthers',
		'Use'
	])
});

export const ClaimsSchema = z.array(ClaimSchema);

// ----------------------------------------------------------------------------
// product schemas
// ----------------------------------------------------------------------------
enum ProductStockStatusEnum {
	InStock = 'InStock',
	OutOfStock = 'OutOfStock'
}

enum ProductUnitTypeEnum {
	Integer = 'Integer',
	Real = 'Real'
}

const ProductStockStatus = z.nativeEnum(ProductStockStatusEnum);
const ProductUnitType = z.nativeEnum(ProductUnitTypeEnum);

export const ProductSchema = z.object({
	uuid: z.string().uuid(),
	name: z.string().min(1, { message: 'Name needs to be at least 1 character long' }),
	category: z.string().min(1, { message: 'Category needs to be at least 1 character long' }),
	details: z.string().nullable(),
	unitType: ProductUnitType,
	unitName: z.string().nullable(),
	pricePerUnit: z.coerce.number().positive(),
	vat: z.coerce.number().int().positive(),
	ean: z.string().nullable(),
	billingCategory: z
		.string()
		.min(1, { message: 'Billing category needs to be at least 1 character long' }),
	sellerId: z.string().nullable(),
	stockStatus: ProductStockStatus
});

export const ProductsSchema = z.array(ProductSchema);

export const NewProductSchema = ProductSchema.omit({ uuid: true });

export const ProductCategoriesSchema = z.array(z.string());

export const BillingCategoriesSchema = z.array(z.string());

// TODO: should not be nullable
export const UnitNamesSchema = z.array(z.string().nullable());

export const VatPercentagesSchema = z.array(z.number().int());

// ----------------------------------------------------------------------------
// purchase schemas
// ----------------------------------------------------------------------------
export const HistoricPurchaseSchema = z.object({
	buyerCrNumber: z.string(),
	dateTime: z.string().transform((value) => new Date(value)),
	productName: z.string(),
	pricePerUnit: z.number(),
	quantity: z.number(),
	pointOfSale: z.string()
});

export const HistoricPurchasesSchema = z.array(HistoricPurchaseSchema);

export const PurchaseSchema = z.object({
	productUuid: z.string(),
	quantity: z.number(),
	pointOfSale: z.string(),
	forced: z.boolean()
});

// ----------------------------------------------------------------------------
// resource schemas
// ----------------------------------------------------------------------------
export const Point2DSchema = z.object({
	x: z.number(),
	y: z.number()
});

export const PolygonSchema = z.object({
	offset: Point2DSchema,
	points: z.array(Point2DSchema)
});

export const PeriodAttributeSchema = z.object({
	name: z.string().min(1),
	required: z.boolean(),
	collectionEvent: z.string().min(1)
});

export const ResourceSchema = z.object({
	name: z.string().min(1),
	description: z.string().min(1),
	shortDescription: z.string().min(1),
	shared: z.boolean(),
	costModel: z.string().nullable(),
	periodAttributes: z.array(PeriodAttributeSchema).nullable(),
	polygon: PolygonSchema.nullable()
});

export const ResourcesSchema = z.array(ResourceSchema);

export const NewHoldingPeriodSchema = z.object({
	resourceName: z.string().min(1)
});

export const PeriodsSchema = z.array(
	z.object({
		uuid: z.string(),
		resourceName: z.string(),
		memberCrNumber: z.string(),
		start: z.string().transform((value) => new Date(value)),
		end: z
			.string()
			.transform((value) => (value ? new Date(value) : null))
			.nullable()
	})
);

export const PeriodCostSchema = z.object({
	cost: z.number(),
	maximumMonthlyDiscount: z.number()
});

export const PeriodDiscountSchema = z.object({
	usedDiscountClosed: z.number(),
	usedDiscountOpen: z.number(),
	availableDiscount: z.number()
});

export const SamplePeriodSchema = z.object({
	resourceName: z.string().min(1),
	startDate: z.string().transform((value) => new Date(value)),
	endDate: z.string().transform((value) => new Date(value))
});
