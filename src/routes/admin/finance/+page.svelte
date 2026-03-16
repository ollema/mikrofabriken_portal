<script lang="ts">
	import * as PageHeader from '$lib/components/page-header/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Progress } from '$lib/components/ui/progress/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';

	let { data } = $props();

	const financeLinks = [
		{
			title: 'OmK Budget',
			description: 'Budget och resultat per OMK',
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

	let status = $derived(data.updateStatus);
	let isRunning = $derived(status?.status === 'running');
	let percentage = $derived(
		status?.total && status.total > 0 ? Math.round(((status.current ?? 0) / status.total) * 100) : 0
	);

	function badgeVariant(
		s: string | undefined
	): 'default' | 'secondary' | 'destructive' | 'outline' {
		switch (s) {
			case 'running':
				return 'default';
			case 'completed':
				return 'secondary';
			case 'failed':
				return 'destructive';
			default:
				return 'outline';
		}
	}

	function formatDate(iso: string | null | undefined): string {
		if (!iso) return '—';
		return new Date(iso).toLocaleString('sv-SE');
	}

	function phaseName(phase: string | null | undefined): string {
		if (!phase) return '—';
		switch (phase) {
			case 'accounts':
				return 'Konton';
			case 'customers':
				return 'Kunder';
			case 'vouchers':
				return 'Verifikationer';
			default:
				return phase;
		}
	}

	$effect(() => {
		if (!isRunning) return;
		const interval = setInterval(() => {
			invalidateAll();
		}, 3000);
		return () => clearInterval(interval);
	});
</script>

<div class="mx-auto w-full min-w-0">
	<PageHeader.Root>
		<PageHeader.Heading>
			<PageHeader.Title>Finance</PageHeader.Title>
			<PageHeader.Description>Ekonomiska rapporter mm</PageHeader.Description>
		</PageHeader.Heading>
	</PageHeader.Root>

	<div class="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
		{#each financeLinks as link (link.href)}
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

	<div class="bg-border mt-8 h-px w-full"></div>

	<div class="mt-6 space-y-4">
		<div class="flex flex-wrap items-center gap-x-4 gap-y-2">
			<h3 class="text-sm font-medium">Fortnox-synk</h3>
			<Badge variant={badgeVariant(status?.status)}>
				{status?.status ?? 'idle'}
			</Badge>
			<div class="text-muted-foreground flex flex-wrap gap-x-4 text-sm">
				{#if status?.startedAt}
					<span>Startad {formatDate(status.startedAt)}</span>
				{/if}
				{#if status?.completedAt}
					<span>Klar {formatDate(status.completedAt)}</span>
				{/if}
			</div>
		</div>

		{#if isRunning}
			<div class="max-w-md space-y-1">
				<div class="text-muted-foreground flex justify-between text-xs">
					<span>
						{phaseName(status?.phase)}
						— {status?.current ?? 0} / {status?.total ?? 0}
					</span>
					<span>{percentage}%</span>
				</div>
				<Progress value={percentage} />
			</div>
		{/if}

		{#if status?.status === 'failed' && status.error}
			<p class="text-destructive text-sm">{status.error}</p>
		{/if}

		<form method="POST" action="?/update" use:enhance>
			<Button type="submit" variant="outline" size="sm" disabled={isRunning}>
				{isRunning ? 'Uppdaterar...' : 'Uppdatera finansdata'}
			</Button>
		</form>
	</div>
</div>
