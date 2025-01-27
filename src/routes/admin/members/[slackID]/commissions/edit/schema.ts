import { z } from 'zod';

export const commissionsFormSchema = z.object({
	commissions: z.array(
		z.object({
			type: z.string(),
			startDate: z.string(),
			endDate: z.string().optional()
		})
	)
});

export type CommissionsFormSchema = typeof commissionsFormSchema;
