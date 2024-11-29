import type { Member } from '$lib/types/members.js';
import type { artifactsFormSchema } from '$lib/schemas/members.js';

import { createHash } from 'crypto';
import type { z } from 'zod';
import { parseDate } from '@internationalized/date';

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
	const updatedArtifacts = [
		...data.rfidTags.map((tag) => ({
			type: 'rfid' as const,
			startDate: tag.startDate,
			endDate: tag.endDate,
			attributes: {
				data: tag.data,
				codeHash: tag.codeHash
			}
		})),
		...data.keys.map((key) => ({
			type: 'key' as const,
			startDate: key.startDate,
			endDate: key.endDate,
			attributes: {
				number: key.number
			}
		})),
		...data.legacyKeys.map((legacyKey) => ({
			type: 'legacyKey' as const,
			startDate: legacyKey.startDate,
			endDate: legacyKey.endDate,
			attributes: {
				area: legacyKey.area
			}
		}))
	];

	updatedArtifacts.sort((a, b) => {
		const dateA = parseDate(a.startDate);
		const dateB = parseDate(b.startDate);
		return dateA.compare(dateB);
	});

	const suggestedMember = {
		...member,
		artifacts: updatedArtifacts
	};

	return suggestedMember;
}

export function rfidArtifactDeepEqual(a: Member, b: Member) {
	return (
		a.artifacts.length === b.artifacts.length &&
		a.artifacts.every((artifact, index) => {
			const otherArtifact = b.artifacts[index];
			return (
				artifact.type === otherArtifact.type &&
				artifact.startDate === otherArtifact.startDate &&
				artifact.endDate === otherArtifact.endDate &&
				artifact.attributes?.data === otherArtifact.attributes?.data &&
				artifact.attributes?.codeHash === otherArtifact.attributes?.codeHash &&
				artifact.attributes?.number === otherArtifact.attributes?.number &&
				artifact.attributes?.area === otherArtifact.attributes?.area
			);
		})
	);
}

export function updateMembersInPlace(member: Member, updatedMember: Member) {
	member.artifacts = updatedMember.artifacts;
}
