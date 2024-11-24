<script lang="ts">
	import * as PageHeader from '$lib/components/page-header';
	import * as Popover from '$lib/components/ui/popover';
	import { Button } from '$lib/components/ui/button';
	import { type Member } from '$lib/types/members.js';
	import {
		Profile,
		Company,
		Pending,
		Agreements,
		Artifacts,
		Commissions
	} from '$lib/components/membership/index.js';
	import { isAgreementActive, isArtifactActive, isCommissionActive } from '$lib/helpers.js';

	let { data } = $props();

	let showPending = $state(false);
</script>

<div class="mx-auto w-full">
	<PageHeader.Root>
		<PageHeader.Heading>
			<PageHeader.Title>Profile</PageHeader.Title>
		</PageHeader.Heading>
		<PageHeader.Actions>
			<Popover.Root>
				<Popover.Trigger>
					<Button variant="outline">Edit</Button>
				</Popover.Trigger>
				<Popover.Content class="w-56" side="bottom" align="end">
					<div class="flex w-full flex-col items-center gap-2">
						<div class="w-full">
							<Button variant="outline" href="/membership/profile/edit" class="w-full">
								Edit personal info
							</Button>
						</div>
						<div class="w-full">
							<Button variant="outline" href="/membership/profile/company/edit" class="w-full">
								{#if data.member.company}
									Edit company
								{:else}
									Add company
								{/if}
							</Button>
						</div>
						<div class="w-full">
							<Button variant="outline" href="/membership/profile/rfid/edit" class="w-full">
								Edit RFID code
							</Button>
						</div>
					</div>
				</Popover.Content>
			</Popover.Root>
		</PageHeader.Actions>
	</PageHeader.Root>

	{#snippet subtitle(title: string)}
		<div class="mb-4 mt-6 w-full text-3xl font-semibold">{title}</div>
	{/snippet}

	{@render subtitle('Personal information')}

	{#snippet profile(member: Member)}
		<Profile {member} />

		{#if member.company}
			{@render subtitle('Company information')}
			<Company company={member.company} />
		{/if}

		{#if member.agreements.filter((agreement) => isAgreementActive(agreement)).length > 0}
			{@render subtitle('Agreements')}
			<Agreements agreements={member.agreements} />
		{/if}

		{#if member.artifacts.filter((artifact) => isArtifactActive(artifact)).length > 0}
			{@render subtitle('RFID tags & keys')}
			<Artifacts artifacts={member.artifacts} />
		{/if}

		{#if member.commissions.filter((commission) => isCommissionActive(commission)).length > 0}
			{@render subtitle('Engagements')}
			<Commissions commissions={member.commissions} />
		{/if}
	{/snippet}

	{#await data.pending}
		{@render profile(data.member)}
	{:then pending}
		{#if pending.member}
			<Pending bind:showPending />
		{/if}

		{@const member = showPending ? (pending.member ?? data.member) : data.member}

		{@render profile(member)}
	{/await}
</div>
