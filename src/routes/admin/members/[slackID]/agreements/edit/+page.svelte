<script lang="ts">
	import * as PageHeader from '$lib/components/page-header/index.js';
	import { appendPossessive } from '$lib/utils/member.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import * as RadioGroup from '$lib/components/ui/radio-group/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import Trash2 from 'lucide-svelte/icons/trash-2';
	import { getLocalTimeZone, today } from '@internationalized/date';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { agreementsFormSchema, type AgreementsFormSchema } from './schema.js';
	import type { Member } from '$lib/types/members.js';

	interface Props {
		data: {
			form: SuperValidated<Infer<AgreementsFormSchema>>;
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
		validators: zodClient(agreementsFormSchema),
		dataType: 'json'
	});

	const { form: formData, enhance, delayed } = form;

	function addMembership() {
		$formData.memberships = [
			...$formData.memberships,
			{
				type: 'membership',
				startDate: today(getLocalTimeZone()).toString(),
				endDate: undefined
			}
		];
	}

	function removeMembership(index: number) {
		$formData.memberships = $formData.memberships.filter((_, i) => i !== index);
	}

	function addAsylum() {
		$formData.asylums = [
			...$formData.asylums,
			{
				type: 'asylumInside',
				startDate: today(getLocalTimeZone()).toString(),
				endDate: undefined,
				size: 0
			}
		];
	}

	function removeAsylum(index: number) {
		$formData.asylums = $formData.asylums.filter((_, i) => i !== index);
	}

	function addPallet() {
		$formData.pallets = [
			...$formData.pallets,
			{
				type: 'palletInside',
				startDate: today(getLocalTimeZone()).toString(),
				endDate: undefined,
				palletCount: 0,
				palletIds: []
			}
		];
	}

	function removePallet(index: number) {
		$formData.pallets = $formData.pallets.filter((_, i) => i !== index);
	}

	function addPalletId(index: number) {
		$formData.pallets[index].palletIds = [...$formData.pallets[index].palletIds, 0];
		$formData.pallets[index].palletCount = $formData.pallets[index].palletIds.length;
	}

	function removePalletId(index: number, idIndex: number) {
		$formData.pallets[index].palletIds = $formData.pallets[index].palletIds.filter(
			(_, i) => i !== idIndex
		);
	}
</script>

<div class="mx-auto w-full min-w-0">
	<PageHeader.Root>
		<PageHeader.Heading>
			<PageHeader.Title>Redigera {appendPossessive(data.member.name)} avtal</PageHeader.Title>
		</PageHeader.Heading>
	</PageHeader.Root>

	<Form.PendingAlert pending={data.pending} />

	<form method="POST" class="flex max-w-lg flex-col gap-4" use:enhance>
		<Form.Fieldset {form} name="memberships">
			<Form.Legend class="text-xl">Medlemsavtal</Form.Legend>
			{#if $formData.memberships.length > 0}
				<div class="flex flex-col gap-4">
					{#each Array.from(Array($formData.memberships.length).keys()) as i (i)}
						<div class="rounded-md border border-muted p-4">
							<Form.Legend class="text-lg">Avtal #{i + 1}</Form.Legend>

							<Form.Status endDate={$formData.memberships[i].endDate} />

							<div class="flex flex-col gap-4">
								<Form.ElementField {form} name="memberships[{i}].type">
									<Form.Fieldset {form} name="memberships[{i}].type" class="space-y-3">
										<Form.Legend>Avtalstyp</Form.Legend>
										<RadioGroup.Root
											bind:value={$formData.memberships[i].type}
											class="flex flex-col space-y-1"
											name="type"
										>
											<div class="flex items-center space-x-3 space-y-0">
												<Form.Control>
													{#snippet children({ props })}
														<RadioGroup.Item value="membership" {...props} />
														<Form.Label class="font-normal">Medlemskap</Form.Label>
													{/snippet}
												</Form.Control>
											</div>
											<div class="flex items-center space-x-3 space-y-0">
												<Form.Control>
													{#snippet children({ props })}
														<RadioGroup.Item value="investment" {...props} />
														<Form.Label class="font-normal">Investering</Form.Label>
													{/snippet}
												</Form.Control>
											</div>
											<div class="flex items-center space-x-3 space-y-0">
												<Form.Control>
													{#snippet children({ props })}
														<RadioGroup.Item value="passive" {...props} />
														<Form.Label class="font-normal">Passivt medlemskap</Form.Label>
													{/snippet}
												</Form.Control>
											</div>
										</RadioGroup.Root>
										<Form.FieldErrors />
									</Form.Fieldset>
								</Form.ElementField>

								<Form.CalendarField
									{form}
									name="memberships[{i}].startDate"
									label="Start"
									bind:date={$formData.memberships[i].startDate}
									showStartButtons
								/>

								<Form.CalendarField
									{form}
									name="memberships[{i}].endDate"
									label="Slut"
									bind:date={$formData.memberships[i].endDate}
									showEndButtons
								/>

								<Button
									type="button"
									variant="destructive"
									class="w-full hover:border-red-900"
									onclick={() => removeMembership(i)}
								>
									Ta bort avtal #{i + 1}
								</Button>
							</div>
						</div>
					{/each}
				</div>
				<Form.FieldErrors />
			{/if}

			<Button type="button" variant="secondary" class="w-full" onclick={addMembership}>
				Lägg till nytt medlemsavtal
			</Button>
		</Form.Fieldset>

		<Form.Fieldset {form} name="asylums">
			<Form.Legend class="text-xl">Asylumavtal</Form.Legend>
			{#if $formData.asylums.length > 0}
				<div class="flex flex-col gap-4">
					{#each Array.from(Array($formData.asylums.length).keys()) as i (i)}
						<div class="rounded-md border border-muted p-4">
							<Form.Legend class="text-lg">Avtal #{i + 1}</Form.Legend>

							<Form.Status endDate={$formData.asylums[i].endDate} />

							<div class="flex flex-col gap-4">
								<Form.ElementField {form} name="asylums[{i}].type">
									<Form.Fieldset {form} name="asylums[{i}].type" class="space-y-3">
										<Form.Legend>Avtalstyp</Form.Legend>
										<RadioGroup.Root
											bind:value={$formData.asylums[i].type}
											class="flex flex-col space-y-1"
											name="type"
										>
											<div class="flex items-center space-x-3 space-y-0">
												<Form.Control>
													{#snippet children({ props })}
														<RadioGroup.Item value="asylumInside" {...props} />
														<Form.Label class="font-normal">Inne</Form.Label>
													{/snippet}
												</Form.Control>
											</div>
											<div class="flex items-center space-x-3 space-y-0">
												<Form.Control>
													{#snippet children({ props })}
														<RadioGroup.Item value="asylumOutside" {...props} />
														<Form.Label class="font-normal">Ute</Form.Label>
													{/snippet}
												</Form.Control>
											</div>
										</RadioGroup.Root>
										<Form.FieldErrors />
									</Form.Fieldset>
								</Form.ElementField>

								<Form.CalendarField
									{form}
									name="asylums[{i}].startDate"
									label="Start"
									bind:date={$formData.asylums[i].startDate}
								/>

								<Form.CalendarField
									{form}
									name="asylums[{i}].endDate"
									label="Slut"
									bind:date={$formData.asylums[i].endDate}
								/>

								<Form.ElementField {form} name="asylums[{i}].size">
									<Form.Control>
										{#snippet children({ props })}
											<Form.Label>Storlek (i kvadratmeter)</Form.Label>
											<Input
												type="number"
												min="0"
												max="100"
												step="1"
												class="w-full"
												{...props}
												bind:value={$formData.asylums[i].size}
											/>
										{/snippet}
									</Form.Control>
								</Form.ElementField>

								<Button
									type="button"
									variant="destructive"
									class="w-full hover:border-red-900"
									onclick={() => removeAsylum(i)}
								>
									Ta bort avtal #{i + 1}
								</Button>
							</div>
						</div>
					{/each}
				</div>
				<Form.FieldErrors />
			{/if}

			<Button type="button" variant="secondary" class="w-full" onclick={addAsylum}>
				Lägg till nytt asylumavtal
			</Button>
		</Form.Fieldset>

		<Form.Fieldset {form} name="pallets">
			<Form.Legend class="text-xl">Pallplatsavtal</Form.Legend>
			{#if $formData.pallets.length > 0}
				<div class="flex flex-col gap-4">
					{#each Array.from(Array($formData.pallets.length).keys()) as i (i)}
						<div class="rounded-md border border-muted p-4">
							<Form.Legend class="text-lg">Avtal #{i + 1}</Form.Legend>

							<Form.Status endDate={$formData.pallets[i].endDate} />

							<div class="flex flex-col gap-4">
								<Form.ElementField {form} name="pallets[{i}].type">
									<Form.Fieldset {form} name="pallets[{i}].type" class="space-y-3">
										<Form.Legend>Avtalstyp</Form.Legend>
										<RadioGroup.Root
											bind:value={$formData.pallets[i].type}
											class="flex flex-col space-y-1"
											name="type"
										>
											<div class="flex items-center space-x-3 space-y-0">
												<Form.Control>
													{#snippet children({ props })}
														<RadioGroup.Item value="palletInside" {...props} />
														<Form.Label class="font-normal">Inne</Form.Label>
													{/snippet}
												</Form.Control>
											</div>
											<div class="flex items-center space-x-3 space-y-0">
												<Form.Control>
													{#snippet children({ props })}
														<RadioGroup.Item value="palletOutside" {...props} />
														<Form.Label class="font-normal">Ute</Form.Label>
													{/snippet}
												</Form.Control>
											</div>
										</RadioGroup.Root>
										<Form.FieldErrors />
									</Form.Fieldset>
								</Form.ElementField>

								<Form.CalendarField
									{form}
									name="pallets[{i}].startDate"
									label="Start"
									bind:date={$formData.pallets[i].startDate}
								/>

								<Form.CalendarField
									{form}
									name="pallets[{i}].endDate"
									label="Slut"
									bind:date={$formData.pallets[i].endDate}
								/>

								<Form.ElementField {form} name="pallets[{i}].palletCount">
									<Form.Control>
										{#snippet children({ props })}
											<Form.Label>Antal pallplatser</Form.Label>
											<Input
												type="number"
												class="w-full cursor-default cursor-not-allowed text-muted-foreground"
												{...props}
												bind:value={$formData.pallets[i].palletCount}
												readonly
											/>
										{/snippet}
									</Form.Control>
									<Form.Description>Räknas ut från pall-IDs nedan</Form.Description>
								</Form.ElementField>

								{#if $formData.pallets[i].palletIds.length > 0}
									<div class="flex flex-col gap-4">
										<Form.Legend>Pall-IDs</Form.Legend>
										{#each Array.from(Array($formData.pallets[i].palletIds.length).keys()) as idIndex (idIndex)}
											<div class="flex flex-col gap-4">
												<Form.ElementField {form} name="pallets[{i}].palletIds[{idIndex}]">
													<Form.Control>
														{#snippet children({ props })}
															<div class="flex items-center space-x-3 space-y-0">
																<Input
																	type="number"
																	min="0"
																	max="100"
																	step="1"
																	class="flex-0 w-full"
																	{...props}
																	bind:value={$formData.pallets[i].palletIds[idIndex]}
																/>
																<Button
																	type="button"
																	variant="destructive"
																	size="icon"
																	class=" w-12 hover:border-red-900"
																	onclick={() => removePalletId(i, idIndex)}
																>
																	<Trash2 />
																</Button>
															</div>
														{/snippet}
													</Form.Control>
												</Form.ElementField>
											</div>
										{/each}
									</div>
								{/if}

								<Button
									type="button"
									variant="secondary"
									class="w-full"
									onclick={() => addPalletId(i)}
								>
									Lägg till nytt pall-ID
								</Button>

								<Button
									type="button"
									variant="destructive"
									class="w-full hover:border-red-900"
									onclick={() => removePallet(i)}
								>
									Ta bort avtal #{i + 1}
								</Button>
							</div>
						</div>
					{/each}
				</div>
				<Form.FieldErrors />
			{/if}

			<Button type="button" variant="secondary" class="w-full" onclick={addPallet}>
				Lögg till nytt pallplatsavtal
			</Button>
		</Form.Fieldset>

		<Form.SubmitButton {delayed} label="Skicka förslag på ändring" />
	</form>
</div>
