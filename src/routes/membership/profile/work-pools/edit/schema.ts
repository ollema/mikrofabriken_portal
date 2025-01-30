import { z } from 'zod';

export const workPoolsFormSchema = z.object({
	workPools: z.array(z.string()).min(1, 'At least one work pool must be selected')
});

export type WorkPoolsFormSchema = typeof workPoolsFormSchema;
