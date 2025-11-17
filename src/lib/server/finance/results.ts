import type { Voucher } from "$lib/types/fortnox";

type AccountTotals = {
	debit: number;
	credit: number;
};

type TotalsByAccount = Record<number, AccountTotals>;

type TotalsByCostCenter = Record<string, TotalsByAccount>;

export type CostAndRevenue = {
	cost: number;
	revenue: number;
};

export async function getResultsByCostCenter(vouchers: Voucher[]): Promise<TotalsByCostCenter> {
    const results: TotalsByCostCenter = {};
    for (const voucher of vouchers) {
        for (const voucherRow of voucher.VoucherRows) {
            const costCenter = voucherRow.CostCenter;
            if (!results[costCenter]) {
                results[costCenter] = {};
            }
            const account = voucherRow.Account;
            if (!results[costCenter][account]) {
                results[costCenter][account] = { debit: 0, credit: 0 };
            }
            results[costCenter][account].debit += voucherRow.Debit;
            results[costCenter][account].credit += voucherRow.Credit;
        }
    }
	return results;
}

// Sum cost and revenue accounts
export async function sumResults(results: TotalsByCostCenter): Promise<Record<string, CostAndRevenue>> {
    const summedResults: Record<string, CostAndRevenue> = {};
    for (const costCenter in results) {
        for (const account in results[costCenter]) {
            if (!summedResults[costCenter]) {
                summedResults[costCenter] = { cost: 0, revenue: 0 };
            }
            if (/^[3]/.test(account)) {
                summedResults[costCenter].revenue += results[costCenter][account].credit - results[costCenter][account].debit;
            } else if (/^[4567]/.test(account)) {
                summedResults[costCenter].cost += results[costCenter][account].debit - results[costCenter][account].credit;
            }
        }
    }
    return summedResults;
}