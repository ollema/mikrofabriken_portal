<script lang="ts">
	import * as PageHeader from '$lib/components/page-header/index.js';
	import KioskBarcode from '$lib/icons/kiosk-barcode.svelte';
	import KioskBrowse from '$lib/icons/kiosk-browse.svelte';
	import Lootmobil from '$lib/icons/lootmobil.svelte';
	import Lootslap from '$lib/icons/lootslap.svelte';
	import Gitlab from '$lib/icons/gitlab.svelte';
	import Slack from '$lib/icons/slack.svelte';
	import Mikrofabriken from '$lib/icons/mikrofabriken.svelte';
	import Drive from '$lib/icons/drive.svelte';
	import { env } from '$env/dynamic/public';
	import { onMount, type Component } from 'svelte';
	import { page } from '$app/state';

	let slackHref: string = $state('#');

	onMount(() => {
		const userAgent = navigator.userAgent.toLowerCase();
		if (
			/windows/.test(userAgent) ||
			/android/.test(userAgent) ||
			/macintosh/.test(userAgent) ||
			/iphone|ipad|ipod/.test(userAgent)
		) {
			slackHref = 'slack://channel?team=T2N3GU5B2&id=C2N20DATD';
		} else {
			slackHref = 'https://slack.com/app_redirect?team=T2N3GU5B2&channel=mikrofabriken';
		}
	});
</script>

{#snippet app({ href, Icon, label }: { href: string; Icon: Component; label: string })}
	<a
		{href}
		class="flex w-full flex-col items-center justify-center gap-4 text-xs transition-transform duration-400 hover:scale-110"
	>
		<div class="h-14 w-14 [&_svg]:h-full [&_svg]:w-full">
			<Icon />
		</div>
		<div class="text-nowrap">{label}</div>
	</a>
{/snippet}

<div class="mx-auto w-full">
	<PageHeader.Root>
		<PageHeader.Heading>
			<PageHeader.Title>Medlemsportal</PageHeader.Title>
		</PageHeader.Heading>
	</PageHeader.Root>

	{#if page.data.user !== null}
		<div class="grid grid-cols-[repeat(auto-fill,minmax(5rem,1fr))] gap-8">
			{@render app({ href: '/kiosk/scan', Icon: KioskBarcode, label: 'Kiosk (skanna)' })}
			{@render app({ href: '/kiosk/browse', Icon: KioskBrowse, label: 'Kiosk (bläddra)' })}
			{@render app({ href: env.PUBLIC_LOOTMOBIL_LINK, Icon: Lootmobil, label: 'Lootmobil' })}
			{@render app({ href: env.PUBLIC_LOOTSLAP_LINK, Icon: Lootslap, label: 'Lootsläp' })}
			{@render app({ href: 'https://gitlab.mikrofabriken.se', Icon: Gitlab, label: 'Gitlab' })}
			{@render app({ href: slackHref, Icon: Slack, label: 'Slack' })}
			{@render app({
				href: 'http://wiki.mikrofabriken.se',
				Icon: Mikrofabriken,
				label: 'Wiki'
			})}
			{@render app({ href: env.PUBLIC_DRIVE_LINK, Icon: Drive, label: 'Drive' })}
		</div>
	{:else}
		<div>
			<a href="/auth/sign_in" class="underline">Logga in med Slack</a>.
		</div>
	{/if}
</div>
