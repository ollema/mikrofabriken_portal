<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import { nameToInitials } from '$lib/utils/member.js';

	interface Props {
		member: {
			name: string;
			avatar: Promise<string | undefined>;
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
				{#await member.avatar then avatar}
					<Avatar.Image src={avatar} alt={member.name} />
				{/await}
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
			<div class="mt-1 flex flex-col gap-1 text-sm text-muted-foreground">
				{#each member.commissions as commission}
					<div class="">
						{commission}
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>
