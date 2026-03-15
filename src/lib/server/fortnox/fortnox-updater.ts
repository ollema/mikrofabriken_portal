import { eq } from 'drizzle-orm';
import { replaceAllAccounts, replaceAllVouchers } from './fortnox-cache.js';
import { FortnoxApi } from './fortnox-api.js';
import { getFullVouchersForCurrentYear } from './fortnox-util.js';
import type { Account, Voucher } from '$lib/types/fortnox.js';
import { building } from '$app/environment';
import { fortnoxUpdateStatus } from '$lib/server/db/schema.js';
import { db } from '$lib/server/db/index.js';
import { env } from '$env/dynamic/private';

const BASE_URL = 'https://fnp.mikrofabriken.se/proxy/3' as const;
const STATUS_ROW_ID = 1;

let running = false;

type StatusFields = {
	status: string;
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

export function getStatus() {
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

async function runUpdate() {
	const fnpKey = env.FNP_KEY;
	if (!fnpKey) {
		throw new Error('FNP_KEY is not set');
	}

	const fortnox = new FortnoxApi(BASE_URL, fnpKey);

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
	const accounts: Array<Account> = (await Array.fromAsync(fortnox.listAccountsAsync())).flat();
	updateProgress({ status: 'running', current: accounts.length, total: accounts.length });
	replaceAllAccounts(accounts);

	// Phase 2: Vouchers
	const firstPage = await fortnox.getVoucherPageThisYearAsync(1);
	const totalVouchers = firstPage.MetaInformation['@TotalResources'];
	updateProgress({ status: 'running', phase: 'vouchers', current: 0, total: totalVouchers });

	const vouchers: Array<Voucher> = [];
	let count = 0;
	for await (const voucher of getFullVouchersForCurrentYear(fortnox)) {
		vouchers.push(voucher);
		count++;
		if (count % 10 === 0) {
			updateProgress({ status: 'running', current: count });
		}
	}
	replaceAllVouchers(vouchers);

	updateProgress({
		status: 'completed',
		current: vouchers.length,
		total: vouchers.length,
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
