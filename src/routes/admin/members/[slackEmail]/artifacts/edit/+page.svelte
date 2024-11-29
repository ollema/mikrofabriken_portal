<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import * as InputOTP from '$lib/components/ui/input-otp/index.js';
	import { REGEXP_ONLY_DIGITS } from 'bits-ui';
	import CalendarIcon from 'lucide-svelte/icons/calendar';
	import { cn } from '$lib/utils';
	import {
		CalendarDate,
		DateFormatter,
		type DateValue,
		getLocalTimeZone,
		parseDate,
		today
	} from '@internationalized/date';
	import SuperDebug, { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { artifactsFormSchema, type ArtifactsFormSchema } from '$lib/schemas/members';

	interface Props {
		data: { form: SuperValidated<Infer<ArtifactsFormSchema>> };
	}

	let { data }: Props = $props();

	const form = superForm(data.form, {
		validators: zodClient(artifactsFormSchema),
		dataType: 'json'
	});

	const { form: formData, enhance } = form;

	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});

	let startDateValues = $state<(DateValue | undefined)[]>([]);
	let endDateValues = $state<(DateValue | undefined)[]>([]);

	$effect(() => {
		startDateValues = $formData.rfidTags.map((artifact) => {
			return artifact.startDate ? parseDate(artifact.startDate) : undefined;
		});
	});

	$effect(() => {
		endDateValues = $formData.rfidTags.map((artifact) => {
			return artifact.endDate ? parseDate(artifact.endDate) : undefined;
		});
	});

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

	async function generateSHA1(message: string) {
		const msgBuffer = new TextEncoder().encode(message);
		const hashBuffer = await crypto.subtle.digest('SHA-1', msgBuffer);
		const hashArray = Array.from(new Uint8Array(hashBuffer));
		const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

		return hashHex;
	}

	async function generateCodeHash(code: string, index: number) {
		const codeHash = await generateSHA1($formData.rfidTags[index].data + code);
		$formData.rfidTags[index].codeHash = codeHash;
	}
</script>

<SuperDebug data={$formData} />

<form method="POST" class="max-w-md" use:enhance>
	<Form.Fieldset {form} name="rfidTags" class="mt-4">
		<Form.Legend class="py-2 text-xl">RFID-tags</Form.Legend>
		<div class="flex flex-col gap-4">
			{#each Array.from(Array($formData.rfidTags.length).keys()) as i}
				<div class="rounded-md border border-muted p-4">
					<Form.Legend class="mb-2 text-lg">RFID-tag #{i + 1}</Form.Legend>
					<div class="mb-2">
						Status:
						{#if $formData.rfidTags[i].endDate}
							<span class="text-neutral-500">Inactive</span>
						{:else}
							<span class="text-green-500">Active</span>
						{/if}
					</div>
					<div class="flex flex-col gap-4">
						<Form.ElementField {form} name="rfidTags[{i}].startDate">
							<Form.Control>
								{#snippet children({ props })}
									<Form.Label>Start date</Form.Label>
									<Popover.Root>
										<Popover.Trigger
											{...props}
											class={cn(
												buttonVariants({ variant: 'outline' }),
												'flex w-full justify-start px-3 text-left font-normal sm:w-[280px]',
												!startDateValues[i] && 'text-muted-foreground'
											)}
										>
											{startDateValues[i]
												? df.format(startDateValues[i].toDate(getLocalTimeZone()))
												: 'Pick a date'}
											<CalendarIcon class="ml-auto size-4 opacity-50" />
										</Popover.Trigger>
										<Popover.Content class="w-auto p-0" side="top">
											<Calendar
												type="single"
												value={startDateValues[i] as DateValue}
												minValue={new CalendarDate(2015, 1, 1)}
												maxValue={today(getLocalTimeZone()).cycle('year', 1)}
												calendarLabel="Start date"
												onValueChange={(v) => {
													if (v) {
														$formData.rfidTags[i].startDate = v.toString();
													} else {
														$formData.rfidTags[i].startDate = '';
													}
												}}
											/>
										</Popover.Content>
									</Popover.Root>
									<input hidden value={$formData.rfidTags[i].startDate} name={props.name} />
								{/snippet}
							</Form.Control>
						</Form.ElementField>

						<Form.ElementField {form} name="rfidTags[{i}].endDate">
							<Form.Control>
								{#snippet children({ props })}
									<Form.Label>End date</Form.Label>
									<Popover.Root>
										<Popover.Trigger
											{...props}
											class={cn(
												buttonVariants({ variant: 'outline' }),
												'flex w-full justify-start px-3 text-left font-normal sm:w-[280px]',
												!endDateValues[i] && 'text-muted-foreground'
											)}
										>
											{endDateValues[i]
												? df.format(endDateValues[i].toDate(getLocalTimeZone()))
												: 'Pick a date'}
											<CalendarIcon class="ml-auto size-4 opacity-50" />
										</Popover.Trigger>
										<Popover.Content class="w-auto p-0" side="top">
											<Calendar
												type="single"
												value={endDateValues[i] as DateValue}
												minValue={new CalendarDate(2015, 1, 1)}
												maxValue={today(getLocalTimeZone()).cycle('year', 1)}
												calendarLabel="End date"
												onValueChange={(v) => {
													if (v) {
														$formData.rfidTags[i].endDate = v.toString();
													} else {
														$formData.rfidTags[i].endDate = undefined;
													}
												}}
											/>
										</Popover.Content>
									</Popover.Root>
									<input hidden value={$formData.rfidTags[i].endDate} name={props.name} />
								{/snippet}
							</Form.Control>
						</Form.ElementField>

						<Form.ElementField {form} name="rfidTags[{i}].data">
							<Form.Control>
								{#snippet children({ props })}
									<Form.Label>Data</Form.Label>
									<Input
										type="text"
										class="w-full sm:w-[280px]"
										{...props}
										bind:value={$formData.rfidTags[i].data}
									/>
								{/snippet}
							</Form.Control>
						</Form.ElementField>

						<div class="mt-2 space-y-3">
							<div class="text-sm font-medium leading-none">
								<div class="mb-2">Code</div>
								<div class="text-xs text-muted-foreground">
									(Optional if code hash already exists)
								</div>
							</div>
							<div class="flex w-full items-center gap-4 sm:w-[280px]">
								<InputOTP.Root
									maxlength={4}
									pattern={REGEXP_ONLY_DIGITS}
									onValueChange={async (code) => {
										if (code.length === 4) {
											await generateCodeHash(code, i);
										}
									}}
									disabled={!($formData.rfidTags[i].data.length > 0)}
								>
									{#snippet children({ cells })}
										<InputOTP.Group>
											{#each cells as cell}
												<InputOTP.Slot {cell} />
											{/each}
										</InputOTP.Group>
									{/snippet}
								</InputOTP.Root>
							</div>
						</div>

						<Form.ElementField {form} name="rfidTags[{i}].codeHash">
							<Form.Control>
								{#snippet children({ props })}
									<Form.Label>Code hash</Form.Label>
									<Input
										type="text"
										class="h-8 w-full cursor-default text-[10.5px] text-muted-foreground sm:w-fit sm:min-w-[280px]"
										{...props}
										bind:value={$formData.rfidTags[i].codeHash}
										readonly
									/>
								{/snippet}
							</Form.Control>
						</Form.ElementField>

						<Button
							type="button"
							variant="outline"
							class="w-full hover:border-red-900 sm:w-[280px]"
							onclick={() => removeRFIDTag(i)}
						>
							Remove RFID-tag #{i + 1}
						</Button>
					</div>
				</div>
			{/each}
		</div>
		<Form.FieldErrors />

		<div class="h-2"></div>

		<Button type="button" variant="outline" class="w-full sm:w-[280px]" onclick={addRFIDTag}>
			Add new RFID-tag
		</Button>
	</Form.Fieldset>
</form>
