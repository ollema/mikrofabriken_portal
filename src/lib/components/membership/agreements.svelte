<script lang="ts">
	import type { Agreement } from '$lib/types/members';
	import { isAgreementActive } from '$lib/helpers';

	interface Props {
		agreements: Agreement[];
	}

	let { agreements }: Props = $props();

	let activeAgreements = $derived(agreements.filter((agreement) => isAgreementActive(agreement)));

	let activeMembershipAgreement = $derived(
		activeAgreements.find((agreement) => agreement.type === 'membership')
	);

	let activeInvestmentAgreement = $derived(
		activeAgreements.find((agreement) => agreement.type === 'investment')
	);

	let activeAsylumAgreement = $derived(
		activeAgreements.find((agreement) => agreement.type === 'asylumInside')
	);

	let activeAsylumOutsideAgreement = $derived(
		activeAgreements.find((agreement) => agreement.type === 'asylumOutside')
	);

	let activePalletAgreement = $derived(
		activeAgreements.find((agreement) => agreement.type === 'palletInside')
	);
</script>

<div class="space-y-4">
	{#if activeMembershipAgreement}
		<div>
			You have an active <span class="font-semibold">membership agreement</span> since
			<span class="semibold">{activeMembershipAgreement.startDate}</span>.
		</div>
	{/if}

	{#if activeInvestmentAgreement}
		<div>
			You have an active <span class="font-semibold">investment agreement</span> since
			<span class="semibold">{activeInvestmentAgreement.startDate}</span>.
		</div>
	{/if}

	{#if activeAsylumAgreement}
		<div>
			You have an active <span class="font-semibold">asylum agreement</span> of size
			<span class="font-semibold">{activeAsylumAgreement.attributes?.size ?? 0} m<sup>2</sup></span>
			since <span class="semibold">{activeAsylumAgreement.startDate}</span>.
		</div>
	{/if}

	{#if activeAsylumOutsideAgreement}
		<div>
			You have an active <span class="font-semibold">asylum (outside) agreement</span> of size
			<span class="font-semibold">
				{activeAsylumOutsideAgreement.attributes?.size ?? 0} m<sup>2</sup>
			</span>
			since <span class="semibold">{activeAsylumOutsideAgreement.startDate}</span>.
		</div>
	{/if}

	{#if activePalletAgreement}
		<div>
			You have an active <span class="font-semibold">pallet agreement</span> with
			<span class="font-semibold">
				{activePalletAgreement.attributes?.palletCount ?? 0} pallets
			</span>
			and pallet IDs
			<span class="font-semibold">
				{activePalletAgreement.attributes?.palletIds?.join(', ') ?? 'N/A'}
			</span>
			since <span class="semibold">{activePalletAgreement.startDate}</span>.
		</div>
	{/if}
</div>
