<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import { nameToInitials } from '$lib/utils/member.js';

	interface Props {
		member: {
			name: string;
			avatar: string;
			here: boolean;
			commissions: string[];
		};
	}

	let { member }: Props = $props();
</script>

<div class="flex flex-col">
	<div class="flex items-start gap-4">
		<div>
			<Avatar.Root
				class="custom-hover-out h-16 w-16 rounded-full border-2 {member.here
					? 'animate-pulse-border'
					: 'border-muted '}"
			>
				<Avatar.Image src={member.avatar} alt={member.name} />
				<Avatar.Fallback>{nameToInitials(member.name || '')}</Avatar.Fallback>
			</Avatar.Root>
		</div>
		<div>
			<div class="text-lg font-semibold">
				{member.name}
			</div>
		</div>
	</div>
	<div>
		{#if member.commissions.length > 0}
			<div class="mt-4 text-sm font-semibold">Roles:</div>
			<div class="text-muted-foreground mt-1 flex flex-col gap-1 text-sm">
				{#each member.commissions as commission (commission)}
					<div>
						{commission}
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>
