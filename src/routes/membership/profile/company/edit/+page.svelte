<script lang="ts">
	import * as PageHeader from '$lib/components/page-header/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as RadioGroup from '$lib/components/ui/radio-group/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { companyFormSchema, type CompanyFormSchema } from './schema.js';
	import type { Member } from '$lib/types/members.js';
	import { InvoiceCategoryTypes } from '$lib/schemas/members.js';

	interface Props {
		data: {
			form: SuperValidated<Infer<CompanyFormSchema>>;
			pending: {
				member: Member | undefined;
			};
		};
	}

	let { data }: Props = $props();

	const form = superForm(data.form, {
		validators: zod4Client(companyFormSchema),
		dataType: 'json'
	});

	const { form: formData, enhance, delayed } = form;
</script>

<div class="mx-auto w-full min-w-0">
	<PageHeader.Root>
		<PageHeader.Heading>
			<PageHeader.Title>Redigera företagskoppling</PageHeader.Title>
		</PageHeader.Heading>
	</PageHeader.Root>

	<Form.PendingAlert pending={data.pending} />

	<form method="POST" class="flex max-w-lg flex-col gap-4" action="?/edit" use:enhance>
		<Form.Field {form} name="orgNum">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Organisationsnummer</Form.Label>
					<Input {...props} bind:value={$formData.orgNum} />
				{/snippet}
			</Form.Control>
			<Form.Description>Viktigt: påverkar fakturering!</Form.Description>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="name">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Företagets namn</Form.Label>
					<Input {...props} bind:value={$formData.name} />
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="email">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Företagets email</Form.Label>
					<Input {...props} bind:value={$formData.email} />
				{/snippet}
			</Form.Control>
			<Form.Description>Fakturor skickas till denna mail.</Form.Description>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="postalAdress">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Företagets adress</Form.Label>
					<Input {...props} bind:value={$formData.postalAdress} />
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field {form} name="postalCode">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Företagets postnummer</Form.Label>
					<Input {...props} bind:value={$formData.postalCode} />
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field {form} name="postalCity">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Företagets ort</Form.Label>
					<Input {...props} bind:value={$formData.postalCity} />
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<div class="h-px"></div>

		<Form.Fieldset {form} name="invoiceDefaultTo">
			<Form.Legend>Inkludera per default fakturakategorier i:</Form.Legend>
			<RadioGroup.Root
				bind:value={$formData.invoiceDefaultTo}
				class="flex flex-col space-y-1"
				name="invoiceDefaultTo"
			>
				<div class="flex items-center space-y-0 space-x-3">
					<Form.Control>
						{#snippet children({ props })}
							<RadioGroup.Item {...props} value="personal" />
							<Form.Label class="font-normal">Personlig faktura</Form.Label>
						{/snippet}
					</Form.Control>
				</div>
				<div class="flex items-center space-y-0 space-x-3">
					<Form.Control>
						{#snippet children({ props })}
							<RadioGroup.Item {...props} value="company" />
							<Form.Label class="font-normal">Faktura till företaget</Form.Label>
						{/snippet}
					</Form.Control>
				</div>
			</RadioGroup.Root>
		</Form.Fieldset>

		<div class="h-px"></div>

		<Form.Field {form} name="invoiceExcludeCategoriesFromDefault">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>
						Fakturakategorier som ska uteslutas från <strong>{$formData.invoiceDefaultTo}</strong> faktura:
					</Form.Label>
					<Select.Root
						type="multiple"
						bind:value={$formData.invoiceExcludeCategoriesFromDefault}
						name={props.name}
					>
						{#each $formData.invoiceExcludeCategoriesFromDefault as invoiceCategory (invoiceCategory)}
							<input name={props.name} hidden value={invoiceCategory} />
						{/each}
						<Select.Trigger {...props}>
							{$formData.invoiceExcludeCategoriesFromDefault.length
								? $formData.invoiceExcludeCategoriesFromDefault.join(', ')
								: 'Välj fakturakategorier'}
						</Select.Trigger>
						<Select.Content>
							{#each InvoiceCategoryTypes.options as option (option)}
								<Select.Item value={option} label={option} />
							{/each}
						</Select.Content>
					</Select.Root>
					<Form.FieldErrors />
				{/snippet}
			</Form.Control>
		</Form.Field>

		<Form.SubmitButton {delayed} label="Skicka förslag på ändring" />
	</form>

	<form method="POST" class="mt-6 flex max-w-lg flex-col gap-4" action="?/delete">
		<Form.SubmitButton {delayed} label="Ta bort företag" variant="destructive" separator={false} />
	</form>
</div>
