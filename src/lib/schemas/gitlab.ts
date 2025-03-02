import { z } from 'zod';

export const MergeRequestSchema = z.object({
	id: z.number(),
	iid: z.number(),
	project_id: z.number(),
	title: z.string(),
	description: z.string(),
	state: z.string(),
	target_branch: z.string(),
	source_branch: z.string(),
	web_url: z.string()
});

export const MergeRequestsSchema = z.array(MergeRequestSchema);
