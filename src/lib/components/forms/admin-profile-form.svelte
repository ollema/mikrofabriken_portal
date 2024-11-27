<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';
	import type { SuperValidated, Infer } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { adminFormSchema, type AdminFormSchema } from '$lib/schemas/members';

	interface Props {
		data: { form: SuperValidated<Infer<AdminFormSchema>> };
	}

	let { data }: Props = $props();

	const form = superForm(data.form, {
		validators: zodClient(adminFormSchema)
	});

	const { form: formData, enhance, delayed } = form;
</script>

<form method="POST" class="max-w-lg space-y-4" use:enhance>
	<Form.Field {form} name="crNumber">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>PIN</Form.Label>
				<Input {...props} bind:value={$formData.crNumber} />
			{/snippet}
		</Form.Control>
		<Form.Description>Important: changing this has consequences!</Form.Description>
		<Form.FieldErrors />
	</Form.Field>
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
	<Form.Field {form} name="slackEmail">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Slack email</Form.Label>
				<Input {...props} bind:value={$formData.slackEmail} />
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
	<Form.Button variant="outline">
		{#if $delayed}
			<LoaderCircle class="animate-spin" />
			Processing...
		{:else}
			Submit change request
		{/if}
	</Form.Button>
</form>
