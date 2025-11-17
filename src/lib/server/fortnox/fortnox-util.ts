import type { FortnoxApi } from './fortnox-api.js';
import type { VoucherListItem } from '$lib/types/fortnox.js';
import type { Voucher } from '$lib/types/fortnox.js';

async function getVoucherFromListItem(fortnox: FortnoxApi, voucherListItem: VoucherListItem): Promise<Voucher> {
    return await fortnox.getVoucher(voucherListItem.Year, voucherListItem.VoucherSeries, voucherListItem.VoucherNumber);
}

export async function* getFullVouchersForCurrentYear(fortnox: FortnoxApi): AsyncGenerator<Voucher> {
	let count = 0;
	let totalVouchers = 0;

	for await (const voucherPage of fortnox.getVouchersThisYearAsync()) {
		totalVouchers += voucherPage.length;
		
		for (const voucherListItem of voucherPage) {
			const voucher = await getVoucherFromListItem(fortnox, voucherListItem);
			count++;
			console.log(`Got voucher ${voucherListItem.VoucherSeries}${voucherListItem.VoucherNumber} (${count} of ${totalVouchers})`);

			yield voucher;
		}
	}
}