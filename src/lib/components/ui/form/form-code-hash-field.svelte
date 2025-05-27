<script lang="ts" module>
	import type { FormPathLeaves as _FormPathLeaves } from 'sveltekit-superforms';
	type T = Record<string, unknown>;
	type U = _FormPathLeaves<T>;
</script>

<script lang="ts" generics="T extends Record<string, unknown>, U extends _FormPathLeaves<T>">
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as InputOTP from '$lib/components/ui/input-otp/index.js';
	import { REGEXP_ONLY_DIGITS } from 'bits-ui';
	import type { FormPathLeaves } from 'sveltekit-superforms';
	import { type FsSuperForm } from 'formsnap';

	type Props<T extends Record<string, unknown>, U extends FormPathLeaves<T>> = {
		/**
		 * The form object returned from calling `superForm` in your component.
		 */
		form: FsSuperForm<T>;

		/**
		 * The path to the field in the form object.
		 *
		 * @required
		 */
		name: U;
		rfidData: string;
		rfidCodeHash: string;
	};

	let { form, name, rfidData, rfidCodeHash = $bindable() }: Props<T, U> = $props();

	async function generateCodeHash(code: string) {
		rfidCodeHash = await generateSHA1(rfidData + code);
	}

	async function generateSHA1(message: string) {
		const msgBuffer = new TextEncoder().encode(message);
		const hashBuffer = await crypto.subtle.digest('SHA-1', msgBuffer);
		const hashArray = Array.from(new Uint8Array(hashBuffer));
		const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

		return hashHex;
	}
</script>

<div class="mt-2 space-y-3">
	<div class="text-sm leading-none font-medium">
		<div class="mb-2">Kod</div>
		<div class="text-muted-foreground text-xs">
			(Behöver inte fyllas i om kodhash redan existerar nedan)
		</div>
	</div>
	<InputOTP.Root
		maxlength={4}
		pattern={REGEXP_ONLY_DIGITS}
		onValueChange={async (code) => {
			if (code.length === 4) {
				await generateCodeHash(code);
			}
		}}
		disabled={!(rfidData.length > 0)}
	>
		{#snippet children({ cells })}
			<InputOTP.Group>
				{#each cells as cell (cell)}
					<InputOTP.Slot {cell} />
				{/each}
			</InputOTP.Group>
		{/snippet}
	</InputOTP.Root>
</div>

<Form.ElementField {form} {name}>
	<Form.Control>
		{#snippet children({ props })}
			<Form.Label>Kodhash</Form.Label>
			<Input
				type="text"
				class="text-muted-foreground w-full cursor-default cursor-not-allowed text-xs"
				{...props}
				bind:value={rfidCodeHash}
				readonly
			/>
		{/snippet}
	</Form.Control>
</Form.ElementField>
