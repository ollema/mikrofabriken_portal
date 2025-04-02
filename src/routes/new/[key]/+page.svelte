<script lang="ts">
	import * as PageHeader from '$lib/components/page-header/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Checkbox } from '$lib/components/ui/checkbox/index.js';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { newMemberFormSchema, type NewMemberFormSchema } from './schema.js';
	import type { Member } from '$lib/types/members.js';

	interface Props {
		data: {
			form: SuperValidated<Infer<NewMemberFormSchema>>;
			member: Member;
			validWorkPools: string[];
			workPoolNameMapping: Record<string, string>;
			workPoolDescriptionMapping: Record<string, string>;
		};
	}

	let { data }: Props = $props();

	const form = superForm(data.form, {
		validators: zodClient(newMemberFormSchema),
		dataType: 'json'
	});

	const { form: formData, enhance, delayed } = form;
</script>

<div class="mx-auto w-full min-w-0">
	<PageHeader.Root>
		<PageHeader.Heading>
			<PageHeader.Title>Välkommen till mikrofabriken!</PageHeader.Title>
		</PageHeader.Heading>
	</PageHeader.Root>

	<form method="POST" class="flex max-w-lg flex-col gap-4" use:enhance>
		<Form.Field {form} name="crNumber">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Personnummer</Form.Label>
					<Input {...props} bind:value={$formData.crNumber} />
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="slackID">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Slack ID</Form.Label>
					<Input
						{...props}
						bind:value={$formData.slackID}
						readonly
						class="cursor-not-allowed text-muted-foreground"
					/>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="name">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Namn</Form.Label>
					<Input {...props} bind:value={$formData.name} />
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="postalAdress">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Adress</Form.Label>
					<Input {...props} bind:value={$formData.postalAdress} />
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="postalCode">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Postnummer</Form.Label>
					<Input {...props} bind:value={$formData.postalCode} />
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="postalCity">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Ort</Form.Label>
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
					<Form.Label>Telefonnummer</Form.Label>
					<Input {...props} bind:value={$formData.phone} placeholder="0712345678" />
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="investment">
			<Form.Control>
				{#snippet children({ props })}
					<Checkbox {...props} bind:checked={$formData.investment} disabled />
					<Form.Label>Vill teckna insats</Form.Label>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="rfidCode">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>RFID-kod (fyrsiffrig)</Form.Label>
					<Input {...props} bind:value={$formData.rfidCode} />
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="rfidData">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>RFID-data</Form.Label>
					<Input
						{...props}
						bind:value={$formData.rfidData}
						readonly
						class="cursor-not-allowed text-muted-foreground"
					/>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Fieldset {form} name="workPools">
			<Form.Legend class="text-xl">Vilka arbetspooler vill du vara med i?</Form.Legend>
			<div class="flex flex-col gap-4">
				{#each data.validWorkPools.sort( (a, b) => data.workPoolNameMapping[a].localeCompare(data.workPoolNameMapping[b]) ) as pool (pool)}
					<div class="center flex items-start gap-2">
						<Checkbox
							id={pool}
							name="workPools"
							class="mt-1"
							value={pool}
							checked={$formData.workPools.includes(pool)}
							onCheckedChange={(checked) => {
								if (checked) {
									$formData.workPools = [...$formData.workPools, pool];
								} else {
									$formData.workPools = $formData.workPools.filter((p) => p !== pool);
								}
							}}
						/>
						<div class="flex flex-col">
							<label for={pool}>{data.workPoolNameMapping[pool]}</label>
							<Form.Description>{data.workPoolDescriptionMapping[pool]}</Form.Description>
						</div>
					</div>
				{/each}
			</div>
			<Form.FieldErrors />
		</Form.Fieldset>

		<Form.SubmitButton {delayed} label="Submit change request" />
	</form>
</div>
