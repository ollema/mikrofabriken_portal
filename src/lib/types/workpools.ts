import { z } from 'zod';
import { WorkPoolSchema, WorkPoolsSchema } from '$lib/schemas/workpools';

export type WorkPool = z.infer<typeof WorkPoolSchema>;
export type WorkPools = z.infer<typeof WorkPoolsSchema>;
