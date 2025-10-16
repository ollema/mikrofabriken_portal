import type { z } from 'zod';
import type { CommitteeSchema, CommitteesSchema } from '$lib/schemas/committees';

export type Committee = z.infer<typeof CommitteeSchema>;
export type Committees = z.infer<typeof CommitteesSchema>;
