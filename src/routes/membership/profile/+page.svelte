<script lang="ts">
	import * as PageHeader from '$lib/components/page-header';
	import * as Popover from '$lib/components/ui/popover';
	import { Button } from '$lib/components/ui/button';
	import { Profile, Company, Pending } from '$lib/components/membership/index.js';

	let { data } = $props();

	let showPending = $state(false);
</script>

<div class="mx-auto w-full min-w-0">
	<PageHeader.Root>
		<PageHeader.Heading>
			<PageHeader.Title>Profile</PageHeader.Title>
			<PageHeader.Description>Your personal information.</PageHeader.Description>
		</PageHeader.Heading>
		<PageHeader.Actions>
			<Popover.Root>
				<Popover.Trigger>
					<Button variant="outline">Edit</Button>
				</Popover.Trigger>
				<Popover.Content class="w-56" side="bottom" align="end">
					<div class="flex w-full flex-col items-center gap-2">
						<div class="w-full">
							<Button variant="outline" href="/membership/profile/edit" class="w-full"
								>Edit profile</Button
							>
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
					</div>
				</Popover.Content>
			</Popover.Root>
		</PageHeader.Actions>
	</PageHeader.Root>

	{#await data.pending}
		<Profile member={data.member} />

		{#if data.member.company}
			<PageHeader.Root class="mt-8">
				<PageHeader.Heading>
					<PageHeader.Description>Your company.</PageHeader.Description>
				</PageHeader.Heading>
			</PageHeader.Root>

			<Company company={data.member.company} />
		{/if}
	{:then pending}
		{#if pending.member}
			<Pending bind:showPending />
		{/if}

		{@const member = showPending ? (pending.member ?? data.member) : data.member}
		{@const company = showPending ? pending.member?.company : data.member.company}

		<Profile {member} />

		{#if company}
			<PageHeader.Root class="mt-8">
				<PageHeader.Heading>
					<PageHeader.Description>Your company.</PageHeader.Description>
				</PageHeader.Heading>
			</PageHeader.Root>

			<Company {company} />
		{/if}
	{/await}
</div>
