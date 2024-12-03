<script lang="ts">
	import * as PageHeader from '$lib/components/page-header';
	import * as Alert from '$lib/components/ui/alert';
	import GitBranch from 'lucide-svelte/icons/git-branch';
	import { appendPossessive } from '$lib/utils/member.js';
	import * as Form from '$lib/components/ui/form';
	import * as Select from '$lib/components/ui/select/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';
	import { getLocalTimeZone, today } from '@internationalized/date';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { commissionsFormSchema, type CommissionsFormSchema } from './schema.js';
	import type { Member } from '$lib/types/members';
	import { CommissionTypes } from '$lib/schemas/members';

	interface Props {
		data: {
			form: SuperValidated<Infer<CommissionsFormSchema>>;
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
		validators: zodClient(commissionsFormSchema),
		dataType: 'json'
	});

	const { form: formData, enhance, delayed } = form;

	function addCommissions() {
		$formData.commissions = [
			// @ts-expect-error ignore the undefined type for now
			...$formData.commissions,
			{
				// @ts-expect-error set this to undefined for now
				type: undefined,
				startDate: today(getLocalTimeZone()).toString(),
				endDate: undefined
			}
		];
	}

	function removeCommissions(index: number) {
		$formData.commissions = $formData.commissions.filter((_, i) => i !== index);
	}
</script>

<div class="mx-auto w-full min-w-0">
	<PageHeader.Root>
		<PageHeader.Heading>
			<PageHeader.Title>Edit {appendPossessive(data.member.name)} roles</PageHeader.Title>
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
				<div>There is a merge request for this member under review.</div>
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

	<form method="POST" class="flex max-w-lg flex-col gap-4" use:enhance>
		<Form.Fieldset {form} name="commissions">
			<Form.Legend class="text-xl">Roles</Form.Legend>
			{#if $formData.commissions.length > 0}
				<div class="flex flex-col gap-4">
					{#each Array.from(Array($formData.commissions.length).keys()) as i}
						<div class="rounded-md border border-muted p-4">
							<Form.Legend class="text-lg">Role #{i + 1}</Form.Legend>

							<Form.Status endDate={$formData.commissions[i].endDate} />

							<div class="flex flex-col gap-4">
								<Form.ElementField {form} name="commissions[{i}].type" class="mb-[-0.5rem]">
									<Form.Legend>Role type</Form.Legend>
									<Form.Control>
										{#snippet children({ props })}
											<Select.Root
												type="single"
												bind:value={$formData.commissions[i].type}
												name={props.name}
											>
												<Select.Trigger {...props}>
													{$formData.commissions[i].type
														? $formData.commissions[i].type
														: 'Select a commission type'}
												</Select.Trigger>
												<Select.Content>
													{#each CommissionTypes.options as option}
														<Select.Item label={option} value={option} />
													{/each}
												</Select.Content>
											</Select.Root>
										{/snippet}
									</Form.Control>
									<Form.FieldErrors />
								</Form.ElementField>

								<Form.CalendarField
									{form}
									name="commissions[{i}].startDate"
									label={'Start date'}
									bind:date={$formData.commissions[i].startDate}
								/>

								<Form.CalendarField
									{form}
									name="commissions[{i}].endDate"
									label={'End date'}
									bind:date={$formData.commissions[i].endDate}
								/>

								<Button
									type="button"
									variant="destructive"
									class="w-full hover:border-red-900"
									onclick={() => removeCommissions(i)}
								>
									Remove role #{i + 1}
								</Button>
							</div>
						</div>
					{/each}
				</div>
				<Form.FieldErrors />
			{/if}

			<Button type="button" variant="secondary" class="w-full" onclick={addCommissions}>
				Add new role
			</Button>
		</Form.Fieldset>

		<Separator class="my-4" />

		<Form.Button class="w-full">
			{#if $delayed}
				<LoaderCircle class="animate-spin" />
				Processing...
			{:else}
				Submit change request
			{/if}
		</Form.Button>
	</form>
</div>
