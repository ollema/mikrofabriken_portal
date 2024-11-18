import { defineConfig } from 'drizzle-kit';
if (!process.env.DB_PATH) throw new Error('DB_PATH is not set');

export default defineConfig({
	schema: './src/lib/server/db/schema.ts',

	dbCredentials: {
		url: process.env.DB_PATH
	},

	verbose: true,
	strict: true,
	dialect: 'sqlite'
});
