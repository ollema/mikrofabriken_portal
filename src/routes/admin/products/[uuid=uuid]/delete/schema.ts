import { ProductSchema } from '$lib/schemas/cog.js';

export const deleteProductFormSchema = ProductSchema.pick({ uuid: true });

export type DeleteProductFormSchema = typeof deleteProductFormSchema;
