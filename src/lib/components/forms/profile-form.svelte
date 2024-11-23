<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';
	import type { SuperValidated, Infer } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { formSchema, type FormSchema } from '$lib/schemas/members';

	interface Props {
		data: { form: SuperValidated<Infer<FormSchema>> };
	}

	let { data }: Props = $props();

	const form = superForm(data.form, {
		validators: zodClient(formSchema)
	});

	const { form: formData, enhance, delayed } = form;
</script>

<form method="POST" class="max-w-lg space-y-4" use:enhance>
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
	<Form.Button>
		{#if $delayed}
			<LoaderCircle class="animate-spin" />
			Processing...
		{:else}
			Submit change request
		{/if}
	</Form.Button>
</form>
