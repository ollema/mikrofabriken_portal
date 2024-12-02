import { z } from 'zod';
import { CommissionTypes } from '$lib/schemas/members';

export const commissionsFormSchema = z.object({
	commissions: z.array(
		z.object({
			type: CommissionTypes,
			startDate: z.string(),
			endDate: z.string().optional()
		})
	)
});

export type CommissionsFormSchema = typeof commissionsFormSchema;
