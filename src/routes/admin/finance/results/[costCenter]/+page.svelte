<script lang="ts">
	import * as PageHeader from '$lib/components/page-header/index.js';
	import { formatCurrency } from '$lib/components/finance/currency.js';

	import type { AccountDetails } from '$lib/server/fortnox/fortnox-util.js';

	type AccountBreakdown = {
		account: AccountDetails;
		debit: number;
		credit: number;
		net: number;
	};

	let { data } = $props();
	const accountBreakdown = data.accountBreakdown as AccountBreakdown[];
	const costCenter = data.costCenter as string;

	const formatAccountNumber = (account: number): string => {
		return account.toString().padStart(4, '0');
	};

	/**
	 * Generate URL for an account detail page within a cost center
	 * @param costCenter - The cost center identifier (empty string becomes 'NONE')
	 * @param accountNumber - The account number
	 * @returns The URL path for the account detail page
	 */
	function getAccountUrl(costCenter: string, accountNumber: number): string {
		const costCenterParam = costCenter === '' ? 'NONE' : costCenter;
		return `/admin/finance/results/${costCenterParam}/${accountNumber}`;
	}
</script>

<div class="mx-auto w-full min-w-0">
	<PageHeader.Root>
		<PageHeader.Heading>
			<PageHeader.Title>Resultat - {costCenter || 'NONE'}</PageHeader.Title>
			<PageHeader.Description>Resultat per konto för kostnadsställe</PageHeader.Description
			>
		</PageHeader.Heading>
	</PageHeader.Root>
	<!-- Account Breakdown -->
	<div class="bg-card rounded-lg border p-6">
		<div class="overflow-x-auto">
			<table class="w-full">
				<thead>
					<tr class="border-b">
						<th class="px-4 py-2 text-left text-sm font-medium">Konto</th>
						<th class="px-4 py-2 text-left text-sm font-medium">Typ</th>
						<th class="px-4 py-2 text-right text-sm font-medium">Debet</th>
						<th class="px-4 py-2 text-right text-sm font-medium">Kredit</th>
						<th class="px-4 py-2 text-right text-sm font-medium">Netto</th>
					</tr>
				</thead>
				<tbody>
					{#each accountBreakdown as account}
						<tr class="hover:bg-muted/50 border-b">
							<td class="px-4 py-2 font-mono text-sm">
								<a
									href={getAccountUrl(costCenter, account.account.number)}
									class="hover:underline"
								>
									{formatAccountNumber(account.account.number)}
								</a>
							</td>
							<td class="text-muted-foreground px-4 py-2 text-sm">{account.account.description}</td>
							<td class="px-4 py-2 text-right text-sm font-medium">{formatCurrency(account.debit)}</td>
							<td class="px-4 py-2 text-right text-sm font-medium">{formatCurrency(account.credit)}</td>
							<td
								class="px-4 py-2 text-right text-sm font-medium {account.net >= 0
									? 'text-green-600'
									: 'text-red-600'}"
							>
								{formatCurrency(account.net)}
							</td>
						</tr>
					{/each}
					{#if accountBreakdown.length === 0}
						<tr>
							<td colspan="5" class="text-muted-foreground px-4 py-8 text-center text-sm">
								Inga konton hittades för detta kostnadsställe
							</td>
						</tr>
					{/if}
				</tbody>
			</table>
		</div>
	</div>
</div>
