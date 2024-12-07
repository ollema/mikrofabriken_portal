import { ProductSchema } from '$lib/schemas/cog';

export const deleteProductFormSchema = ProductSchema.pick({ uuid: true });

export type DeleteProductFormSchema = typeof deleteProductFormSchema;
