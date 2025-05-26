<script lang="ts">
	import * as Alert from '$lib/components/ui/alert/index.js';
	import GitBranch from '@lucide/svelte/icons/git-branch';
	import type { Member } from '$lib/types/members.js';

	interface Props {
		pending: {
			member: Member | undefined;
			link?: string | undefined;
			sourceBranch?: string | undefined;
		};
	}

	let { pending }: Props = $props();
</script>

<Alert.Root class="my-6 w-full max-w-lg">
	<Alert.Title class="text-lg font-semibold">Observera:</Alert.Title>
	<Alert.Description class="mt-2 space-y-2">
		<div>Varje ändring behöver godkännas manuellt av en administratör.</div>
		<div>Det innebär att föreslagna ändringar inte börjar gälla direkt.</div>
	</Alert.Description>
</Alert.Root>

{#if pending.member}
	<Alert.Root class="my-6 w-full max-w-lg">
		<Alert.Title class="text-lg font-semibold">Heads up!</Alert.Title>
		<Alert.Description class="mt-2 space-y-2">
			<div>There is a merge request for this member under review.</div>
			<div>You are currently viewing, editing and updating that merge request.</div>
			{#if pending.link && pending.sourceBranch}
				<a
					href={pending.link}
					target="_blank"
					rel="external"
					class="flex items-center space-x-2 hover:underline"
				>
					<GitBranch class="mt-[2px] inline h-4" />
					<code>{pending.sourceBranch}</code>
				</a>
			{/if}
		</Alert.Description>
	</Alert.Root>
{/if}
