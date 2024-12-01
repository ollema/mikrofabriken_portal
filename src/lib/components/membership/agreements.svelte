<script lang="ts">
	import type { Agreement } from '$lib/types/members';
	import { agreementToHumanReadable, isAgreementActive } from '$lib/helpers';
	import * as Alert from '$lib/components/ui/alert';
	import { type ComponentType } from 'svelte';
	import { type Icon } from 'lucide-svelte';
	import Mikrofabriken from '$lib/icons/Mikrofabriken.svelte';
	import Banknote from 'lucide-svelte/icons/banknote';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';
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
	Icon: ComponentType<Icon>;
})}
	{#each agreements as agreement, index}
		<div class="text-sm">
			<Icon class="mr-1 inline h-6 w-6" />
			{agreementToHumanReadable(agreement.type)} since {agreement.startDate}
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
