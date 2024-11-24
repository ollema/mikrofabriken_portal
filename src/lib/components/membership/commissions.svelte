<script lang="ts">
	import type { Commission } from '$lib/types/members';
	import { commissionToHumanReadable, isCommissionActive } from '$lib/helpers';

	interface Props {
		commissions: Commission[];
	}

	let { commissions }: Props = $props();

	let activeCommissions = $derived(
		commissions.filter((commission) => isCommissionActive(commission))
	);
</script>

<div class="space-y-4">
	{#each activeCommissions as commission}
		<div>
			Active {commissionToHumanReadable(commission.type)} agreement since
			<span class="font-semibold">{commission.startDate}</span>.
		</div>
	{/each}
</div>
