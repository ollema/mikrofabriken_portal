<script lang="ts">
	import * as PageHeader from '$lib/components/page-header';
	import * as Alert from '$lib/components/ui/alert';
	import GitBranch from 'lucide-svelte/icons/git-branch';
	import { AdminProfileForm } from '$lib/components/forms';
	import { appendPossessive } from '$lib/helpers.js';

	let { data } = $props();
</script>

<div class="mx-auto w-full min-w-0">
	<PageHeader.Root>
		<PageHeader.Heading>
			<PageHeader.Title>Edit {appendPossessive(data.member.name)} profile</PageHeader.Title>
			<PageHeader.Description
				>Edit {data.member.name}'s personal information.</PageHeader.Description
			>
		</PageHeader.Heading>
	</PageHeader.Root>

	<Alert.Root class="my-6 w-full max-w-lg">
		<Alert.Title class="text-lg font-semibold">Note:</Alert.Title>
		<Alert.Description class="mt-2 space-y-2">
			<div>Each merge request will be reviewed by an admin before being applied.</div>
			<div>This means that your requested changes will not be active immediately.</div>
		</Alert.Description>
	</Alert.Root>

	{#if data.pending.member}
		<Alert.Root class="my-6 w-full max-w-lg">
			<Alert.Title class="text-lg font-semibold">Heads up!</Alert.Title>
			<Alert.Description class="mt-2 space-y-2">
				<div>There is a merge request for this profile under review.</div>
				<div>You are currently viewing, editing and updating that merge request.</div>
				<a
					href={data.pending.link}
					target="_blank"
					rel="external"
					class="flex items-center space-x-2 hover:underline"
				>
					<GitBranch class="mt-[2px] inline h-4" />
					<code>{data.pending.sourceBranch}</code>
				</a>
			</Alert.Description>
		</Alert.Root>
	{/if}

	<AdminProfileForm {data} />
</div>
