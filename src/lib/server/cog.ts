import * as fs from 'node:fs';
import sharp from 'sharp';

import { LRUCache } from 'lru-cache';
import type { NewHoldingPeriod, NewProduct, Product, Purchase } from '$lib/types/cog.js';
import {
	BillingCategoriesSchema,
	ClaimsSchema,
	HistoricPurchasesSchema,
	PeriodCostSchema,
	PeriodDiscountSchema,
	PeriodsSchema,
	ProductCategoriesSchema,
	ProductSchema,
	ProductsSchema,
	ResourcesSchema,
	UnitNamesSchema,
	VatPercentagesSchema
} from '$lib/schemas/cog.js';

import { env } from '$env/dynamic/private';

const BASE_URL = env.UF_COG_BASE_URL;

function headers(token: string | undefined) {
	return {
		Accept: 'application/json',
		'Content-Type': 'application/json',
		...(token ? { Authorization: `Bearer ${token}` } : {})
	};
}

// ----------------------------------------------------------------------------
// cogFetch — centralized fetch wrapper with timeout, logging, and error handling
// ----------------------------------------------------------------------------
async function cogFetch(
	label: string,
	url: string,
	init: RequestInit,
	opts?: { timeoutMs?: number }
): Promise<Response> {
	const timeoutMs = opts?.timeoutMs ?? 10_000;
	const method = init.method ?? 'GET';

	try {
		const response = await fetch(url, {
			...init,
			signal: AbortSignal.timeout(timeoutMs)
		});

		if (!response.ok) {
			const body = await response.text().catch(() => '');
			const snippet = body.slice(0, 500);
			console.error(
				`[COG] ${label} failed | ${method} ${url} | status=${response.status} | body=${snippet}`
			);
			throw new Error(`[COG] ${label}: HTTP ${response.status}`);
		}

		return response;
	} catch (error) {
		if (error instanceof Error && error.message.startsWith('[COG]')) {
			throw error;
		}
		console.error(`[COG] ${label} failed | ${method} ${url} | ${(error as Error).message}`);
		throw error;
	}
}

// ----------------------------------------------------------------------------
// /persons/avatar
// ----------------------------------------------------------------------------
const cache = new LRUCache({
	max: 200,
	ttl: 1000 * 60 * 60 * 24
});

export async function getAvatar(crNumber: string, size = 128) {
	const cacheKey = `${crNumber}_${size}`;
	if (cache.has(cacheKey)) {
		return cache.get(cacheKey) as string;
	}

	try {
		let path = `${env.UFDATA_REPO_PATH}/photos/${crNumber}.jpg`;

		try {
			await fs.promises.access(path);
		} catch (err) {
			console.log(`could not read path to avatar: ${path}, using default`);
			console.log(err);
			path = `${env.UFDATA_REPO_PATH}/photos/default.png`;
		}

		const buffer = await sharp(path)
			.resize(size, size, {
				fit: 'cover',
				position: 'centre'
			})
			.webp({ quality: 80 })
			.toBuffer();

		const data = `data:image/webp;base64,${buffer.toString('base64')}`;

		cache.set(cacheKey, data);
		return data;
	} catch (e) {
		console.log(`could not fetch avatar for crNumber ${crNumber}: ${e}`);
		throw e;
	}
}

// ----------------------------------------------------------------------------
// /persons/claims
// ----------------------------------------------------------------------------
export async function getClaims(token: string, crNumber: string) {
	try {
		const url = `${BASE_URL}/persons/claims/${crNumber}`;
		const response = await cogFetch(
			'getClaims',
			url,
			{
				method: 'GET',
				headers: headers(token)
			},
			{ timeoutMs: 5000 }
		);

		const data = await response.json();
		return ClaimsSchema.parse(data);
	} catch (e) {
		console.error(`could not fetch claims for crNumber ${crNumber}: ${e}`);
		return [];
	}
}

// ----------------------------------------------------------------------------
// /products
// ----------------------------------------------------------------------------
export async function getProduct(uuid: string) {
	const url = `${BASE_URL}/products/${uuid}`;
	try {
		const response = await fetch(url, {
			method: 'GET',
			headers: headers(undefined),
			signal: AbortSignal.timeout(10_000)
		});

		if (response.status === 404) {
			return null;
		}

		if (!response.ok) {
			const body = await response.text().catch(() => '');
			const snippet = body.slice(0, 500);
			console.error(
				`[COG] getProduct failed | GET ${url} | status=${response.status} | body=${snippet}`
			);
			throw new Error(`[COG] getProduct: HTTP ${response.status}`);
		}

		const data = await response.json();
		return ProductSchema.parse(data);
	} catch (e) {
		console.error(`[COG] getProduct failed | GET ${url} | ${(e as Error).message}`);
		throw e;
	}
}

export async function getProductByEan(ean: string) {
	const url = `${BASE_URL}/products/byEan/${ean}`;
	try {
		const response = await fetch(url, {
			method: 'GET',
			headers: headers(undefined),
			signal: AbortSignal.timeout(10_000)
		});

		if (response.status === 404) {
			return null;
		}

		if (!response.ok) {
			const body = await response.text().catch(() => '');
			const snippet = body.slice(0, 500);
			console.error(
				`[COG] getProductByEan failed | GET ${url} | status=${response.status} | body=${snippet}`
			);
			throw new Error(`[COG] getProductByEan: HTTP ${response.status}`);
		}

		const data = await response.json();
		return ProductSchema.parse(data);
	} catch (e) {
		console.error(`[COG] getProductByEan failed | GET ${url} | ${(e as Error).message}`);
		throw e;
	}
}

export async function getProducts() {
	const url = `${BASE_URL}/products`;
	const response = await cogFetch('getProducts', url, {
		method: 'GET',
		headers: headers(undefined)
	});

	const data = await response.json();
	return ProductsSchema.parse(data);
}

export async function updateProduct(token: string, product: Product) {
	const url = `${BASE_URL}/products/${product.uuid}`;
	await cogFetch('updateProduct', url, {
		method: 'PUT',
		headers: headers(token),
		body: JSON.stringify(product)
	});
}

export async function createProduct(token: string, product: NewProduct) {
	const url = `${BASE_URL}/products`;
	const response = await cogFetch('createProduct', url, {
		method: 'POST',
		headers: headers(token),
		body: JSON.stringify(product)
	});

	return ProductSchema.parse(await response.json());
}

export async function deleteProduct(token: string, uuid: string) {
	const url = `${BASE_URL}/products/${uuid}`;
	await cogFetch('deleteProduct', url, {
		method: 'DELETE',
		headers: headers(token)
	});
}

export async function getProductCategories() {
	const url = `${BASE_URL}/products/allProductCategories`;
	const response = await cogFetch('getProductCategories', url, {
		method: 'GET',
		headers: headers(undefined)
	});

	const data = await response.json();
	return ProductCategoriesSchema.parse(data);
}

export async function getBillingCategories() {
	const url = `${BASE_URL}/products/allBillingCategories`;
	const response = await cogFetch('getBillingCategories', url, {
		method: 'GET',
		headers: headers(undefined)
	});

	const data = await response.json();
	return BillingCategoriesSchema.parse(data);
}

export async function getUnitNames() {
	const url = `${BASE_URL}/products/allUnitNames`;
	const response = await cogFetch('getUnitNames', url, {
		method: 'GET',
		headers: headers(undefined)
	});

	const data = await response.json();
	return UnitNamesSchema.parse(data);
}

export async function getVatPercentages() {
	const url = `${BASE_URL}/products/allVats`;
	const response = await cogFetch('getVatPercentages', url, {
		method: 'GET',
		headers: headers(undefined)
	});

	const data = await response.json();
	return VatPercentagesSchema.parse(data);
}

// ----------------------------------------------------------------------------
// /purchases
// ----------------------------------------------------------------------------
export async function getPurchases(token: string, crNumber: string, offset = 0) {
	const url = `${BASE_URL}/purchases/perUserMonth/${crNumber}/${offset}`;
	const response = await cogFetch('getPurchases', url, {
		method: 'GET',
		headers: headers(token)
	});

	const data = await response.json();
	return HistoricPurchasesSchema.parse(data);
}

export async function purchaseProduct(token: string, purchase: Purchase) {
	const url = `${BASE_URL}/purchases/product`;
	await cogFetch('purchaseProduct', url, {
		method: 'POST',
		headers: headers(token),
		body: JSON.stringify(purchase)
	});

	// TODO: parse and return purchase json when cog supports it
}

// ----------------------------------------------------------------------------
// /resources
// ----------------------------------------------------------------------------
export async function getResources(prefix: string | null = null) {
	const url = `${BASE_URL}/resources${prefix ? `/prefix/${prefix}` : ''}`;
	const response = await cogFetch('getResources', url, {
		method: 'GET',
		headers: headers(undefined)
	});

	const data = await response.json();
	return ResourcesSchema.parse(data);
}

export async function getOpenPeriods(prefix: string | null = null) {
	const url = `${BASE_URL}/resources/periods/open${prefix ? `/${prefix}` : ''}`;
	const response = await cogFetch('getOpenPeriods', url, {
		method: 'GET',
		headers: headers(undefined)
	});

	const data = await response.json();
	return PeriodsSchema.parse(data);
}

export async function startPeriod(token: string, period: NewHoldingPeriod) {
	const url = `${BASE_URL}/resources/periods`;
	const response = await cogFetch('startPeriod', url, {
		method: 'POST',
		headers: headers(token),
		body: JSON.stringify(period)
	});

	const data = await response.json();
	return PeriodsSchema.element.parse(data);
}

export async function closePeriod(token: string, uuid: string) {
	const url = `${BASE_URL}/resources/periods/${uuid}`;
	await cogFetch('closePeriod', url, {
		method: 'DELETE',
		headers: headers(token)
	});
}

export async function getMyClosedPeriods(token: string, prefix: string) {
	const url = `${BASE_URL}/resources/periods/myClosed/${prefix}`;
	const response = await cogFetch('getMyClosedPeriods', url, {
		method: 'GET',
		headers: headers(token)
	});

	const data = await response.json();
	return PeriodsSchema.parse(data);
}

export async function getEstimatedCost(
	token: string,
	samplePeriod: {
		resourceName: string;
		startDate: Date;
		endDate: Date;
	}
) {
	const url = `${BASE_URL}/resources/periods/estimatedCost`;
	const response = await cogFetch('getEstimatedCost', url, {
		method: 'POST',
		headers: headers(token),
		body: JSON.stringify(samplePeriod)
	});

	const data = await response.json();
	return PeriodCostSchema.parse(data);
}

export async function getPeriodDiscount(token: string, costModel: string) {
	const url = `${BASE_URL}/resources/periods/discount/${costModel}`;
	const response = await cogFetch('getPeriodDiscount', url, {
		method: 'GET',
		headers: headers(token)
	});

	const data = await response.json();
	return PeriodDiscountSchema.parse(data);
}
