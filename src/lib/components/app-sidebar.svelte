<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import ChevronUp from 'lucide-svelte/icons/chevron-up';
	import Mikrofabriken from '$lib/icons/Mikrofabriken.svelte';
	import { navigation } from '$lib/config/navigation.js';
	import { goto } from '$app/navigation';
</script>

<Sidebar.Root>
	<Sidebar.Header>
		<Sidebar.Menu>
			<Sidebar.MenuItem>
				<Sidebar.MenuButton
					size="lg"
					onclick={() => {
						console.log('clicked');
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
		{#each navigation as group (group.title)}
			<Sidebar.Group>
				<Sidebar.GroupLabel>{group.title}</Sidebar.GroupLabel>
				<Sidebar.GroupContent>
					<Sidebar.Menu>
						{#each group.items as item (item.title)}
							<Sidebar.MenuItem>
								<Sidebar.MenuButton>
									{#snippet child({ props })}
										<a href={item.href} {...props}>{item.title}</a>
									{/snippet}
								</Sidebar.MenuButton>
							</Sidebar.MenuItem>
						{/each}
					</Sidebar.Menu>
				</Sidebar.GroupContent>
			</Sidebar.Group>
		{/each}
	</Sidebar.Content>
	<Sidebar.Footer>
		<Sidebar.Menu>
			<Sidebar.MenuItem>
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						{#snippet child({ props })}
							<Sidebar.MenuButton
								{...props}
								class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
							>
								Username
								<ChevronUp class="ml-auto" />
							</Sidebar.MenuButton>
						{/snippet}
					</DropdownMenu.Trigger>
					<DropdownMenu.Content side="top" class="w-[--bits-dropdown-menu-anchor-width]">
						<DropdownMenu.Item>
							<span>Profile</span>
						</DropdownMenu.Item>
						<DropdownMenu.Item>
							<span>Invoices</span>
						</DropdownMenu.Item>
						<DropdownMenu.Item>
							<span>Purchases</span>
						</DropdownMenu.Item>
						<DropdownMenu.Item>
							<span>Sign out</span>
						</DropdownMenu.Item>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.Footer>
	<Sidebar.Rail />
</Sidebar.Root>
