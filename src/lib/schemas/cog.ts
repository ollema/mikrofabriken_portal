import { z } from 'zod';

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

export const productFormSchema = ProductSchema.omit({ uuid: true });

export type ProductFormSchema = typeof productFormSchema;

export const NewProductSchema = ProductSchema.omit({ uuid: true });

export const newProductFormSchema = NewProductSchema;

export type NewProductFormSchema = typeof newProductFormSchema;

export const deleteProductFormSchema = ProductSchema.pick({ uuid: true });

export type DeleteProductFormSchema = typeof deleteProductFormSchema;

export const HistoricPurchaseSchema = z.object({
	buyerCrNumber: z.string(),
	dateTime: z.string().transform((value) => new Date(value)),
	productName: z.string(),
	pricePerUnit: z.number().positive(),
	quantity: z.number().positive(),
	pointOfSale: z.string()
});

export const HistoricPurchasesSchema = z.array(HistoricPurchaseSchema);

export const PurchaseSchema = z.object({
	productUuid: z.string(),
	quantity: z.number().positive(),
	pointOfSale: z.string(),
	forced: z.boolean()
});

export const OpenPeriodsSchema = z.array(
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

export const ProductCategoriesSchema = z.array(z.string());

export const BillingCategoriesSchema = z.array(z.string());

// TODO: should not be nullable
export const UnitNamesSchema = z.array(z.string().nullable());

export const VatPercentagesSchema = z.array(z.number().int());

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
