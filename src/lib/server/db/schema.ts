import { integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import type { Claims } from '$lib/types/cog.js';
import type { Account, Voucher } from '$lib/types/fortnox.js';

export const user = sqliteTable('user', {
	id: text('id').primaryKey(),
	slackID: text('slack_id').notNull().unique(),
	role: text('role').notNull(),
	claims: text('claims', { mode: 'json' }).$type<Claims>().notNull(),
	name: text('name').notNull(),
	image: text('image').notNull(),
	token: text('token').notNull()
});

export const session = sqliteTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull()
});

export const fortnoxAccount = sqliteTable(
	'fortnox_account',
	{
		year: integer('year').notNull(),
		number: integer('number').notNull(),
		data: text('data', { mode: 'json' }).$type<Account>().notNull()
	},
	(table) => [primaryKey({ columns: [table.year, table.number] })]
);

export const fortnoxVoucher = sqliteTable(
	'fortnox_voucher',
	{
		year: integer('year').notNull(),
		voucherSeries: text('voucher_series').notNull(),
		voucherNumber: integer('voucher_number').notNull(),
		data: text('data', { mode: 'json' }).$type<Voucher>().notNull()
	},
	(table) => [
		primaryKey({
			columns: [table.year, table.voucherSeries, table.voucherNumber]
		})
	]
);

export type Session = typeof session.$inferSelect;

export type User = typeof user.$inferSelect;
