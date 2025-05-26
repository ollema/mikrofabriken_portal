<script lang="ts" module>
	import type { FormPathLeaves as _FormPathLeaves } from 'sveltekit-superforms';
	type T = Record<string, unknown>;
	type U = _FormPathLeaves<T>;
</script>

<script lang="ts" generics="T extends Record<string, unknown>, U extends _FormPathLeaves<T>">
	import * as Form from '$lib/components/ui/form/index.js';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import CalendarIcon from 'lucide-svelte/icons/calendar';
	import { cn } from '$lib/utils.js';
	import {
		CalendarDate,
		DateFormatter,
		type DateValue,
		getLocalTimeZone,
		parseDate,
		today
	} from '@internationalized/date';
	import type { FormPathLeaves } from 'sveltekit-superforms';
	import { type FsSuperForm } from 'formsnap';

	type Props<T extends Record<string, unknown>, U extends FormPathLeaves<T>> = {
		/**
		 * The form object returned from calling `superForm` in your component.
		 */
		form: FsSuperForm<T>;

		/**
		 * The path to the field in the form object.
		 *
		 * @required
		 */
		name: U;

		/**
		 * The label for the field.
		 *
		 * @required
		 */
		label: string;

		/**
		 * The date value.
		 */
		date: string | undefined;

		/**
		 * Show start date buttons
		 */
		showStartButtons?: boolean;

		/**
		 * Show end date buttons
		 */
		showEndButtons?: boolean;
	};

	let {
		form,
		name,
		label,
		date = $bindable(),
		showStartButtons,
		showEndButtons
	}: Props<T, U> = $props();

	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});

	let dateValue = $state<DateValue | undefined>(undefined);

	$effect(() => {
		dateValue = date ? parseDate(date) : undefined;
	});
</script>

<Form.ElementField {form} {name}>
	<Form.Control>
		{#snippet children({ props })}
			<Form.Label>{label}</Form.Label>
			<Popover.Root>
				<Popover.Trigger
					{...props}
					class={cn(
						buttonVariants({ variant: 'outline-solid' }),
						'flex w-full justify-start px-3 text-left font-normal',
						!dateValue && 'text-muted-foreground'
					)}
				>
					{dateValue ? df.format(dateValue.toDate(getLocalTimeZone())) : 'Välj ett datum'}
					<CalendarIcon class="ml-auto size-4 opacity-50" />
				</Popover.Trigger>
				<Popover.Content class="w-auto p-0" side="top">
					<Calendar
						type="single"
						fixedWeeks={true}
						value={dateValue as DateValue}
						minValue={new CalendarDate(2015, 1, 1)}
						maxValue={today(getLocalTimeZone()).cycle('year', 2)}
						calendarLabel={label}
						onValueChange={(v) => {
							if (v) {
								date = v.toString();
							} else {
								date = undefined;
							}
						}}
					/>
				</Popover.Content>
			</Popover.Root>
			<input hidden value={date} name={props.name} />
		{/snippet}
	</Form.Control>
	{#if showStartButtons}
		<div class="flex gap-2">
			<Button
				size="sm"
				variant="outline"
				onclick={() => {
					date = today(getLocalTimeZone()).set({ day: 1, month: 1 }).toString();
				}}
			>
				Årets första dag
			</Button>
			<Button
				size="sm"
				variant="outline"
				onclick={() => {
					date = today(getLocalTimeZone()).cycle('year', 1).set({ day: 1, month: 1 }).toString();
				}}
			>
				Nästa års första dag
			</Button>
		</div>
	{/if}

	{#if showEndButtons}
		<div class="flex gap-2">
			<Button
				size="sm"
				variant="outline"
				onclick={() => {
					date = today(getLocalTimeZone()).set({ day: 31, month: 12 }).toString();
				}}
			>
				Årets sista dag
			</Button>
			<Button
				size="sm"
				variant="outline"
				onclick={() => {
					date = today(getLocalTimeZone()).cycle('year', 1).set({ day: 31, month: 12 }).toString();
				}}
			>
				Nästa års sista dag
			</Button>
		</div>
	{/if}
</Form.ElementField>
