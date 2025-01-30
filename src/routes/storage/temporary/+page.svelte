<script lang="ts">
	import * as PageHeader from '$lib/components/page-header/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import { nameToInitials } from '$lib/utils/member.js';
	import ReleaseDialog from '$lib/components/storage/release-dialog.svelte';
	import ReserveDialog from '$lib/components/storage/reserve-dialog.svelte';

	let { data } = $props();

	let reserveOpen = $state(false);
	let releaseOpen = $state(false);
	let selectedResourceName: string | undefined = $state(undefined);
	let selectedResourcePeriod: { uuid: string; member: { name: string } } | undefined =
		$state(undefined);

	function handleReleaseClick(storage: {
		name: string;
		period: { uuid: string; member: { name: string } };
	}) {
		selectedResourceName = storage.name;
		selectedResourcePeriod = {
			uuid: storage.period.uuid,
			member: { name: storage.period.member.name }
		};
		releaseOpen = true;
	}

	function handleReserveClick(storage: { name: string }) {
		selectedResourceName = storage.name;
		reserveOpen = true;
	}

	function onClose() {
		selectedResourceName = undefined;
		selectedResourcePeriod = undefined;
	}
</script>

<div class="mx-auto w-full min-w-0">
	<PageHeader.Root>
		<PageHeader.Heading>
			<PageHeader.Title>Temporary storage</PageHeader.Title>
			<PageHeader.Description>Also known as schackrutor.</PageHeader.Description>
		</PageHeader.Heading>
	</PageHeader.Root>

	<div class="flex flex-col gap-4">
		{#each data.storageRows as row}
			<div class="grid auto-cols-[80px] grid-flow-col justify-start gap-2">
				{#each row as storage}
					{@const period = storage?.period}
					{#if period}
						<Button
							variant="outline"
							class="relative h-32 w-[80px] border border-white p-0 hover:bg-transparent"
							onclick={() =>
								handleReleaseClick({
									name: storage.name,
									period: { uuid: period.uuid, member: { name: period.member.name } }
								})}
						>
							<div class="flex h-full flex-col items-center">
								<div class="flex grow items-center justify-center">
									<Avatar.Root class="size-12">
										{#await period.member.avatar}
											<Avatar.Fallback>{nameToInitials(period.member.name)}</Avatar.Fallback>
										{:then avatar}
											<Avatar.Image src={avatar} alt={period.member.name} />
										{/await}
									</Avatar.Root>
								</div>
								<span class="text-lg font-bold uppercase text-white"
									>{storage.name.replace('storage/', '')}</span
								>
							</div>
						</Button>
					{:else}
						<Button
							variant="outline"
							class="relative h-32 w-[80px] border border-white p-0 hover:bg-transparent"
							onclick={() => handleReserveClick(storage)}
						>
							<div class="flex h-full flex-col items-center">
								<div class="flex grow items-center justify-center"></div>
								<span class="text-lg font-bold uppercase text-white"
									>{storage.name.replace('storage/', '')}</span
								>
							</div>
						</Button>
					{/if}
				{/each}
			</div>
		{/each}
	</div>
</div>

{#if selectedResourceName !== undefined && selectedResourcePeriod !== undefined}
	<ReleaseDialog
		bind:open={releaseOpen}
		{selectedResourceName}
		{selectedResourcePeriod}
		{onClose}
	/>
{:else if selectedResourceName !== undefined}
	<ReserveDialog bind:open={reserveOpen} {selectedResourceName} {onClose} />
{/if}
