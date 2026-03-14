<script lang="ts">
	import * as PageHeader from '$lib/components/page-header/index.js';
	import type { Voucher } from '$lib/types/fortnox.js';

	let { data } = $props();
	const voucher = data.voucher as Voucher;
</script>

<div class="mx-auto w-full min-w-0">
	<PageHeader.Root>
		<PageHeader.Heading>
			<PageHeader.Title
				>Verifikation {voucher.VoucherSeries} {voucher.VoucherNumber}</PageHeader.Title
			>
			<PageHeader.Description>
				{new Date(voucher.TransactionDate).toLocaleDateString('sv-SE')}
			</PageHeader.Description>
		</PageHeader.Heading>
	</PageHeader.Root>

	<div class="mt-6 space-y-6">
		<!-- Basic Information -->
		<div class="bg-card rounded-lg border p-6">
			<h2 class="mb-4 text-xl font-semibold">Information</h2>
			<dl class="grid grid-cols-2 gap-4">
				<div>
					<dt class="text-muted-foreground text-sm font-medium">Beskrivning</dt>
					<dd class="mt-1 text-sm">{voucher.Description}</dd>
				</div>
				<div>
					<dt class="text-muted-foreground text-sm font-medium">Referenstyp</dt>
					<dd class="mt-1 text-sm">{voucher.ReferenceType}</dd>
				</div>
				<div>
					<dt class="text-muted-foreground text-sm font-medium">Referensnummer</dt>
					<dd class="mt-1 text-sm">{voucher.ReferenceNumber}</dd>
				</div>
				<div>
					<dt class="text-muted-foreground text-sm font-medium">Godkännande</dt>
					<dd class="mt-1 text-sm">{voucher.ApprovalState}</dd>
				</div>
				<div class="col-span-2">
					<dt class="text-muted-foreground text-sm font-medium">Kommentarer</dt>
					<dd class="mt-1 text-sm">{voucher.Comments || '-'}</dd>
				</div>
			</dl>
		</div>

		<!-- Voucher Rows -->
		<div class="bg-card rounded-lg border p-6">
			<h2 class="mb-4 text-xl font-semibold">Verifikationsrader</h2>
			<div class="overflow-x-auto">
				<table class="w-full">
					<thead>
						<tr class="border-b">
							<th class="px-4 py-2 text-left text-sm font-medium">Konto</th>
							<th class="px-4 py-2 text-left text-sm font-medium">Kostnadsställe</th>
							<th class="px-4 py-2 text-left text-sm font-medium">Projekt</th>
							<th class="px-4 py-2 text-left text-sm font-medium">Beskrivning</th>
							<th class="px-4 py-2 text-right text-sm font-medium">Debet</th>
							<th class="px-4 py-2 text-right text-sm font-medium">Kredit</th>
						</tr>
					</thead>
					<tbody>
						{#each voucher.VoucherRows as row, index (index)}
							{#if !row.Removed}
								<tr class="border-b">
									<td class="px-4 py-2 text-sm">{row.Account}</td>
									<td class="px-4 py-2 text-sm">{row.CostCenter}</td>
									<td class="px-4 py-2 text-sm">{row.Project}</td>
									<td class="px-4 py-2 text-sm">{row.Description}</td>
									<td class="px-4 py-2 text-right text-sm">{row.Debit.toFixed(2)}</td>
									<td class="px-4 py-2 text-right text-sm">{row.Credit.toFixed(2)}</td>
								</tr>
							{/if}
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>
</div>
