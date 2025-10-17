import { z } from 'zod';

const BudgetEntrySchema = z
	.object({
		investment: z.number(),
		expenditure: z.number(),
		budgetYear: z.number(),
		startDate: z.string(),
		endDate: z.string()
	})
	.strict();

export const CommitteeSchema = z
	.object({
		name: z.string(),
		friendlyName: z.string(),
		description: z.string(),
		slackLink: z.string(),
		budget: z.array(BudgetEntrySchema).optional()
	})
	.strict();

export const CommitteesSchema = z.array(CommitteeSchema);
