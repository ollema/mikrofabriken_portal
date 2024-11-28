<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import CalendarIcon from 'lucide-svelte/icons/calendar';
	import * as InputOTP from '$lib/components/ui/input-otp/index.js';
	import { REGEXP_ONLY_DIGITS } from 'bits-ui';
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

	// function addWorker() {
	// 	$form.workDone = [...$form.workDone, { date: null, worker: '' }];
	// }

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

	let placeholder = $state<DateValue>(today(getLocalTimeZone()));

	async function generateSHA1(message: string): Promise<string> {
		const msgBuffer = new TextEncoder().encode(message);
		const hashBuffer = await crypto.subtle.digest('SHA-1', msgBuffer);
		const hashArray = Array.from(new Uint8Array(hashBuffer));
		const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
		return hashHex;
	}
</script>

<SuperDebug data={$formData} />

<form method="POST" class="max-w-md" use:enhance>
	<Form.Fieldset {form} name="rfidTags" class="mt-8 ">
		<Form.Legend class="mb-4">Artifacts</Form.Legend>
		<div class="flex flex-col gap-2">
			{#each Array.from(Array($formData.rfidTags.length).keys()) as i}
				<Form.Legend class="mb-2 flex flex-col gap-3">
					<div>Artifact #{i + 1}</div>
					<div>
						Status:
						{#if $formData.rfidTags[i].endDate}
							<span class="text-neutral-500">Inactive</span>
						{:else}
							<span class="text-green-500">Active</span>
						{/if}
					</div>
				</Form.Legend>
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
											'flex w-[280px] justify-start px-3 text-left font-normal',
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
											maxValue={today(getLocalTimeZone())}
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
											'flex w-[280px] justify-start px-3 text-left font-normal',
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
											bind:placeholder
											minValue={new CalendarDate(2015, 1, 1)}
											maxValue={today(getLocalTimeZone())}
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
									class="w-[280px]"
									{...props}
									bind:value={$formData.rfidTags[i].data}
								/>
							{/snippet}
						</Form.Control>
					</Form.ElementField>

					<div class="mt-2 space-y-3">
						<div class="text-sm font-medium leading-none">
							<div class="mb-2">Replace code</div>
							<div class="text-xs text-muted-foreground">
								(Optional if code hash already exists)
							</div>
						</div>
						<div class="flex w-[280px] items-center gap-4">
							<InputOTP.Root
								maxlength={4}
								pattern={REGEXP_ONLY_DIGITS}
								onComplete={async (code) => {
									const data = $formData.rfidTags[i].data;
									const hash = await generateSHA1(data + code);
									$formData.rfidTags[i].codeHash = hash;
								}}
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
									class="h-8 w-fit min-w-[280px] cursor-default text-[10.5px] text-muted-foreground"
									{...props}
									bind:value={$formData.rfidTags[i].codeHash}
									readonly
								/>
							{/snippet}
						</Form.Control>
					</Form.ElementField>
				</div>
			{/each}
		</div>
		<Form.FieldErrors />
	</Form.Fieldset>
</form>
