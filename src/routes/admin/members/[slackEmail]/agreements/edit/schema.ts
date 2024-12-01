import { z } from 'zod';

export const agreementsFormSchema = z.object({
	memberships: z.array(
		z.object({
			type: z.enum(['membership', 'investment', 'passive']),
			startDate: z.string(),
			endDate: z.string().optional()
		})
	),
	asylums: z.array(
		z.object({
			type: z.enum(['asylumInside', 'asylumOutside']),
			startDate: z.string(),
			size: z.number().int().min(1, { message: 'Size needs to be at least 1' }),
			endDate: z.string().optional()
		})
	),
	pallets: z.array(
		z.object({
			type: z.enum(['palletInside', 'palletOutside']),
			startDate: z.string(),
			palletCount: z.number().int(),
			palletIds: z.array(z.number().int()),
			endDate: z.string().optional()
		})
	)
});

export type AgreementsFormSchema = typeof agreementsFormSchema;
