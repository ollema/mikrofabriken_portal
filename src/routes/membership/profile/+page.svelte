<script lang="ts">
	import * as PageHeader from '$lib/components/page-header';
	import * as Popover from '$lib/components/ui/popover';
	import { Button } from '$lib/components/ui/button';
	import {
		Profile,
		Company,
		Pending,
		Agreements,
		Artifacts
	} from '$lib/components/membership/index.js';

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
							<Button variant="outline" href="/membership/profile/edit" class="w-full">
								Edit profile
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

		<Agreements agreements={data.member.agreements} />

		<Artifacts artifacts={data.member.artifacts} />
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

		<Agreements agreements={member.agreements} />

		<Artifacts artifacts={member.artifacts} />
	{/await}
</div>
