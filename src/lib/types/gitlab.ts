import type { z } from 'zod';

import type { MergeRequestsSchema, MergeRequestSchema } from '$lib/schemas/gitlab';

export type MergeRequests = z.infer<typeof MergeRequestsSchema>;
export type MergeRequest = z.infer<typeof MergeRequestSchema>;
