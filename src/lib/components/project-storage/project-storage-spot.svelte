<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import { page } from '$app/state';
	import { cn } from '$lib/utils';

	interface Props {
		storage: {
			name: string;
			period: {
				uuid: string;
				member: {
					name: string;
					slackID: string;
				};
				start: Date;
				end: Date | null;
			} | null;
		};
		avatars: Record<string, string>;
		onClick: (storage: Props['storage']) => void;
	}

	let { storage, avatars, onClick }: Props = $props();

	const owner = $derived(page.data.user?.slackID === storage.period?.member.slackID);
</script>

{#if storage.period}
	<Button
		variant="outline"
		class={cn(
			'relative h-32 w-[80px] border border-muted bg-muted p-0',
			storage.period && 'hover:border-foreground hover:bg-foreground/30',
			owner && 'hover:border-destructive hover:bg-destructive/30'
		)}
		onclick={() => onClick(storage)}
	>
		<div class="flex h-full flex-col items-center">
			<div class="flex grow items-center justify-center">
				<Avatar.Root class="size-12">
					<Avatar.Image
						src={avatars[storage.period.member.slackID]}
						alt={storage.period.member.name}
					/>
				</Avatar.Root>
			</div>
			<span class="text-lg font-bold uppercase">
				{storage.name.replace('storage/', '')}
			</span>
		</div>
	</Button>
{:else}
	<Button
		variant="outline"
		class="relative h-32 w-[80px] border p-0 hover:border-emerald-600 hover:bg-emerald-600/30"
		onclick={() => onClick(storage)}
	>
		<div class="flex h-full flex-col items-center">
			<div class="flex grow items-center justify-center"></div>
			<span class="text-lg font-bold uppercase">
				{storage.name.replace('storage/', '')}
			</span>
		</div>
	</Button>
{/if}
