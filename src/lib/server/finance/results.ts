import type { Voucher } from '$lib/types/fortnox';
import type { AccountDetails, AccountDetailsMap } from '$lib/server/fortnox/fortnox-util.js';
import { AccountType } from '$lib/server/fortnox/fortnox-util.js';

type AccountTotal = {
	debit: number;
	credit: number;
	account: AccountDetails;
};

export type TotalsByAccount = Map<number, AccountTotal>;

export type CostCenter = string;

export type TotalsByCostCenter = Map<CostCenter, TotalsByAccount>;

type CostAndRevenue = {
	cost: number;
	revenue: number;
};

export function getTotalsByCostCenter(
	vouchers: Array<Voucher>,
	accounts: AccountDetailsMap
): TotalsByCostCenter {
	const results: TotalsByCostCenter = new Map();
	for (const voucher of vouchers) {
		for (const voucherRow of voucher.VoucherRows) {
			if (voucherRow.Removed) {
				continue;
			}
			const costCenter = voucherRow.CostCenter;
			let totals = results.get(costCenter);
			if (!totals) {
				totals = new Map();
				results.set(costCenter, totals);
			}
			const account = voucherRow.Account;
			const accountDetails = accounts.get(account);
			if (!accountDetails) {
				console.error(`Account ${account} not found`);
				continue;
			}
			let accountTotals = totals.get(account);
			if (!accountTotals) {
				accountTotals = { debit: 0, credit: 0, account: accountDetails };
				totals.set(account, accountTotals);
			}
			accountTotals.debit += voucherRow.Debit;
			accountTotals.credit += voucherRow.Credit;
		}
	}
	return results;
}

// Keeps only costs and revenue accounts
export function keepResultAccounts(results: TotalsByAccount): TotalsByAccount {
	const output: TotalsByAccount = new Map();
	for (const [account, accountTotals] of results.entries()) {
		const type = accountTotals.account.type;
		if (type === AccountType.Revenue || type === AccountType.Costs) {
			output.set(account, accountTotals);
		}
	}
	return output;
}

// Sum cost and revenue accounts
export function sumAllResults(results: TotalsByCostCenter): Map<CostCenter, CostAndRevenue> {
	const summedResults: Map<CostCenter, CostAndRevenue> = new Map();
	for (const [costCenter, totals] of results.entries()) {
		summedResults.set(costCenter, sumAllAccounts(totals));
	}
	return summedResults;
}

export function sumAllAccounts(totals: TotalsByAccount): CostAndRevenue {
	return totals.values().reduce(
		(acc, total) => {
			const result = accountResult(total);
			return {
				cost: acc.cost + result.cost,
				revenue: acc.revenue + result.revenue
			};
		},
		{ cost: 0, revenue: 0 }
	);
}

export function accountResult(total: AccountTotal): CostAndRevenue {
	if (total.account.type === AccountType.Revenue) {
		return { cost: 0, revenue: total.credit - total.debit };
	} else if (total.account.type === AccountType.Costs) {
		return { cost: total.debit - total.credit, revenue: 0 };
	} else {
		return { cost: 0, revenue: 0 };
	}
}

export function getNetResultForCostCenter(
	vouchers: Array<Voucher>,
	accounts: AccountDetailsMap,
	costCenter: CostCenter
): number {
	const results = getTotalsByCostCenter(vouchers, accounts);
	const summedResults = sumAllResults(results);
	const costCenterResults = summedResults.get(costCenter);
	if (!costCenterResults) {
		return 0;
	}
	return costCenterResults.revenue - costCenterResults.cost;
}
