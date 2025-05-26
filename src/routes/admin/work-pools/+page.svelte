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
			<PageHeader.Title>Arbetspooler</PageHeader.Title>
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
				<p class="text-muted-foreground mb-6">{workPool.description}</p>

				<div>
					<h3 class="text-md font-medium">
						Medlemmar i {workPool.name} ({workPool.members.length} st)
					</h3>
					<Button
						variant="outline"
						size="sm"
						class="my-2"
						disabled={workPool.members.length === 0}
						onclick={() => copyEmails(workPool)}
					>
						Kopiera alla emails
					</Button>
					{#if workPool.members.length > 0}
						<ul class="space-y-3">
							{#each workPool.members as member (member.email)}
								<li>
									<div class="font-medium">{member.name}</div>
									<div class="text-muted-foreground text-sm">
										{member.email}
									</div>
									<div class="text-muted-foreground text-sm">
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
