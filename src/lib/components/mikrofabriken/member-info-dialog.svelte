<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import MemberInfo from '$lib/components/mikrofabriken/member-info.svelte';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import { IsMobile } from '$lib/hooks/is-mobile.svelte.js';

	interface Props {
		selectedMember?: {
			name: string;
			avatar: string;
			here: boolean;
			commissions: string[];
		} | null;
		open?: boolean;
	}

	let { selectedMember = $bindable(null), open = $bindable(false) }: Props = $props();

	let isMobile = new IsMobile();
</script>

{#if !isMobile.current}
	<Dialog.Root bind:open>
		<Dialog.Content class="sm:max-w-[425px]">
			{#if selectedMember}
				<MemberInfo member={selectedMember} />
			{/if}
		</Dialog.Content>
	</Dialog.Root>
{:else}
	<Drawer.Root bind:open>
		<Drawer.Content>
			<Drawer.Header class="text-left">
				{#if selectedMember}
					<MemberInfo member={selectedMember} />
				{/if}
			</Drawer.Header>
			<Drawer.Footer class="pt-2">
				<Drawer.Close class={buttonVariants({ variant: 'outline' })}>Close</Drawer.Close>
			</Drawer.Footer>
		</Drawer.Content>
	</Drawer.Root>
{/if}
