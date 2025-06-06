<script lang="ts">
	import * as PageHeader from '$lib/components/page-header/index.js';
	import { appendPossessive } from '$lib/utils/member.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { iceContactsFormSchema, type IceContactsFormSchema } from './schema.js';
	import type { Member } from '$lib/types/members.js';

	interface Props {
		data: {
			form: SuperValidated<Infer<IceContactsFormSchema>>;
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
		validators: zodClient(iceContactsFormSchema),
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
			<PageHeader.Title
				>Redigera {appendPossessive(data.member.name)} ICE-kontakter</PageHeader.Title
			>
			<PageHeader.Description>In Case of Emergency-kontakter.</PageHeader.Description>
		</PageHeader.Heading>
	</PageHeader.Root>

	<Form.PendingAlert pending={data.pending} />

	<form method="POST" class="flex max-w-lg flex-col gap-4" use:enhance>
		<Form.Fieldset {form} name="iceContacts">
			<Form.Legend class="text-xl">ICE-kontakter.</Form.Legend>
			{#if $formData.iceContacts.length > 0}
				<div class="flex flex-col gap-4">
					{#each Array.from(Array($formData.iceContacts.length).keys()) as i (i)}
						<div class="border-muted rounded-md border p-4">
							<Form.Legend class="text-lg">Kontakt #{i + 1}</Form.Legend>

							<div class="mt-4 flex flex-col gap-4">
								<Form.ElementField {form} name="iceContacts[{i}].name">
									<Form.Control>
										{#snippet children({ props })}
											<Form.Label>Namn</Form.Label>
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
											<Form.Label>Telefonnummer</Form.Label>
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
									Ta bort ICE-kontakt #{i + 1}
								</Button>
							</div>
						</div>
					{/each}
				</div>
				<Form.FieldErrors />
			{/if}

			<Button type="button" variant="secondary" class="w-full" onclick={addIceContact}>
				Lägg till ny ICE-kontakt
			</Button>
		</Form.Fieldset>

		<Form.SubmitButton {delayed} label="Skicka förslag på ändring" />
	</form>
</div>
