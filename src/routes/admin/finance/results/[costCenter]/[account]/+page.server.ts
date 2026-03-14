import { error } from '@sveltejs/kit';
import { getCachedVouchers } from '$lib/server/fortnox/fortnox-cache';
import {
	compareVouchersByDateAndNumber,
	getCachedAccountDetails,
	getVoucherRowsForCostCenter
} from '$lib/server/fortnox/fortnox-util.js';

export async function load({ params }: { params: { costCenter: string; account: string } }) {
	const costCenter = params.costCenter === 'NONE' ? '' : params.costCenter;
	const accountNumber = parseInt(params.account);

	if (isNaN(accountNumber)) {
		error(400, `Invalid account number: ${params.account}`);
	}

	const accounts = await getCachedAccountDetails();
	const accountDetails = accounts.get(accountNumber);

	if (!accountDetails) {
		error(404, `Account ${params.account} not found`);
	}

	const vouchers = await getCachedVouchers();
	const voucherRows = getVoucherRowsForCostCenter(vouchers, costCenter, accountNumber);

	// Sort by transaction date (newest first), then by voucher number
	voucherRows.sort((a, b) => compareVouchersByDateAndNumber(a.voucher, b.voucher));

	return {
		costCenter: params.costCenter,
		account: accountDetails,
		voucherRows
	};
}
