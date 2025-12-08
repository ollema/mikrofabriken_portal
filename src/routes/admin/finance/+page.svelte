<script lang="ts">
	import * as PageHeader from '$lib/components/page-header/index.js';

	const financeLinks = [
		{
			title: 'OmK Budget',
			description: 'Vida budget och resultat per OMK',
			href: '/admin/finance/omk-budget'
		},
		{
			title: 'Kostnadsställen',
			description: 'Resultat per kostnadsställe',
			href: '/admin/finance/results'
		},
		{
			title: 'Verifikationer',
			description: 'Visa verifikationer',
			href: '/admin/finance/vouchers'
		}
	];
</script>

<div class="mx-auto w-full min-w-0">
	<PageHeader.Root>
		<PageHeader.Heading>
			<PageHeader.Title>Finance</PageHeader.Title>
			<PageHeader.Description>Ekonomiska rapporter mm</PageHeader.Description>
		</PageHeader.Heading>
	</PageHeader.Root>

	<div class="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
		{#each financeLinks as link}
			<a href={link.href}>
				<div
					class="bg-card text-card-foreground hover:bg-accent hover:text-accent-foreground relative rounded-lg border shadow-sm transition-colors"
				>
					<div class="flex flex-col space-y-1.5 p-6">
						<h3 class="text-lg font-semibold">{link.title}</h3>
						<p class="text-muted-foreground text-sm">{link.description}</p>
					</div>
				</div>
			</a>
		{/each}
	</div>
</div>
