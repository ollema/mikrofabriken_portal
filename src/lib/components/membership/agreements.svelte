<script lang="ts">
	import type { Agreement } from '$lib/types/members';
	import { agreementToHumanReadable, isAgreementActive } from '$lib/helpers';
	import * as Alert from '$lib/components/ui/alert';
	import Handshake from 'lucide-svelte/icons/handshake';
	import Coins from 'lucide-svelte/icons/coins';
	import Box from 'lucide-svelte/icons/box';
	import Container from 'lucide-svelte/icons/container';
	import Package from 'lucide-svelte/icons/package';

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

	let activeAsylumAgreements = $derived(
		activeAgreements.filter((agreement) => agreement.type === 'asylumInside')
	);

	let activeAsylumOutsideAgreements = $derived(
		activeAgreements.filter((agreement) => agreement.type === 'asylumOutside')
	);

	let activePalletAgreements = $derived(
		activeAgreements.filter((agreement) => agreement.type === 'palletInside')
	);
</script>

{#snippet activeAgreementsSection({
	agreements,
	Icon
}: {
	agreements: Agreement[];
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	Icon: any;
})}
	{#each agreements as agreement, index}
		<div>
			<Icon class="mr-2 inline" /> Active {agreementToHumanReadable(agreement.type)} agreement since
			<span class="font-semibold">{agreement.startDate}</span>.
		</div>
		{#if index === 1 && (agreement.type === 'membership' || agreement.type === 'investment')}
			<Alert.Root class="my-6 w-full max-w-screen-md" variant={'destructive'}>
				<Alert.Title class="text-lg font-semibold">Heads up!</Alert.Title>
				<Alert.Description class="mt-2">
					<div>
						You have more than one active {agreementToHumanReadable(agreement.type)} agreement. This
						is unexpected. Please contact the board.
					</div>
				</Alert.Description>
			</Alert.Root>
		{/if}
	{/each}
{/snippet}

<div class="space-y-4">
	{@render activeAgreementsSection({
		agreements: activeMembershipAgreements,
		Icon: Handshake
	})}

	{@render activeAgreementsSection({
		agreements: activeInvestmentAgreements,
		Icon: Coins
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
</div>
