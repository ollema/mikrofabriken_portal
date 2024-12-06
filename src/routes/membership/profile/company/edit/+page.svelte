<script lang="ts">
	import * as PageHeader from '$lib/components/page-header';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import * as RadioGroup from '$lib/components/ui/radio-group';
	import * as Select from '$lib/components/ui/select';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { companyFormSchema, type CompanyFormSchema } from './schema.js';
	import type { Member } from '$lib/types/members';
	import { InvoiceCategoryTypes } from '$lib/schemas/company.js';

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
		validators: zodClient(companyFormSchema),
		dataType: 'json'
	});

	const { form: formData, enhance, delayed } = form;
</script>

<div class="mx-auto w-full min-w-0">
	<PageHeader.Root>
		<PageHeader.Heading>
			<PageHeader.Title>Edit company</PageHeader.Title>
		</PageHeader.Heading>
	</PageHeader.Root>

	<Form.PendingAlert pending={data.pending} />

	<form method="POST" class="flex max-w-lg flex-col gap-4" action="?/edit" use:enhance>
		<Form.Field {form} name="orgNum">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Org. number</Form.Label>
					<Input {...props} bind:value={$formData.orgNum} />
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

		<Form.Field {form} name="email">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Email</Form.Label>
					<Input {...props} bind:value={$formData.email} />
				{/snippet}
			</Form.Control>
			<Form.Description>Note: company invoices are sent to this email</Form.Description>
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

		<div class="h-[1px]"></div>

		<Form.Fieldset {form} name="invoiceDefaultTo">
			<Form.Legend>By default, include invoice categories in:</Form.Legend>
			<RadioGroup.Root
				bind:value={$formData.invoiceDefaultTo}
				class="flex flex-col space-y-1"
				name="invoiceDefaultTo"
			>
				<div class="flex items-center space-x-3 space-y-0">
					<Form.Control>
						{#snippet children({ props })}
							<RadioGroup.Item {...props} value="personal" />
							<Form.Label class="font-normal">Personal invoice</Form.Label>
						{/snippet}
					</Form.Control>
				</div>
				<div class="flex items-center space-x-3 space-y-0">
					<Form.Control>
						{#snippet children({ props })}
							<RadioGroup.Item {...props} value="company" />
							<Form.Label class="font-normal">Company invoice</Form.Label>
						{/snippet}
					</Form.Control>
				</div>
			</RadioGroup.Root>
		</Form.Fieldset>

		<div class="h-[1px]"></div>

		<Form.Field {form} name="invoiceExcludeCategoriesFromDefault">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>
						Invoice categories to exclude from <strong>{$formData.invoiceDefaultTo}</strong> invoice:
					</Form.Label>
					<Select.Root
						type="multiple"
						bind:value={$formData.invoiceExcludeCategoriesFromDefault}
						name={props.name}
					>
						{#each $formData.invoiceExcludeCategoriesFromDefault as invoiceCategory}
							<input name={props.name} hidden value={invoiceCategory} />
						{/each}
						<Select.Trigger {...props}>
							{$formData.invoiceExcludeCategoriesFromDefault.length
								? $formData.invoiceExcludeCategoriesFromDefault.join(', ')
								: 'Select categories'}
						</Select.Trigger>
						<Select.Content>
							{#each InvoiceCategoryTypes.options as option}
								<Select.Item value={option} label={option} />
							{/each}
						</Select.Content>
					</Select.Root>
					<Form.FieldErrors />
				{/snippet}
			</Form.Control>
		</Form.Field>

		<Form.SubmitButton {delayed} label="Submit change request" />
	</form>

	<form method="POST" class="mt-6 flex max-w-lg flex-col gap-4" action="?/delete">
		<Form.SubmitButton {delayed} label="Delete company" variant="destructive" separator={false} />
	</form>
</div>
