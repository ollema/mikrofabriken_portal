import { ProductSchema } from '$lib/schemas/cog.js';

export const productFormSchema = ProductSchema.omit({ uuid: true });

export type ProductFormSchema = typeof productFormSchema;
