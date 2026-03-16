import { eq } from 'drizzle-orm';
import { replaceAllAccounts, replaceAllVouchers } from './fortnox-cache.js';
import { fortnox } from './fortnox.js';
import { getAllAccountsForCurrentYear, getFullVouchersForCurrentYear } from './fortnox-util.js';
import { building } from '$app/environment';
import { fortnoxUpdateStatus } from '$lib/server/db/schema.js';
import { db } from '$lib/server/db/index.js';

const STATUS_ROW_ID = 1;

let running = false;

type StatusFields = {
	status: 'idle' | 'running' | 'completed' | 'failed';
	phase?: string | null;
	current?: number;
	total?: number;
	startedAt?: string | null;
	completedAt?: string | null;
	error?: string | null;
};

function ensureStatusRow() {
	const row = db
		.select()
		.from(fortnoxUpdateStatus)
		.where(eq(fortnoxUpdateStatus.id, STATUS_ROW_ID))
		.get();
	if (!row) {
		db.insert(fortnoxUpdateStatus).values({ id: STATUS_ROW_ID, status: 'idle' }).run();
	}
}

function updateProgress(fields: StatusFields) {
	db.update(fortnoxUpdateStatus).set(fields).where(eq(fortnoxUpdateStatus.id, STATUS_ROW_ID)).run();
}

export function getStatus(): StatusFields | undefined {
	ensureStatusRow();
	return db
		.select()
		.from(fortnoxUpdateStatus)
		.where(eq(fortnoxUpdateStatus.id, STATUS_ROW_ID))
		.get();
}

export function startUpdate(): { started: boolean; reason?: string } {
	if (running) {
		return { started: false, reason: 'Update is already running' };
	}
	running = true;
	ensureStatusRow();

	runUpdate()
		.catch((err) => {
			console.error('Finance update failed:', err);
			updateProgress({
				status: 'failed',
				error: String(err),
				completedAt: new Date().toISOString()
			});
		})
		.finally(() => {
			running = false;
		});

	return { started: true };
}

async function collectRows<T>(
	phase: string,
	generator: AsyncGenerator<T>,
	total: number
): Promise<Array<T>> {
	updateProgress({ status: 'running', phase, current: 0, total });
	const rows: Array<T> = [];
	let count = 0;
	const statusUpdateInterval = Math.max(1, Math.floor(total / 100));
	for await (const row of generator) {
		rows.push(row);
		if (count % statusUpdateInterval === 0) {
			updateProgress({ status: 'running', phase, current: count, total });
		}
		count++;
	}
	updateProgress({ status: 'running', phase, current: count, total });
	return rows;
}

async function runUpdate() {
	updateProgress({
		status: 'running',
		phase: 'accounts',
		current: 0,
		total: 0,
		startedAt: new Date().toISOString(),
		completedAt: null,
		error: null
	});

	// Phase 1: Accounts
	const totalAccounts = await fortnox.countAccountsThisYear();
	const accounts = await collectRows(
		'accounts',
		getAllAccountsForCurrentYear(fortnox),
		totalAccounts
	);
	replaceAllAccounts(accounts);

	// Phase 2: Vouchers
	const totalVouchers = await fortnox.countVouchersThisYear();
	const vouchers = await collectRows(
		'vouchers',
		getFullVouchersForCurrentYear(fortnox),
		totalVouchers
	);
	replaceAllVouchers(vouchers);

	updateProgress({
		status: 'completed',
		current: 0,
		total: 0,
		completedAt: new Date().toISOString()
	});
}

// Crash recovery: reset stuck 'running' status from a previous server crash
if (!building) {
	ensureStatusRow();
	const currentStatus = db
		.select()
		.from(fortnoxUpdateStatus)
		.where(eq(fortnoxUpdateStatus.id, STATUS_ROW_ID))
		.get();
	if (currentStatus?.status === 'running') {
		updateProgress({
			status: 'failed',
			error: 'Server restarted during update',
			completedAt: new Date().toISOString()
		});
	}
}
