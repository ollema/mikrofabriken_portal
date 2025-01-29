<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import ChevronUp from 'lucide-svelte/icons/chevron-up';
	import Mikrofabriken from '$lib/icons/mikrofabriken.svelte';
	import { allowedToViewCategory, allowedToViewPage, navigation } from '$lib/config/navigation.js';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';

	let signoutForm: HTMLFormElement | undefined = $state(undefined);

	function gotoProfile() {
		goto('/membership/profile');
	}

	function gotoInvoices() {
		goto('/membership/invoices');
	}

	function gotoPurchases() {
		goto('/kiosk/purchases');
	}

	function submitSignoutForm() {
		if (signoutForm) {
			signoutForm.requestSubmit();
		}
	}

	const { setOpenMobile } = Sidebar.useSidebar();
</script>

<form action="/auth/sign_out" method="post" bind:this={signoutForm}></form>

<Sidebar.Root>
	<Sidebar.Header>
		<Sidebar.Menu>
			<Sidebar.MenuItem>
				<Sidebar.MenuButton
					size="lg"
					onclick={() => {
						goto('/');
					}}
				>
					<div class="flex aspect-square size-8 items-center justify-center rounded-lg">
						<Mikrofabriken class="size-8" />
					</div>
					<div class="ml-0.5 flex flex-col gap-0.5 leading-none">
						<span class="font-semibold">Mikrofabriken</span>
						<span>Membership Portal</span>
					</div>
				</Sidebar.MenuButton>
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.Header>
	<Sidebar.Content>
		{#each navigation as group}
			{#if allowedToViewCategory(group.requireAdmin, group.requireViewProducts, group.requireViewWorkPools, page.data.user?.role === 'admin', page.data.allowedToViewProducts, page.data.allowedToViewWorkPools)}
				<Sidebar.Group>
					<Sidebar.GroupLabel>{group.title}</Sidebar.GroupLabel>
					<Sidebar.GroupContent>
						<Sidebar.Menu>
							{#each group.items as item (item.title)}
								{#if allowedToViewPage(item.requireAdmin, item.requireViewProducts, item.requireViewWorkPools, page.data.user?.role === 'admin', page.data.allowedToViewProducts, page.data.allowedToViewWorkPools)}
									<Sidebar.MenuItem>
										<Sidebar.MenuButton>
											{#snippet child({ props })}
												<a href={item.href} {...props} onclick={() => setOpenMobile(false)}>
													{item.title}
												</a>
											{/snippet}
										</Sidebar.MenuButton>
									</Sidebar.MenuItem>
								{/if}
							{/each}
						</Sidebar.Menu>
					</Sidebar.GroupContent>
				</Sidebar.Group>
			{/if}
		{/each}
	</Sidebar.Content>
	<Sidebar.Footer>
		<Sidebar.Menu>
			<Sidebar.MenuItem>
				{#if page.data.user !== null}
					{@const user = page.data.user}
					<DropdownMenu.Root>
						<DropdownMenu.Trigger>
							{#snippet child({ props })}
								<Sidebar.MenuButton
									{...props}
									class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
								>
									{user.name}
									<ChevronUp class="ml-auto" />
								</Sidebar.MenuButton>
							{/snippet}
						</DropdownMenu.Trigger>
						<DropdownMenu.Content side="top" class="w-[--bits-dropdown-menu-anchor-width]">
							<DropdownMenu.Item onSelect={gotoProfile}>
								<span>Profile</span>
							</DropdownMenu.Item>
							<DropdownMenu.Item onSelect={gotoInvoices}>
								<span>Invoices</span>
							</DropdownMenu.Item>
							<DropdownMenu.Item onSelect={gotoPurchases}>
								<span>Purchases</span>
							</DropdownMenu.Item>
							<DropdownMenu.Item onSelect={submitSignoutForm}>
								<span>Sign out</span>
							</DropdownMenu.Item>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				{:else}
					<Sidebar.MenuButton>
						{#snippet child({ props })}
							<a href="/auth/sign_in" {...props}>Sign in</a>
						{/snippet}
					</Sidebar.MenuButton>
				{/if}
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.Footer>
	<Sidebar.Rail />
</Sidebar.Root>
