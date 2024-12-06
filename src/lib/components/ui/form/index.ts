import * as FormPrimitive from 'formsnap';
import Description from './form-description.svelte';
import Label from './form-label.svelte';
import FieldErrors from './form-field-errors.svelte';
import Field from './form-field.svelte';
import CalendarField from './form-calendar-field.svelte';
import CodeHashField from './form-code-hash-field.svelte';
import Fieldset from './form-fieldset.svelte';
import Legend from './form-legend.svelte';
import ElementField from './form-element-field.svelte';
import Button from './form-button.svelte';
import SubmitButton from './form-submit-button.svelte';
import Status from './form-status.svelte';
import PendingAlert from './form-pending-alert.svelte';

const Control = FormPrimitive.Control;

export {
	Field,
	CalendarField,
	CodeHashField,
	Control,
	Label,
	Button,
	SubmitButton,
	FieldErrors,
	Description,
	Fieldset,
	Legend,
	ElementField,
	Status,
	PendingAlert,
	//
	Field as FormField,
	CalendarField as FormCalendarField,
	CodeHashField as FormCodeHashField,
	Control as FormControl,
	Description as FormDescription,
	Label as FormLabel,
	FieldErrors as FormFieldErrors,
	Fieldset as FormFieldset,
	Legend as FormLegend,
	ElementField as FormElementField,
	Button as FormButton,
	SubmitButton as FormSubmitButton,
	Status as FormStatus,
	PendingAlert as FormPendingAlert
};
