<script lang="ts">
	import IconEntry from './icon-entry.svelte';
	import type { Agreement } from '$lib/types/members.js';
	import { agreementToHumanReadable, isAgreementActive } from '$lib/utils/member.js';
	import * as Alert from '$lib/components/ui/alert/index.js';
	import { type Icon as IconType } from '@lucide/svelte';
	import Mikrofabriken from '$lib/icons/mikrofabriken.svelte';
	import Banknote from '@lucide/svelte/icons/banknote';
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';
	import Box from '@lucide/svelte/icons/box';
	import Container from '@lucide/svelte/icons/container';
	import Package from '@lucide/svelte/icons/package';

	interface Props {
		agreements: Agreement[];
	}

	let { agreements }: Props = $props();

	let activeAgreements = $derived(agreements.filter((agreement) => isAgreementActive(agreement)));

	let activeMembershipAgreements = $derived(
		activeAgreements.filter((agreement) => agreement.type === 'membership')
	);

	let activeInvestmentAgreements = $derived(
		activeAgreements.filter((agreement) => agreement.type === 'investment')
	);

	let activePassiveAgreements = $derived(
		activeAgreements.filter((agreement) => agreement.type === 'passive')
	);

	let activeAsylumAgreements = $derived(
		activeAgreements.filter((agreement) => agreement.type === 'asylumInside')
	);

	let activeAsylumOutsideAgreements = $derived(
		activeAgreements.filter((agreement) => agreement.type === 'asylumOutside')
	);

	let activePalletAgreements = $derived(
		activeAgreements.filter((agreement) => agreement.type === 'palletInside')
	);

	let activePalletOutsideAgreements = $derived(
		activeAgreements.filter((agreement) => agreement.type === 'palletOutside')
	);
</script>

{#snippet activeAgreementsSection({
	agreements,
	Icon
}: {
	agreements: Agreement[];
	Icon: typeof IconType;
})}
	{#each agreements as agreement, index (agreement)}
		<IconEntry {Icon}>
			{agreementToHumanReadable(agreement.type)}
			{#if agreement.type === 'asylumInside' || agreement.type === 'asylumOutside'}
				av storlek {agreement.attributes.size} m<sup>2</sup>
			{:else if agreement.type === 'palletInside' || agreement.type === 'palletOutside'}
				med IDs {agreement.attributes.palletIds.join(', ')}
			{/if}
			sedan {agreement.startDate}
		</IconEntry>
		{#if index === 1 && (agreement.type === 'membership' || agreement.type === 'investment')}
			<Alert.Root class="my-6 w-full max-w-(--breakpoint-md)" variant="destructive">
				<Alert.Title class="text-lg font-semibold">Obs!</Alert.Title>
				<Alert.Description class="mt-2">
					<div>
						Du har mer än 1 aktivt {agreementToHumanReadable(agreement.type)} avtal. Det var oväntat.
						Kontakta styrelsen för att få hjälp med att lösa det.
					</div>
				</Alert.Description>
			</Alert.Root>
		{/if}
	{/each}
{/snippet}

<div class="space-y-4">
	{@render activeAgreementsSection({
		agreements: activeMembershipAgreements,
		// @ts-expect-error Mikrofabriken is not a valid Icon
		Icon: Mikrofabriken
	})}

	{@render activeAgreementsSection({
		agreements: activeInvestmentAgreements,
		Icon: Banknote
	})}

	{@render activeAgreementsSection({
		agreements: activePassiveAgreements,
		Icon: LoaderCircle
	})}

	{@render activeAgreementsSection({
		agreements: activeAsylumAgreements,
		Icon: Box
	})}

	{@render activeAgreementsSection({
		agreements: activeAsylumOutsideAgreements,
		Icon: Container
	})}

	{@render activeAgreementsSection({
		agreements: activePalletAgreements,
		Icon: Package
	})}

	{@render activeAgreementsSection({
		agreements: activePalletOutsideAgreements,
		Icon: Package
	})}
</div>
