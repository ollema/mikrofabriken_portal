import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { env } from '$env/dynamic/private';
if (!env.DB_PATH) throw new Error('DB_PATH is not set');
const client = new Database(env.DB_PATH);
export const db = drizzle(client);
