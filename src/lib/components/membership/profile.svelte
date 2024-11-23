<script lang="ts">
	import Root from './profile-root.svelte';
	import Group from './profile-group.svelte';
	import Item from './profile-item.svelte';
	import type { Member } from '$lib/types/members';

	interface Props {
		member: Member;
	}

	let { member }: Props = $props();

	function getMemberSince(member: Member) {
		for (const agreement of member.agreements) {
			if (agreement.type === 'membership') {
				return new Date(agreement.startDate).toLocaleDateString('sv-SE');
			}
		}
		return '-';
	}
</script>

<Root>
	<Group>
		<Item label="Name" value={member.name} />
		<Item label="PIN" value={member.crNumber} />
		<Item label="Member since" value={getMemberSince(member)} />
	</Group>
	<Group>
		<Item label="Email" value={member.email} />
		<Item label="Slack Email" value={member.slackEmail} />
		<Item label="Phone" value={member.phone} />
	</Group>
	<Group>
		<Item label="Address" value={member.postalAdress} />
		<Item label="Postal code" value={member.postalCode} />
		<Item label="City" value={member.postalCity} />
	</Group>
</Root>
