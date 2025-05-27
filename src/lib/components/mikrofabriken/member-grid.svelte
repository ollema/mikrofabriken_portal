<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { nameToInitials, nameToFirstName } from '$lib/utils/member.js';

	interface Props {
		label: string | undefined;
		members: {
			name: string;
			avatar: string;
			here: boolean;
			commissions: string[];
		}[];
		selectedMember?: {
			name: string;
			avatar: string;
			here: boolean;
			commissions: string[];
		} | null;
		open?: boolean;
	}

	let {
		label,
		members,
		selectedMember = $bindable(null),
		open = $bindable(false)
	}: Props = $props();

	function selectMember(member: {
		name: string;
		avatar: string;
		here: boolean;
		commissions: string[];
	}) {
		selectedMember = member;
		open = true;
	}
</script>

<div class="mb-5">
	{#if label}
		<div class="text-foreground mb-3 text-lg font-bold">{label}</div>
	{/if}
	<div class="grid grid-cols-[repeat(auto-fill,minmax(4rem,1fr))] gap-4">
		{#each members as member (member)}
			<Button
				onclick={() => selectMember(member)}
				variant="ghost"
				class="relative flex h-auto w-16 flex-col items-center px-2 py-0"
			>
				<Avatar.Root class="size-16 rounded-full">
					<Avatar.Image src={member.avatar} alt={member.name} />
					<Avatar.Fallback>{nameToInitials(member.name)}</Avatar.Fallback>
				</Avatar.Root>
				<div
					class="outline-muted absolute top-0 h-16 w-16 rounded-full outline-4 outline-offset-[-3px] outline-solid"
				></div>
				{#if member.here}
					<div class="animate-pulse-border absolute top-0 h-16 w-16 rounded-full border-2"></div>
				{/if}
				<div class="mt-1 w-16 truncate pb-1 text-center text-xs">
					{nameToFirstName(member.name)}
				</div>
			</Button>
		{/each}
	</div>
</div>

<style>
	@keyframes pulse-border {
		0%,
		20%,
		80%,
		100% {
			border-color: #009f3a;
		}
		50% {
			border-color: #22c55e4e;
		}
	}

	/* utility class for the animation */
	:global(.animate-pulse-border) {
		animation: pulse-border 3.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
	}
</style>
