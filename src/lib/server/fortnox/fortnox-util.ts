import type { FortnoxApi } from './fortnox-api.js';
import type { VoucherListItem } from '$lib/types/fortnox.js';
import type { Voucher } from '$lib/types/fortnox.js';

async function getVoucherFromListItem(fortnox: FortnoxApi, voucherListItem: VoucherListItem): Promise<Voucher> {
    return await fortnox.getVoucher(voucherListItem.Year, voucherListItem.VoucherSeries, voucherListItem.VoucherNumber);
}

export async function* getFullVouchersForCurrentYear(fortnox: FortnoxApi): AsyncGenerator<Voucher> {
	const voucherList = await fortnox.getVouchersThisYear();
	for (const voucherListItem of voucherList /*.slice(0,10)*/) {
        console.log(`Getting voucher ${voucherListItem.VoucherNumber} of ${voucherList.length}`);
		const voucher = await getVoucherFromListItem(fortnox, voucherListItem);
		yield voucher;
	}
}