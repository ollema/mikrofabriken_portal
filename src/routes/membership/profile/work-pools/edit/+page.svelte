<script lang="ts">
	import * as PageHeader from '$lib/components/page-header/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Checkbox } from '$lib/components/ui/checkbox/index.js';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
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
			workPoolNameMapping: Record<string, string>;
			workPoolDescriptionMapping: Record<string, string>;
		};
	}

	let { data }: Props = $props();

	const form = superForm(data.form, {
		validators: zod4Client(workPoolsFormSchema),
		dataType: 'json'
	});

	const { form: formData, enhance, delayed } = form;
</script>

<div class="mx-auto w-full min-w-0">
	<PageHeader.Root>
		<PageHeader.Heading>
			<PageHeader.Title>Redigera arbetspooler</PageHeader.Title>
		</PageHeader.Heading>
	</PageHeader.Root>

	<Form.PendingAlert pending={data.pending} />

	<form method="POST" class="flex max-w-lg flex-col gap-4" use:enhance>
		<Form.Fieldset {form} name="workPools">
			<Form.Legend class="mb-2 text-xl">Valda arbetspooler</Form.Legend>
			<div class="flex flex-col gap-4">
				{#each data.validWorkPools.sort( (a, b) => data.workPoolNameMapping[a].localeCompare(data.workPoolNameMapping[b]) ) as pool (pool)}
					<div class="center flex items-start gap-2">
						<Checkbox
							id={pool}
							name="workPools"
							class="mt-1"
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
						<div class="flex flex-col">
							<label for={pool}>{data.workPoolNameMapping[pool]}</label>
							<Form.Description>{data.workPoolDescriptionMapping[pool]}</Form.Description>
						</div>
					</div>
				{/each}
			</div>
			<Form.FieldErrors />
		</Form.Fieldset>

		<Form.SubmitButton {delayed} label="Skicka förslag på ändringar" />
	</form>
</div>
