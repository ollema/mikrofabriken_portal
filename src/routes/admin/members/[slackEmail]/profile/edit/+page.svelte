<script lang="ts">
	import * as PageHeader from '$lib/components/page-header/index.js';
	import { appendPossessive } from '$lib/utils/member.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { profileFormSchema, type ProfileFormSchema } from './schema.js';
	import type { Member } from '$lib/types/members';

	interface Props {
		data: {
			form: SuperValidated<Infer<ProfileFormSchema>>;
			pending: {
				member: Member | undefined;
				link: string | undefined;
				sourceBranch: string | undefined;
			};
			member: Member;
		};
	}

	let { data }: Props = $props();

	const form = superForm(data.form, {
		validators: zodClient(profileFormSchema),
		dataType: 'json'
	});

	const { form: formData, enhance, delayed } = form;

	function addIceContact() {
		$formData.iceContacts = [
			// @ts-expect-error ignore the undefined type for now
			...$formData.iceContacts,
			{
				// @ts-expect-error ignore the undefined type for now
				name: undefined,
				// @ts-expect-error ignore the undefined type for now
				phone: undefined
			}
		];
	}

	function removeIceContact(index: number) {
		$formData.iceContacts = $formData.iceContacts.filter((_, i) => i !== index);
	}
</script>

<div class="mx-auto w-full min-w-0">
	<PageHeader.Root>
		<PageHeader.Heading>
			<PageHeader.Title>Edit {appendPossessive(data.member.name)} profile</PageHeader.Title>
		</PageHeader.Heading>
	</PageHeader.Root>

	<Form.PendingAlert pending={data.pending} />

	<form method="POST" class="flex max-w-lg flex-col gap-4" use:enhance>
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

		<Form.Fieldset {form} name="iceContacts">
			<Form.Legend class="text-sm">ICE contacts</Form.Legend>
			{#if $formData.iceContacts.length > 0}
				<div class="flex flex-col gap-4">
					{#each Array.from(Array($formData.iceContacts.length).keys()) as i}
						<div class="rounded-md border border-muted p-4">
							<Form.Legend class="text-sm">Contact #{i + 1}</Form.Legend>

							<div class="mt-4 flex flex-col gap-4">
								<Form.ElementField {form} name="iceContacts[{i}].name">
									<Form.Control>
										{#snippet children({ props })}
											<Form.Label>Name</Form.Label>
											<Input
												type="text"
												class="w-full"
												{...props}
												bind:value={$formData.iceContacts[i].name}
											/>
										{/snippet}
									</Form.Control>
								</Form.ElementField>

								<Form.ElementField {form} name="iceContacts[{i}].phone">
									<Form.Control>
										{#snippet children({ props })}
											<Form.Label>Phone</Form.Label>
											<Input
												type="text"
												class="w-full"
												{...props}
												bind:value={$formData.iceContacts[i].phone}
											/>
										{/snippet}
									</Form.Control>
								</Form.ElementField>

								<Button
									type="button"
									variant="destructive"
									class="w-full hover:border-red-900"
									onclick={() => removeIceContact(i)}
								>
									Remove ICE contact #{i + 1}
								</Button>
							</div>
						</div>
					{/each}
				</div>
				<Form.FieldErrors />
			{/if}

			<Button type="button" variant="secondary" class="w-full" onclick={addIceContact}>
				Add new ICE contact
			</Button>
		</Form.Fieldset>

		<Form.SubmitButton {delayed} label="Submit change request" />
	</form>
</div>
