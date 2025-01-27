import { z } from 'zod';

export const EnumsSchema = z.object({
	$schema: z.string().optional(),
	$id: z.string().optional(),
	definitions: z.object({
		commission: z.object({
			title: z.string(),
			type: z.string(),
			enum: z.array(z.string())
		}),
		workPool: z.object({
			title: z.string(),
			type: z.string(),
			enum: z.array(z.string())
		}),
		billingCategory: z.object({
			title: z.string(),
			type: z.string(),
			enum: z.array(z.string())
		})
	})
});
