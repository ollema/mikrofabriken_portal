<script lang="ts">
	import * as PageHeader from '$lib/components/page-header/index.js';
	import * as Alert from '$lib/components/ui/alert/index.js';
	import { ProfileForm } from '$lib/components/forms/index.js';

	let { data } = $props();
</script>

<div class="mx-auto w-full min-w-0">
	<PageHeader.Root>
		<PageHeader.Heading>
			<PageHeader.Title>Edit profile</PageHeader.Title>
			<PageHeader.Description>Update your personal information.</PageHeader.Description>
		</PageHeader.Heading>
	</PageHeader.Root>

	<Alert.Root class="my-6 w-full">
		<Alert.Title class="text-lg font-semibold">Note:</Alert.Title>
		<Alert.Description class="mt-2 space-y-2">
			<div>Each merge request will be reviewed by an administrator before being applied.</div>
			<div>
				This means that <strong>your requested changes will not be active immediately</strong>.
			</div>
		</Alert.Description>
	</Alert.Root>

	{#if data.pending.member}
		<Alert.Root class="my-6 w-full">
			<Alert.Title class="text-lg font-semibold">Heads up!</Alert.Title>
			<Alert.Description class="mt-2 space-y-2">
				<div>There is a merge request for this profile under review.</div>
				<div>You are currently viewing, editing and updating that merge request.</div>
			</Alert.Description>
		</Alert.Root>
	{/if}

	<ProfileForm {data} />
</div>
