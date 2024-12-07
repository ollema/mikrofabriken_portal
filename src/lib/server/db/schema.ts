import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { type Claims } from '$lib/types/cog.js';

export const user = sqliteTable('user', {
	id: text('id').primaryKey(),
	slackId: text('slack_id').notNull().unique(),
	email: text('email').notNull(),
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

export type Session = typeof session.$inferSelect;

export type User = typeof user.$inferSelect;
