<script lang="ts">
	import ProfileItem from './profile-item.svelte';
	import type { Member } from '$lib/types/members.js';

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

<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
	<div class="flex flex-col gap-4 text-sm">
		<ProfileItem label="Namn" value={member.name} />
		<ProfileItem label="Personnummer" value={member.crNumber} />
		<ProfileItem label="Medlem sen" value={getMemberSince(member)} />
	</div>
	<div class="flex flex-col gap-4 text-sm">
		<ProfileItem label="Email" value={member.email} />
		<ProfileItem label="Slack ID" value={member.slackID ?? '-'} />
		<ProfileItem label="Telefonnummer" value={member.phone} />
	</div>
	<div class="flex flex-col gap-4 text-sm">
		<ProfileItem label="Adress" value={member.postalAdress} />
		<ProfileItem label="Postnummer" value={member.postalCode} />
		<ProfileItem label="Ort" value={member.postalCity} />
	</div>
</div>
