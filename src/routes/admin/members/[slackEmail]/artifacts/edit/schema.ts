import { z } from 'zod';

export const artifactsFormSchema = z.object({
	rfidTags: z.array(
		z.object({
			startDate: z.string(),
			data: z.string().min(1, { message: 'RFID data needs to be at least 1 character long' }),
			codeHash: z
				.string()
				.min(1, { message: 'RFID code hash needs to be at least 1 character long' }),
			endDate: z.string().optional()
		})
	),
	keys: z.array(
		z.object({
			startDate: z.string(),
			number: z.number().int(),
			endDate: z.string().optional()
		})
	),
	legacyKeys: z.array(
		z.object({
			startDate: z.string(),
			area: z.string(),
			endDate: z.string().optional()
		})
	)
});

export type ArtifactsFormSchema = typeof artifactsFormSchema;
