<script lang="ts">
	import * as PageHeader from '$lib/components/page-header/index.js';
	import { formatCurrency } from '$lib/components/finance/currency.js';
	import type { AccountDetails, VoucherRowWithVoucher } from '$lib/server/fortnox/fortnox-util.js';

	let { data } = $props();
	const costCenter = data.costCenter;
	const account = data.account as AccountDetails;
	const voucherRows = data.voucherRows;

	const formatAccountNumber = (account: number): string => {
		return account.toString().padStart(4, '0');
	};

	const formatDate = (dateString: string): string => {
		const date = new Date(dateString);
		return date.toLocaleDateString('sv-SE');
	};

	const getVoucherUrl = (row: VoucherRowWithVoucher): string => {
		return `/admin/finance/vouchers/${row.voucher.Year}/${row.voucher.VoucherSeries}/${row.voucher.VoucherNumber}`;
	};

	const totalDebit = voucherRows.reduce((sum, row) => sum + row.Debit, 0);
	const totalCredit = voucherRows.reduce((sum, row) => sum + row.Credit, 0);
	const net = totalDebit - totalCredit;
</script>

<div class="mx-auto w-full min-w-0">
	<PageHeader.Root>
		<PageHeader.Heading>
			<PageHeader.Title>
				Konto {formatAccountNumber(account.number)} - {costCenter || 'NONE'}
			</PageHeader.Title>
			<PageHeader.Description>{account.description}</PageHeader.Description>
		</PageHeader.Heading>
	</PageHeader.Root>

	<!-- Summary -->
	<div class="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
		<div class="bg-card rounded-lg border p-4">
			<div class="text-sm text-muted-foreground">Total Debet</div>
			<div class="text-2xl font-semibold">{formatCurrency(totalDebit)}</div>
		</div>
		<div class="bg-card rounded-lg border p-4">
			<div class="text-sm text-muted-foreground">Total Kredit</div>
			<div class="text-2xl font-semibold">{formatCurrency(totalCredit)}</div>
		</div>
		<div class="bg-card rounded-lg border p-4">
			<div class="text-sm text-muted-foreground">Netto</div>
			<div
				class="text-2xl font-semibold {net >= 0 ? 'text-green-600' : 'text-red-600'}"
			>
				{formatCurrency(net)}
			</div>
		</div>
	</div>

	<!-- Voucher Rows -->
	<div class="bg-card rounded-lg border p-6">
		<h2 class="mb-4 text-xl font-semibold">Verifikationsrader</h2>
		<div class="overflow-x-auto">
			<table class="w-full">
				<thead>
					<tr class="border-b">
						<th class="px-4 py-2 text-left text-sm font-medium">Datum</th>
						<th class="px-4 py-2 text-left text-sm font-medium">Verifikation</th>
						<th class="px-4 py-2 text-left text-sm font-medium">Beskrivning</th>
						<th class="px-4 py-2 text-left text-sm font-medium">Projekt</th>
						<th class="px-4 py-2 text-right text-sm font-medium">Debet</th>
						<th class="px-4 py-2 text-right text-sm font-medium">Kredit</th>
					</tr>
				</thead>
				<tbody>
					{#each voucherRows as row}
						<tr class="hover:bg-muted/50 border-b">
							<td class="px-4 py-2 text-sm">{formatDate(row.voucher.TransactionDate)}</td>
							<td class="px-4 py-2 text-sm">
								<a
									href={getVoucherUrl(row)}
									class="font-mono hover:underline"
								>
									{row.voucher.VoucherSeries}{row.voucher.VoucherNumber}
								</a>
							</td>
							<td class="px-4 py-2 text-sm">{row.Description || row.voucher.Description}</td>
							<td class="px-4 py-2 text-sm">{row.Project || '-'}</td>
							<td class="px-4 py-2 text-right text-sm">{formatCurrency(row.Debit)}</td>
							<td class="px-4 py-2 text-right text-sm">{formatCurrency(row.Credit)}</td>
						</tr>
					{/each}
					{#if voucherRows.length === 0}
						<tr>
							<td colspan="6" class="text-muted-foreground px-4 py-8 text-center text-sm">
								Inga verifikationsrader hittades för detta konto och kostnadsställe
							</td>
						</tr>
					{/if}
				</tbody>
				<tfoot>
					<tr class="border-t font-semibold">
						<td colspan="4" class="px-4 py-2 text-right text-sm">Totalt:</td>
						<td class="px-4 py-2 text-right text-sm">{formatCurrency(totalDebit)}</td>
						<td class="px-4 py-2 text-right text-sm">{formatCurrency(totalCredit)}</td>
					</tr>
					<tr class="border-t font-semibold">
						<td colspan="4" class="px-4 py-2 text-right text-sm">Netto:</td>
						<td colspan="2" class="px-4 py-2 text-right text-sm {net >= 0 ? 'text-green-600' : 'text-red-600'}">
							{formatCurrency(net)}
						</td>
					</tr>
				</tfoot>
			</table>
		</div>
	</div>
</div>

