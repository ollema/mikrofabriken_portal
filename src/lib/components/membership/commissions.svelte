<script lang="ts">
	import type { Commission } from '$lib/types/members.js';
	import { isCommissionActive } from '$lib/utils/member.js';

	interface Props {
		commissions: Commission[];
	}

	let { commissions }: Props = $props();

	let activeCommissions = $derived(
		commissions.filter((commission) => isCommissionActive(commission))
	);
</script>

<div class="space-y-2">
	{#each activeCommissions as commission (commission)}
		<div class="text-sm">
			{commission.type} sedan {commission.startDate}
		</div>
	{/each}
</div>
