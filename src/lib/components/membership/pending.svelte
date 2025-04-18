<script lang="ts">
	import * as Alert from '$lib/components/ui/alert/index.js';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import GitBranch from 'lucide-svelte/icons/git-branch';

	interface Props {
		showPending: boolean;
		sourceBranch?: string | undefined;
		link?: string | undefined;
	}

	let { showPending = $bindable(), sourceBranch = undefined, link = undefined }: Props = $props();
</script>

<Alert.Root class="my-6 w-full">
	<Alert.Title class="text-lg font-semibold">Observera!</Alert.Title>
	<Alert.Description class="mt-2">
		<div>Det finns ett förslag på ändring som väntar på godkännande.</div>
		{#if sourceBranch && link}
			<a
				href={link}
				target="_blank"
				rel="external"
				class="mt-2 flex items-center space-x-2 hover:underline"
			>
				<GitBranch class="mt-[2px] inline h-4" />
				<code>{sourceBranch}</code>
			</a>
		{/if}
		<div class="mt-4 flex items-center space-x-2">
			<Switch bind:checked={showPending} id="show-pending" />
			<Label for="show-pending" class="font-semibold">Visa föreslagna ändringar</Label>
		</div>
	</Alert.Description>
</Alert.Root>
