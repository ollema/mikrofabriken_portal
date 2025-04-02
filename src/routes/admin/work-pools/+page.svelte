<script lang="ts">
	import * as PageHeader from '$lib/components/page-header/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { getFlash } from 'sveltekit-flash-message';
	import { page } from '$app/state';
	let { data } = $props();

	const flash = getFlash(page);

	function copyEmails(workPool: { members: { email: string }[] }) {
		const emails = workPool.members.map((member) => member.email).join('\n');
		navigator.clipboard.writeText(emails);

		flash.set({
			message: `Copied ${workPool.members.length} email${workPool.members.length === 1 ? '' : 's'} to clipboard`,
			type: 'info'
		});
	}
</script>

<div class="mx-auto w-full min-w-0">
	<PageHeader.Root>
		<PageHeader.Heading>
			<PageHeader.Title>Work pools</PageHeader.Title>
		</PageHeader.Heading>
	</PageHeader.Root>

	<div class="mt-4 space-y-4">
		{#each data.workPools as workPool, i (i)}
			{#if i > 0}
				<div class="py-2">
					<Separator />
				</div>
			{/if}
			<div>
				<h2 class="mb-2 text-2xl font-semibold">{workPool.name}</h2>
				<p class="mb-6 text-muted-foreground">{workPool.description}</p>

				<div>
					<h3 class="text-lg font-medium">Members ({workPool.members.length})</h3>
					<Button
						variant="outline"
						size="sm"
						class="my-2"
						disabled={workPool.members.length === 0}
						onclick={() => copyEmails(workPool)}
					>
						Copy all emails
					</Button>
					{#if workPool.members.length > 0}
						<ul class="space-y-3">
							{#each workPool.members as member (member.email)}
								<li>
									<div class="font-medium">{member.name}</div>
									<div class="text-sm text-muted-foreground">
										{member.email}
									</div>
									<div class="text-sm text-muted-foreground">
										{member.phone}
									</div>
								</li>
							{/each}
						</ul>
					{:else}
						<p class="text-muted-foreground">No members in this work pool</p>
					{/if}
				</div>
			</div>
		{/each}
	</div>
</div>
