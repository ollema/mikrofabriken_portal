import { z } from 'zod';

export const workPoolsFormSchema = z.object({
	workPools: z.array(z.string())
});

export type WorkPoolsFormSchema = typeof workPoolsFormSchema;
