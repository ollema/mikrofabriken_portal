<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';
	import type { SuperValidated, Infer } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { rfidFormSchema, type RfidFormSchema } from '$lib/schemas/members';

	interface Props {
		data: { form: SuperValidated<Infer<RfidFormSchema>> };
	}

	let { data }: Props = $props();

	const form = superForm(data.form, {
		validators: zodClient(rfidFormSchema)
	});

	const { form: formData, enhance, delayed } = form;
</script>

<form method="POST" class="max-w-lg space-y-4" use:enhance>
	<Form.Field {form} name="rfidCode">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>RFID code</Form.Label>
				<Input {...props} bind:value={$formData.rfidCode} placeholder="1234" />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
		<Form.Description>The code you will use to access Mikrofabriken.</Form.Description>
	</Form.Field>
	<Form.Field {form} name="rfidData">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>RFID data</Form.Label>
				<Input {...props} bind:value={$formData.rfidData} />
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
		<Form.Description>Only change this if you have changed your tag.</Form.Description>
	</Form.Field>
	<Form.Button>
		{#if $delayed}
			<LoaderCircle class="animate-spin" />
			Processing...
		{:else}
			Submit
		{/if}
	</Form.Button>
</form>
