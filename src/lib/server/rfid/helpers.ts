import type { z } from 'zod';

import type { Member } from '$lib/types/members';
import type { rfidFormSchema } from '$lib/schemas/members';
import { isArtifactActive } from '$lib/helpers';
import { createHash } from 'crypto';

export function generateCodeHash(data: string, pin: string) {
	const concatenatedString = data + pin;
	const hash = createHash('sha1').update(concatenatedString).digest('hex');
	return hash;
}

export function populateFromCurrent(member: Member) {
	const activeArtifacts = member.artifacts.filter((artifact) => isArtifactActive(artifact));

	const activeRfidArtifacts = activeArtifacts.find((artifacts) => artifacts.type === 'rfid');

	if (activeRfidArtifacts && activeRfidArtifacts.attributes?.data) {
		return {
			rfidData: activeRfidArtifacts.attributes.data
		};
	}

	return {
		rfidData: ''
	};
}

export function updateMember(member: Member, data: z.infer<typeof rfidFormSchema>): Member {
	const suggestedArtifacts = structuredClone(member.artifacts);

	let rfidArtifactFoundAndUpdated = false;

	// either we update the existing artifact in place
	for (const artifact of suggestedArtifacts) {
		if (artifact.type === 'rfid' && isArtifactActive(artifact)) {
			if (artifact.attributes) {
				artifact.attributes.data = data.rfidData;
				artifact.attributes.codeHash = generateCodeHash(data.rfidData, data.rfidCode);
				rfidArtifactFoundAndUpdated = true;
			} else {
				artifact.attributes = {
					data: data.rfidData,
					codeHash: generateCodeHash(data.rfidData, data.rfidCode)
				};
				rfidArtifactFoundAndUpdated = true;
			}
		}
	}

	// or we add a new artifact
	if (!rfidArtifactFoundAndUpdated) {
		suggestedArtifacts.push({
			type: 'rfid',
			startDate: new Date().toISOString().split('T')[0],
			attributes: {
				data: data.rfidData,
				codeHash: generateCodeHash(data.rfidData, data.rfidCode)
			}
		});
	}

	const suggestedMember = {
		...member,
		artifacts: suggestedArtifacts
	};

	return suggestedMember;
}

export function rfidArtifactDeepEqual(a: Member, b: Member) {
	const activeArtifactsA = a.artifacts.filter((artifact) => isArtifactActive(artifact));
	const activeArtifactsB = b.artifacts.filter((artifact) => isArtifactActive(artifact));

	const activeRfidArtifactsA = activeArtifactsA.find((artifacts) => artifacts.type === 'rfid');
	const activeRfidArtifactsB = activeArtifactsB.find((artifacts) => artifacts.type === 'rfid');

	if (activeRfidArtifactsA && activeRfidArtifactsB) {
		return (
			activeRfidArtifactsA.attributes?.data === activeRfidArtifactsB.attributes?.data &&
			activeRfidArtifactsA.attributes?.codeHash === activeRfidArtifactsB.attributes?.codeHash
		);
	}
}

export function updateMembersInPlace(member: Member, updatedMember: Member) {
	member.artifacts = updatedMember.artifacts;
}
