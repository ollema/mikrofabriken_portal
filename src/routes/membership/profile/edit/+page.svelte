<script lang="ts">
	import * as PageHeader from '$lib/components/page-header';
	import * as Alert from '$lib/components/ui/alert';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { profileFormSchema, type ProfileFormSchema } from './schema.js';
	import type { Member } from '$lib/types/members';

	interface Props {
		data: {
			form: SuperValidated<Infer<ProfileFormSchema>>;
			pending: {
				member: Member | undefined;
			};
		};
	}

	let { data }: Props = $props();

	const form = superForm(data.form, {
		validators: zodClient(profileFormSchema),
		dataType: 'json'
	});

	const { form: formData, enhance, delayed } = form;
</script>

<div class="mx-auto w-full min-w-0">
	<PageHeader.Root>
		<PageHeader.Heading>
			<PageHeader.Title>Edit profile</PageHeader.Title>
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
				<div>There is a merge request for this member under review.</div>
				<div>You are currently viewing, editing and updating that merge request.</div>
			</Alert.Description>
		</Alert.Root>
	{/if}

	<form method="POST" class="flex max-w-lg flex-col gap-4" use:enhance>
		<Form.Field {form} name="name">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Name</Form.Label>
					<Input {...props} bind:value={$formData.name} />
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="postalAdress">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Address</Form.Label>
					<Input {...props} bind:value={$formData.postalAdress} />
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="postalCode">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Postal code</Form.Label>
					<Input {...props} bind:value={$formData.postalCode} />
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="postalCity">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>City</Form.Label>
					<Input {...props} bind:value={$formData.postalCity} />
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="email">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Email</Form.Label>
					<Input {...props} bind:value={$formData.email} />
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="phone">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Phone</Form.Label>
					<Input {...props} bind:value={$formData.phone} placeholder="0712345678" />
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Separator class="my-4" />

		<Form.Button class="w-full">
			{#if $delayed}
				<LoaderCircle class="animate-spin" />
				Processing...
			{:else}
				Submit change request
			{/if}
		</Form.Button>
	</form>
</div>
