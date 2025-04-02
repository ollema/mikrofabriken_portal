<script lang="ts">
	import * as PageHeader from '$lib/components/page-header/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import * as RadioGroup from '$lib/components/ui/radio-group/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { productFormSchema, type ProductFormSchema } from './schema.js';
	import { generateEAN13 } from '$lib/utils/barcode.js';

	interface Props {
		data: {
			form: SuperValidated<Infer<ProductFormSchema>>;
			productCategories: string[];
			billingCategories: string[];
			// TODO: should not be nullable
			unitNames: (string | null)[];
			vatPercentages: number[];
		};
	}

	let { data }: Props = $props();

	const form = superForm(data.form, {
		validators: zodClient(productFormSchema),
		dataType: 'json'
	});

	const { form: formData, enhance, delayed } = form;

	function generateBarcode() {
		try {
			const barcode = generateEAN13();
			$formData.ean = barcode;
		} catch (e) {
			console.error(e);
		}
	}
</script>

<div class="mx-auto w-full min-w-0">
	<PageHeader.Root>
		<PageHeader.Heading>
			<PageHeader.Title>Edit product</PageHeader.Title>
		</PageHeader.Heading>
	</PageHeader.Root>

	<form method="POST" class="flex max-w-lg flex-col gap-4" use:enhance>
		<Form.Field {form} name="name">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Name</Form.Label>
					<Input {...props} bind:value={$formData.name} placeholder="Product name" />
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="category">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Category</Form.Label>
					<Select.Root type="single" bind:value={$formData.category} name={props.name}>
						<Select.Trigger {...props}>
							{$formData.category ?? 'Select category'}
						</Select.Trigger>
						<Select.Content>
							{#each data.productCategories as category (category)}
								<Select.Item value={category} label={category} />
							{/each}
						</Select.Content>
					</Select.Root>
					<input hidden bind:value={$formData.category} name={props.name} />
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="details">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Details</Form.Label>
					<Form.Description>
						Optional description, for example packaging, amount, dimensions...
					</Form.Description>
					<Input
						{...props}
						bind:value={$formData.details}
						placeholder="100 ml or 25 g or 1200x800 mm"
					/>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="pricePerUnit">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Price per Unit</Form.Label>
					<Form.Description>SEK including VAT</Form.Description>
					<Input {...props} bind:value={$formData.pricePerUnit} />
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Fieldset {form} name="vat" class="">
			<Form.Legend class="mb-2 pt-2">VAT</Form.Legend>
			<RadioGroup.Root
				class="flex flex-col space-y-1"
				name="vat"
				value={$formData.vat.toString()}
				onValueChange={(value) => {
					$formData.vat = parseInt(value);
				}}
			>
				{#each data.vatPercentages as vatPercentage (vatPercentage)}
					<div class="flex items-center space-x-3 pl-2">
						<Form.Control>
							{#snippet children({ props })}
								<RadioGroup.Item value={vatPercentage.toString()} {...props} />
								<Form.Label class="font-normal">{vatPercentage.toString()}%</Form.Label>
							{/snippet}
						</Form.Control>
					</div>
				{/each}
			</RadioGroup.Root>
			<Form.FieldErrors />
		</Form.Fieldset>

		<Form.Field {form} name="ean">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>EAN barcode</Form.Label>
					<Form.Description>Optional (but recommended) EAN-8 or EAN-13 barcode.</Form.Description>
					<Input
						{...props}
						bind:value={$formData.ean}
						placeholder="e.g. 12345678 or 1234567891011"
					/>
					<Button variant="outline" class="w-full" onclick={generateBarcode}>
						Generate random barcode
					</Button>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Fieldset {form} name="unitType" class="">
			<Form.Legend class="mb-2 pt-2">Unit Type</Form.Legend>
			<RadioGroup.Root
				bind:value={$formData.unitType}
				class="flex flex-col space-y-1"
				name="unitType"
			>
				<div class="flex items-center space-x-3 pl-2">
					<Form.Control>
						{#snippet children({ props })}
							<RadioGroup.Item value="Integer" {...props} />
							<Form.Label class="font-normal">Integer</Form.Label>
						{/snippet}
					</Form.Control>
				</div>
				<div class="flex items-center space-x-3 pl-2">
					<Form.Control>
						{#snippet children({ props })}
							<RadioGroup.Item value="Real" {...props} />
							<Form.Label class="font-normal">Real</Form.Label>
						{/snippet}
					</Form.Control>
				</div>
			</RadioGroup.Root>
			<Form.FieldErrors />
		</Form.Fieldset>

		<Form.Fieldset {form} name="unitName" class="">
			<Form.Legend class="mb-2 pt-2">Unit Name</Form.Legend>
			<RadioGroup.Root
				class="flex flex-col space-y-1"
				bind:value={$formData.unitName!}
				name="unitName"
			>
				{#each data.unitNames as unitName (unitName)}
					{#if unitName !== null}
						<div class="flex items-center space-x-3 pl-2">
							<Form.Control>
								{#snippet children({ props })}
									<RadioGroup.Item value={unitName} {...props} />
									<Form.Label class="font-normal">{unitName}</Form.Label>
								{/snippet}
							</Form.Control>
						</div>
					{/if}
				{/each}
			</RadioGroup.Root>
			<Form.FieldErrors />
		</Form.Fieldset>

		<Form.Fieldset {form} name="billingCategory" class="">
			<Form.Legend class="mb-2 pt-2">Billing category</Form.Legend>
			<RadioGroup.Root
				class="flex flex-col space-y-1"
				name="billingCategory"
				bind:value={$formData.billingCategory}
			>
				{#each data.billingCategories as billingCategory (billingCategory)}
					<div class="flex items-center space-x-3 pl-2">
						<Form.Control>
							{#snippet children({ props })}
								<RadioGroup.Item value={billingCategory} {...props} />
								<Form.Label class="font-normal">{billingCategory}</Form.Label>
							{/snippet}
						</Form.Control>
					</div>
				{/each}
			</RadioGroup.Root>
			<Form.FieldErrors />
		</Form.Fieldset>

		<Form.Field {form} name="sellerId">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Seller ID</Form.Label>
					<Form.Description>Optional</Form.Description>
					<Input {...props} bind:value={$formData.sellerId} />
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.SubmitButton {delayed} label="Edit product" />
	</form>
</div>
