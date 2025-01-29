<script lang="ts">
	import * as PageHeader from '$lib/components/page-header/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Checkbox } from '$lib/components/ui/checkbox/index.js';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { workPoolsFormSchema, type WorkPoolsFormSchema } from './schema.js';
	import type { Member } from '$lib/types/members.js';

	interface Props {
		data: {
			form: SuperValidated<Infer<WorkPoolsFormSchema>>;
			pending: {
				member: Member | undefined;
				link: string | undefined;
				sourceBranch: string | undefined;
			};
			member: Member;
			validWorkPools: string[];
		};
	}

	let { data }: Props = $props();

	const form = superForm(data.form, {
		validators: zodClient(workPoolsFormSchema),
		dataType: 'json'
	});

	const { form: formData, enhance, delayed } = form;
</script>

<div class="mx-auto w-full min-w-0">
	<PageHeader.Root>
		<PageHeader.Heading>
			<PageHeader.Title>Edit work pools</PageHeader.Title>
		</PageHeader.Heading>
	</PageHeader.Root>

	<Form.PendingAlert pending={data.pending} />

	<form method="POST" class="flex max-w-lg flex-col gap-4" use:enhance>
		<Form.Fieldset {form} name="workPools">
			<Form.Legend class="text-xl">Work pools</Form.Legend>
			<div class="flex flex-col gap-4">
				{#each data.validWorkPools as pool}
					<div class="flex items-center gap-2">
						<Checkbox
							id={pool}
							name="workPools"
							value={pool}
							checked={$formData.workPools.includes(pool)}
							onCheckedChange={(checked) => {
								if (checked) {
									$formData.workPools = [...$formData.workPools, pool];
								} else {
									$formData.workPools = $formData.workPools.filter((p) => p !== pool);
								}
							}}
						/>
						<label for={pool}>{pool}</label>
					</div>
				{/each}
			</div>
			<Form.FieldErrors />
		</Form.Fieldset>

		<Form.SubmitButton {delayed} label="Submit change request" />
	</form>
</div>
