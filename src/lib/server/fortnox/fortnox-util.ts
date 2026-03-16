import { getTotalsByCostCenter } from '../finance/results.js';
import { getCachedAccounts, getCachedVouchers } from './fortnox-cache.js';
import type { TotalsByCostCenter } from '../finance/results.js';
import type { FortnoxApi } from './fortnox-api.js';
import type { Account, Voucher, VoucherListItem, VoucherRow } from '$lib/types/fortnox.js';

export enum AccountType {
	Assets = 'assets',
	Liabilities = 'liabilities',
	Revenue = 'revenue',
	Costs = 'costs',
	Financial = 'financial',
	Unknown = 'unknown'
}

export type AccountDetails = {
	number: number;
	type: AccountType;
	description: string;
};

export type AccountDetailsMap = Map<number, AccountDetails>;

export type VoucherRowWithVoucher = VoucherRow & {
	voucher: Voucher;
};

function getAccountType(account: number): AccountType {
	if (/^[1]/.test(account.toString())) {
		return AccountType.Assets;
	} else if (/^[2]/.test(account.toString())) {
		return AccountType.Liabilities;
	} else if (/^[3]/.test(account.toString())) {
		return AccountType.Revenue;
	} else if (/^[4567]/.test(account.toString())) {
		return AccountType.Costs;
	} else if (/^[8]/.test(account.toString())) {
		return AccountType.Financial;
	} else {
		return AccountType.Unknown;
	}
}

export async function getCachedAccountDetails(): Promise<AccountDetailsMap> {
	const accounts = await getCachedAccounts();
	return new Map(
		accounts.map((account) => [
			account.Number,
			{
				number: account.Number,
				type: getAccountType(account.Number),
				description: account.Description
			}
		])
	);
}

async function getVoucherFromListItem(
	fortnox: FortnoxApi,
	voucherListItem: VoucherListItem
): Promise<Voucher> {
	return await fortnox.getVoucher(
		voucherListItem.Year,
		voucherListItem.VoucherSeries,
		voucherListItem.VoucherNumber
	);
}

export async function* getFullVouchersForCurrentYear(fortnox: FortnoxApi): AsyncGenerator<Voucher> {
	let page = 1;
	let totalPages: number;

	do {
		const data = await fortnox.getVoucherPageThisYearAsync(page);
		totalPages = data.MetaInformation['@TotalPages'];
		for (const voucherListItem of data.Vouchers) {
			const voucher = await getVoucherFromListItem(fortnox, voucherListItem);
			yield voucher;
		}
	} while (page++ < totalPages);
}

export function compareVouchersByDateAndNumber(a: Voucher, b: Voucher): number {
	const dateCompare = b.TransactionDate.localeCompare(a.TransactionDate);
	if (dateCompare !== 0) return dateCompare;
	return b.VoucherNumber - a.VoucherNumber;
}

// Filter voucher rows for this cost center and account,
// and remove removed rows
export function getVoucherRowsForCostCenter(
	vouchers: Array<Voucher>,
	costCenter: string,
	accountNumber: number
): Array<VoucherRowWithVoucher> {
	const voucherRows: Array<VoucherRowWithVoucher> = [];
	for (const voucher of vouchers) {
		for (const row of voucher.VoucherRows) {
			if (!row.Removed && row.Account === accountNumber && row.CostCenter === costCenter) {
				voucherRows.push({ ...row, voucher });
			}
		}
	}
	return voucherRows;
}

export async function getTotalsByCostCenterForCurrentYear(): Promise<TotalsByCostCenter> {
	const vouchers = await getCachedVouchers();
	const accounts = await getCachedAccountDetails();
	return getTotalsByCostCenter(vouchers, accounts);
}

export async function* getAllAccountsForCurrentYear(fortnox: FortnoxApi): AsyncGenerator<Account> {
	let page = 1;
	let totalPages: number;
	do {
		const data = await fortnox.getAccountPageThisYearAsync(page);
		totalPages = data.MetaInformation['@TotalPages'];
		for (const account of data.Accounts) {
			yield account;
		}
	} while (page++ < totalPages);
}
