import type { z } from 'zod';

import type { Member } from '$lib/types/members';
import type { artifactsFormSchema } from '$lib/schemas/members';
import { isArtifactActive } from '$lib/helpers';
import { createHash } from 'crypto';

export function generateCodeHash(data: string, pin: string) {
	const concatenatedString = data + pin;
	const hash = createHash('sha1').update(concatenatedString).digest('hex');
	return hash;
}

export function populateFromCurrent(member: Member): z.infer<typeof artifactsFormSchema> {
	const artifacts = member.artifacts;

	const rfidTags: z.infer<typeof artifactsFormSchema>['rfidTags'] = [];
	const keys: z.infer<typeof artifactsFormSchema>['keys'] = [];
	const legacyKeys: z.infer<typeof artifactsFormSchema>['legacyKeys'] = [];

	artifacts.forEach((artifact) => {
		if (artifact.type === 'rfid') {
			if (artifact.attributes?.data !== undefined && artifact.attributes.codeHash !== undefined) {
				const rfidTag = {
					startDate: artifact.startDate,
					data: artifact.attributes.data,
					codeHash: artifact.attributes.codeHash,
					endDate: artifact.endDate
				};
				rfidTags.push(rfidTag);
			} else {
				throw new Error('RFID artifact is missing data or codeHash');
			}
		} else if (artifact.type === 'key') {
			if (artifact.attributes?.number !== undefined) {
				const key = {
					startDate: artifact.startDate,
					number: artifact.attributes.number,
					endDate: artifact.endDate
				};
				keys.push(key);
			} else {
				throw new Error('Key artifact is missing number');
			}
		} else if (artifact.type === 'legacyKey') {
			if (artifact.attributes?.area !== undefined) {
				const legacyKey = {
					startDate: artifact.startDate,
					area: artifact.attributes.area,
					endDate: artifact.endDate
				};
				legacyKeys.push(legacyKey);
			} else {
				throw new Error('Legacy key artifact is missing area');
			}
		} else {
			throw new Error('Unknown artifact type');
		}
	});

	return {
		rfidTags: rfidTags,
		keys: keys,
		legacyKeys: legacyKeys
	};
}

export function updateMember(member: Member, data: z.infer<typeof artifactsFormSchema>): Member {
	const suggestedArtifacts = structuredClone(member.artifacts);
	console.log(data);

	// let rfidArtifactFoundAndUpdated = false;

	// either we update the existing artifact in place
	// for (const artifact of suggestedArtifacts) {
	// 	if (artifact.type === 'rfid' && isArtifactActive(artifact)) {
	// 		if (artifact.attributes) {
	// 			artifact.attributes.data = data.rfidData;
	// 			artifact.attributes.codeHash = generateCodeHash(data.rfidData, data.rfidCode);
	// 			rfidArtifactFoundAndUpdated = true;
	// 		} else {
	// 			artifact.attributes = {
	// 				data: data.rfidData,
	// 				codeHash: generateCodeHash(data.rfidData, data.rfidCode)
	// 			};
	// 			rfidArtifactFoundAndUpdated = true;
	// 		}
	// 	}
	// }

	// or we add a new artifact
	// if (!rfidArtifactFoundAndUpdated) {
	// 	suggestedArtifacts.push({
	// 		type: 'rfid',
	// 		startDate: new Date().toISOString().split('T')[0],
	// 		attributes: {
	// 			data: data.rfidData,
	// 			codeHash: generateCodeHash(data.rfidData, data.rfidCode)
	// 		}
	// 	});
	// }

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
