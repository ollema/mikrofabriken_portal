import type { z } from 'zod';

import type { CompanySchema } from '$lib/schemas/company';

export type Company = z.infer<typeof CompanySchema>;
