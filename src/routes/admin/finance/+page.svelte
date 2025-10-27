<script lang="ts">
	import * as PageHeader from '$lib/components/page-header/index.js';
	
	const financeLinks = [
		{
			title: 'Verifikationer',
			description: 'View and manage vouchers',
			href: '/admin/finance/vouchers'
		}
	];
</script>

<div class="mx-auto w-full min-w-0">
	<PageHeader.Root>
		<PageHeader.Heading>
			<PageHeader.Title>Finance</PageHeader.Title>
			<PageHeader.Description>Financial management and reporting</PageHeader.Description>
		</PageHeader.Heading>
	</PageHeader.Root>

	<div class="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
		{#each financeLinks as link}
			<a href={link.href}>
				<div class="relative rounded-lg border bg-card text-card-foreground shadow-sm hover:bg-accent hover:text-accent-foreground transition-colors">
					<div class="flex flex-col space-y-1.5 p-6">
						<h3 class="text-lg font-semibold">{link.title}</h3>
						<p class="text-sm text-muted-foreground">{link.description}</p>
					</div>
				</div>
			</a>
		{/each}
	</div>
</div>

