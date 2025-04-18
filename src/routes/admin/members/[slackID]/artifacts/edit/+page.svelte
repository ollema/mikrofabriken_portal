<script lang="ts">
	import * as PageHeader from '$lib/components/page-header/index.js';
	import { appendPossessive } from '$lib/utils/member.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { getLocalTimeZone, today } from '@internationalized/date';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { artifactsFormSchema, type ArtifactsFormSchema } from './schema.js';
	import type { Member } from '$lib/types/members.js';

	interface Props {
		data: {
			form: SuperValidated<Infer<ArtifactsFormSchema>>;
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
		validators: zodClient(artifactsFormSchema),
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

	function addKey() {
		$formData.keys = [
			...$formData.keys,
			{
				startDate: today(getLocalTimeZone()).toString(),
				endDate: undefined,
				number: 0
			}
		];
	}

	function removeKey(index: number) {
		$formData.keys = $formData.keys.filter((_, i) => i !== index);
	}
</script>

<div class="mx-auto w-full min-w-0">
	<PageHeader.Root>
		<PageHeader.Heading>
			<PageHeader.Title
				>Redigera {appendPossessive(data.member.name)} RFID-taggar & nycklar</PageHeader.Title
			>
		</PageHeader.Heading>
	</PageHeader.Root>

	<Form.PendingAlert pending={data.pending} />

	<form method="POST" class="flex max-w-lg flex-col gap-4" use:enhance>
		<Form.Fieldset {form} name="rfidTags">
			<Form.Legend class="text-xl">RFID-taggar</Form.Legend>
			{#if $formData.rfidTags.length > 0}
				<div class="flex flex-col gap-4">
					{#each Array.from(Array($formData.rfidTags.length).keys()) as i (i)}
						<div class="rounded-md border border-muted p-4">
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
				Lägg till ny RFID-tagg
			</Button>
		</Form.Fieldset>

		<Form.Fieldset {form} name="keys">
			<Form.Legend class="text-xl">Nycklar</Form.Legend>
			{#if $formData.keys.length > 0}
				<div class="flex flex-col gap-4">
					{#each Array.from(Array($formData.keys.length).keys()) as i (i)}
						<div class="rounded-md border border-muted p-4">
							<Form.Legend class="text-lg">Nyckel #{i + 1}</Form.Legend>

							<Form.Status endDate={$formData.keys[i].endDate} />

							<div class="flex flex-col gap-4">
								<Form.CalendarField
									{form}
									name="keys[{i}].startDate"
									label="Start"
									bind:date={$formData.keys[i].startDate}
								/>

								<Form.CalendarField
									{form}
									name="keys[{i}].endDate"
									label="Slut"
									bind:date={$formData.keys[i].endDate}
								/>

								<Form.ElementField {form} name="keys[{i}].number">
									<Form.Control>
										{#snippet children({ props })}
											<Form.Label>Nyckelnummer</Form.Label>
											<Input
												type="number"
												min="0"
												max="20"
												step="1"
												class="w-full"
												{...props}
												bind:value={$formData.keys[i].number}
											/>
										{/snippet}
									</Form.Control>
									<Form.Description class="text-xs">
										<div>Numret på nyckeln.</div>
										<div>Ska inte blandas ihop med numreringen i det här formuläret.</div>
									</Form.Description>
								</Form.ElementField>

								<Button
									type="button"
									variant="destructive"
									class="w-full hover:border-red-900"
									onclick={() => removeKey(i)}
								>
									Ta bort nyckel #{i + 1}
								</Button>
							</div>
						</div>
					{/each}
				</div>
				<Form.FieldErrors />
			{/if}
			<Button type="button" variant="secondary" class="w-full" onclick={addKey}
				>Lägg till ny nyckel</Button
			>
		</Form.Fieldset>

		<Form.SubmitButton {delayed} label="Skicka förslag på ändring" />
	</form>
</div>
