import { twMerge } from 'tailwind-merge';
import { clsx } from 'clsx';
import type { ClassValue } from 'clsx';

export function cn(...inputs: Array<ClassValue>) {
	return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, 'child'> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, 'children'> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, TElementType extends HTMLElement = HTMLElement> = T & {
	ref?: TElementType | null;
};
