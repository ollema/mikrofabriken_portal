<script lang="ts" module>
	import type { FormPathLeaves as _FormPathLeaves } from 'sveltekit-superforms';
	type T = Record<string, unknown>;
	type U = _FormPathLeaves<T>;
</script>

<script lang="ts" generics="T extends Record<string, unknown>, U extends _FormPathLeaves<T>">
	import * as Form from '$lib/components/ui/form/index.js';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
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
	};

	let { form, name, label, date = $bindable() }: Props<T, U> = $props();

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
						buttonVariants({ variant: 'outline' }),
						'flex w-full justify-start px-3 text-left font-normal',
						!dateValue && 'text-muted-foreground'
					)}
				>
					{dateValue ? df.format(dateValue.toDate(getLocalTimeZone())) : 'Pick a date'}
					<CalendarIcon class="ml-auto size-4 opacity-50" />
				</Popover.Trigger>
				<Popover.Content class="w-auto p-0" side="top">
					<Calendar
						type="single"
						value={dateValue as DateValue}
						minValue={new CalendarDate(2015, 1, 1)}
						maxValue={today(getLocalTimeZone()).cycle('year', 1)}
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
</Form.ElementField>
