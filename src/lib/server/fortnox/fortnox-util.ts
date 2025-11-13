import type { FortnoxApi } from './fortnox-api.js';
import type { VoucherListItem } from '$lib/types/fortnox.js';
import type { Voucher } from '$lib/types/fortnox.js';

async function getVoucherFromListItem(fortnox: FortnoxApi, voucherListItem: VoucherListItem): Promise<Voucher> {
    return await fortnox.getVoucher(voucherListItem.Year, voucherListItem.VoucherSeries, voucherListItem.VoucherNumber);
}

export async function* getFullVouchersForCurrentYear(fortnox: FortnoxApi): AsyncGenerator<Voucher> {
	const voucherList = await fortnox.getVouchersThisYear();
	let count = 0;
	for (const voucherListItem of voucherList /*.slice(0,10)*/) {
		const voucher = await getVoucherFromListItem(fortnox, voucherListItem);
		count++;
        console.log(`Got voucher ${voucherListItem.VoucherSeries}${voucherListItem.VoucherNumber} (${count} of ${voucherList.length})`);

		yield voucher;
	}
}