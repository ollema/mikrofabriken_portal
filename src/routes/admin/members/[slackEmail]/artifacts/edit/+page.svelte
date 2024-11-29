<script lang="ts">
	import * as PageHeader from '$lib/components/page-header';
	import * as Alert from '$lib/components/ui/alert';
	import GitBranch from 'lucide-svelte/icons/git-branch';
	import { appendPossessive } from '$lib/helpers.js';
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
	import type { Member } from '$lib/types/members';

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

	const { form: formData, enhance } = form;

	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});

	let rfidTagsStartDateValues = $state<(DateValue | undefined)[]>([]);
	let rfidTagsEndDateValues = $state<(DateValue | undefined)[]>([]);
	let keysStartDateValues = $state<(DateValue | undefined)[]>([]);
	let keysEndDateValues = $state<(DateValue | undefined)[]>([]);

	$effect(() => {
		rfidTagsStartDateValues = $formData.rfidTags.map((artifact) => {
			return artifact.startDate ? parseDate(artifact.startDate) : undefined;
		});

		rfidTagsEndDateValues = $formData.rfidTags.map((artifact) => {
			return artifact.endDate ? parseDate(artifact.endDate) : undefined;
		});

		keysStartDateValues = $formData.keys.map((artifact) => {
			return artifact.startDate ? parseDate(artifact.startDate) : undefined;
		});

		keysEndDateValues = $formData.keys.map((artifact) => {
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

<div class="mx-auto w-full min-w-0">
	<PageHeader.Root>
		<PageHeader.Heading>
			<PageHeader.Title>Edit {appendPossessive(data.member.name)} artifacts</PageHeader.Title>
			<PageHeader.Description>
				Edit {data.member.name}'s RFID-tags and keys.
			</PageHeader.Description>
		</PageHeader.Heading>
	</PageHeader.Root>

	<Alert.Root class="my-6 w-full max-w-lg">
		<Alert.Title class="text-lg font-semibold">Note:</Alert.Title>
		<Alert.Description class="mt-2 space-y-2">
			<div>Each merge request will be reviewed by an admin before being applied.</div>
			<div>This means that your requested changes will not be active immediately.</div>
		</Alert.Description>
	</Alert.Root>

	{#if data.pending.member}
		<Alert.Root class="my-6 w-full max-w-lg">
			<Alert.Title class="text-lg font-semibold">Heads up!</Alert.Title>
			<Alert.Description class="mt-2 space-y-2">
				<div>There is a merge request for this profile under review.</div>
				<div>You are currently viewing, editing and updating that merge request.</div>
				<a
					href={data.pending.link}
					target="_blank"
					rel="external"
					class="flex items-center space-x-2 hover:underline"
				>
					<GitBranch class="mt-[2px] inline h-4" />
					<code>{data.pending.sourceBranch}</code>
				</a>
			</Alert.Description>
		</Alert.Root>
	{/if}

	<form method="POST" class="max-w-lg" use:enhance>
		<Form.Fieldset {form} name="rfidTags">
			<Form.Legend class="py-2 text-xl">RFID-tags</Form.Legend>
			<div class="flex flex-col gap-4">
				{#each Array.from(Array($formData.rfidTags.length).keys()) as i}
					<div class="rounded-md border border-muted p-4">
						<Form.Legend class="mb-2 text-lg">RFID-tag #{i + 1}</Form.Legend>
						<div class="mb-4">
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
													'flex w-full justify-start px-3 text-left font-normal',
													!rfidTagsStartDateValues[i] && 'text-muted-foreground'
												)}
											>
												{rfidTagsStartDateValues[i]
													? df.format(rfidTagsStartDateValues[i].toDate(getLocalTimeZone()))
													: 'Pick a date'}
												<CalendarIcon class="ml-auto size-4 opacity-50" />
											</Popover.Trigger>
											<Popover.Content class="w-auto p-0" side="top">
												<Calendar
													type="single"
													value={rfidTagsStartDateValues[i] as DateValue}
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
													'flex w-full justify-start px-3 text-left font-normal',
													!rfidTagsEndDateValues[i] && 'text-muted-foreground'
												)}
											>
												{rfidTagsEndDateValues[i]
													? df.format(rfidTagsEndDateValues[i].toDate(getLocalTimeZone()))
													: 'Pick a date to set to inactive'}
												<CalendarIcon class="ml-auto size-4 opacity-50" />
											</Popover.Trigger>
											<Popover.Content class="w-auto p-0" side="top">
												<Calendar
													type="single"
													value={rfidTagsEndDateValues[i] as DateValue}
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
											class="w-full"
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

							<Form.ElementField {form} name="rfidTags[{i}].codeHash">
								<Form.Control>
									{#snippet children({ props })}
										<Form.Label>Code hash</Form.Label>
										<Input
											type="text"
											class="w-full cursor-default text-xs text-muted-foreground"
											{...props}
											bind:value={$formData.rfidTags[i].codeHash}
											readonly
										/>
									{/snippet}
								</Form.Control>
							</Form.ElementField>

							<Button
								type="button"
								variant="destructive"
								class="w-full hover:border-red-900"
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

			<Button type="button" variant="secondary" class="w-full" onclick={addRFIDTag}>
				Add new RFID-tag
			</Button>
		</Form.Fieldset>

		<Form.Fieldset {form} name="keys" class="mt-4">
			<Form.Legend class="py-2 text-xl">Keys</Form.Legend>
			<div class="flex flex-col gap-4">
				{#each Array.from(Array($formData.keys.length).keys()) as i}
					<div class="rounded-md border border-muted p-4">
						<Form.Legend class="mb-2 text-lg">Key #{i + 1}</Form.Legend>
						<div class="mb-4">
							Status:
							{#if $formData.keys[i].endDate}
								<span class="text-neutral-500">Inactive</span>
							{:else}
								<span class="text-green-500">Active</span>
							{/if}
						</div>
						<div class="flex flex-col gap-4">
							<Form.ElementField {form} name="keys[{i}].startDate">
								<Form.Control>
									{#snippet children({ props })}
										<Form.Label>Start date</Form.Label>
										<Popover.Root>
											<Popover.Trigger
												{...props}
												class={cn(
													buttonVariants({ variant: 'outline' }),
													'flex w-full justify-start px-3 text-left font-normal',
													!keysStartDateValues[i] && 'text-muted-foreground'
												)}
											>
												{keysStartDateValues[i]
													? df.format(keysStartDateValues[i].toDate(getLocalTimeZone()))
													: 'Pick a date'}
												<CalendarIcon class="ml-auto size-4 opacity-50" />
											</Popover.Trigger>
											<Popover.Content class="w-auto p-0" side="top">
												<Calendar
													type="single"
													value={keysStartDateValues[i] as DateValue}
													minValue={new CalendarDate(2015, 1, 1)}
													maxValue={today(getLocalTimeZone()).cycle('year', 1)}
													calendarLabel="Start date"
													onValueChange={(v) => {
														if (v) {
															$formData.keys[i].startDate = v.toString();
														} else {
															$formData.keys[i].startDate = '';
														}
													}}
												/>
											</Popover.Content>
										</Popover.Root>
										<input hidden value={$formData.keys[i].startDate} name={props.name} />
									{/snippet}
								</Form.Control>
							</Form.ElementField>

							<Form.ElementField {form} name="keys[{i}].endDate">
								<Form.Control>
									{#snippet children({ props })}
										<Form.Label>End date</Form.Label>
										<Popover.Root>
											<Popover.Trigger
												{...props}
												class={cn(
													buttonVariants({ variant: 'outline' }),
													'flex w-full justify-start px-3 text-left font-normal',
													!keysEndDateValues[i] && 'text-muted-foreground'
												)}
											>
												{keysEndDateValues[i]
													? df.format(keysEndDateValues[i].toDate(getLocalTimeZone()))
													: 'Pick a date to set to inactive'}
												<CalendarIcon class="ml-auto size-4 opacity-50" />
											</Popover.Trigger>
											<Popover.Content class="w-auto p-0" side="top">
												<Calendar
													type="single"
													value={keysEndDateValues[i] as DateValue}
													minValue={new CalendarDate(2015, 1, 1)}
													maxValue={today(getLocalTimeZone()).cycle('year', 1)}
													calendarLabel="End date"
													onValueChange={(v) => {
														if (v) {
															$formData.keys[i].endDate = v.toString();
														} else {
															$formData.keys[i].endDate = undefined;
														}
													}}
												/>
											</Popover.Content>
										</Popover.Root>
										<input hidden value={$formData.keys[i].endDate} name={props.name} />
									{/snippet}
								</Form.Control>
							</Form.ElementField>

							<Form.ElementField {form} name="keys[{i}].number">
								<Form.Control>
									{#snippet children({ props })}
										<Form.Label>Key number</Form.Label>
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
									<div>Number of the key.</div>
									<div>Not to be confused with the enumeration in this form.</div>
								</Form.Description>
							</Form.ElementField>

							<Button
								type="button"
								variant="destructive"
								class="w-full hover:border-red-900"
								onclick={() => removeKey(i)}
							>
								Remove key #{i + 1}
							</Button>
						</div>
					</div>
				{/each}
			</div>
			<Form.FieldErrors />

			<div class="h-2"></div>

			<Button type="button" variant="secondary" class="w-full" onclick={addKey}>Add new key</Button>
		</Form.Fieldset>
	</form>

	<div class="h-8"></div>
	<SuperDebug data={$formData} />
</div>
