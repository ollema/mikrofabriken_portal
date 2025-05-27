<script lang="ts">
	import * as PageHeader from '$lib/components/page-header/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { deleteProductFormSchema, type DeleteProductFormSchema } from './schema.js';

	interface Props {
		data: {
			form: SuperValidated<Infer<DeleteProductFormSchema>>;
			productCategories: string[];
			billingCategories: string[];
			// TODO: should not be nullable
			unitNames: (string | null)[];
			vatPercentages: number[];
		};
	}

	let { data }: Props = $props();

	const form = superForm(data.form, {
		validators: zodClient(deleteProductFormSchema),
		dataType: 'json'
	});

	const { form: formData, enhance, delayed } = form;
</script>

<div class="mx-auto w-full min-w-0">
	<PageHeader.Root>
		<PageHeader.Heading>
			<PageHeader.Title>Ta bort produkt</PageHeader.Title>
		</PageHeader.Heading>
	</PageHeader.Root>

	<form method="POST" class="flex max-w-lg flex-col gap-4" use:enhance>
		<Form.Field {form} name="uuid">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>UUID</Form.Label>
					<Input
						{...props}
						bind:value={$formData.uuid}
						readonly
						class="text-muted-foreground cursor-default"
					/>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.SubmitButton {delayed} label="Ta bort produkt" variant="destructive" />
	</form>
</div>
