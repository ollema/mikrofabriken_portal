import type { z } from 'zod';
import type { WorkPoolSchema, WorkPoolsSchema } from '$lib/schemas/workpools';

export type WorkPool = z.infer<typeof WorkPoolSchema>;
export type WorkPools = z.infer<typeof WorkPoolsSchema>;
