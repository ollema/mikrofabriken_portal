import { z } from 'zod';

/**
 * Represents the types of invoices.
 */
export const InvoiceCategoryTypes = z.enum([
	'electricity',
	'kiosk',
	'lootmobile',
	'membershipFees',
	'projectStorage',
	'temporaryStorage'
]);

/**
 * Company schema represents the structure of an associated company.
 */
export const CompanySchema = z
	.object({
		orgNum: z.string().regex(new RegExp('^[0-9]{6}-[0-9]{4}$'), {
			message: 'Org. number must be in format 123456-1234'
		}),
		name: z.string().min(1, { message: 'Name needs to be at least 1 character long' }),
		postalAdress: z
			.string()
			.min(1, { message: 'Postal address needs to be at least 1 character long' }),
		postalCode: z.string().min(1, { message: 'Postal code needs to be at least 1 character long' }),
		postalCity: z.string().min(1, { message: 'Postal city needs to be at least 1 character long' }),
		email: z.string().email({ message: 'Email needs to be a valid email address' }).optional(),
		invoiceDefaultTo: z.enum(['personal', 'company']),
		invoiceExcludeCategoriesFromDefault: z.array(InvoiceCategoryTypes)
	})
	.strict();

export const formSchema = CompanySchema;

export type FormSchema = typeof formSchema;
