import { z } from 'zod';

export const WorkPoolSchema = z
	.object({
		id: z.string().min(1, { message: 'ID needs to be at least 1 character long' }),
		name: z.string().min(1, { message: 'Name needs to be at least 1 character long' }),
		description: z
			.string()
			.min(1, { message: 'Description needs to be at least 1 character long' }),
		managedByCommissions: z.array(z.string().min(1))
	})
	.strict();

export const WorkPoolsSchema = z.array(WorkPoolSchema);
