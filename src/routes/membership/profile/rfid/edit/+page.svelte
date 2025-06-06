<script lang="ts">
	import * as PageHeader from '$lib/components/page-header/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { getLocalTimeZone, today } from '@internationalized/date';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { rfidTagsFormSchema, type RfidTagsFormSchema } from './schema.js';
	import type { Member } from '$lib/types/members.js';

	interface Props {
		data: {
			form: SuperValidated<Infer<RfidTagsFormSchema>>;
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
		validators: zodClient(rfidTagsFormSchema),
		dataType: 'json'
	});

	const { form: formData, enhance, delayed } = form;

	function addRFIDTag() {
		$formData.rfidTags = [
			...$formData.rfidTags,
			{
				startDate: today(getLocalTimeZone()).toString(),
				endDate: undefined,
				data: '',
				codeHash: ''
			}
		];
	}

	function removeRFIDTag(index: number) {
		$formData.rfidTags = $formData.rfidTags.filter((_, i) => i !== index);
	}
</script>

<div class="mx-auto w-full min-w-0">
	<PageHeader.Root>
		<PageHeader.Heading>
			<PageHeader.Title>Redigera RFID-taggar</PageHeader.Title>
		</PageHeader.Heading>
	</PageHeader.Root>

	<Form.PendingAlert pending={data.pending} />

	<form method="POST" class="flex max-w-lg flex-col gap-4" use:enhance>
		<Form.Fieldset {form} name="rfidTags">
			{#if $formData.rfidTags.length > 0}
				<div class="flex flex-col gap-4">
					{#each Array.from(Array($formData.rfidTags.length).keys()) as i (i)}
						<div class="border-muted rounded-md border p-4">
							<Form.Legend class="text-lg">RFID-tagg #{i + 1}</Form.Legend>

							<Form.Status endDate={$formData.rfidTags[i].endDate} />

							<div class="flex flex-col gap-4">
								<Form.CalendarField
									{form}
									name="rfidTags[{i}].startDate"
									label="Start"
									bind:date={$formData.rfidTags[i].startDate}
								/>

								<Form.CalendarField
									{form}
									name="rfidTags[{i}].endDate"
									label="Slut"
									bind:date={$formData.rfidTags[i].endDate}
								/>

								<Form.ElementField {form} name="rfidTags[{i}].data">
									<Form.Control>
										{#snippet children({ props })}
											<Form.Label>Data</Form.Label>
											<Input
												type="text"
												class="w-full"
												{...props}
												bind:value={$formData.rfidTags[i].data}
											/>
										{/snippet}
									</Form.Control>
								</Form.ElementField>

								<Form.CodeHashField
									{form}
									name="rfidTags[{i}].codeHash"
									rfidData={$formData.rfidTags[i].data}
									bind:rfidCodeHash={$formData.rfidTags[i].codeHash}
								/>

								<Button
									type="button"
									variant="destructive"
									class="w-full hover:border-red-900"
									onclick={() => removeRFIDTag(i)}
								>
									Ta bort RFID-tagg #{i + 1}
								</Button>
							</div>
						</div>
					{/each}
				</div>
				<Form.FieldErrors />
			{/if}

			<Button type="button" variant="secondary" class="w-full" onclick={addRFIDTag}>
				Lägg till ny RFID-tag
			</Button>
		</Form.Fieldset>

		<Form.SubmitButton {delayed} label="Skicka förslag på ändring" />
	</form>
</div>
