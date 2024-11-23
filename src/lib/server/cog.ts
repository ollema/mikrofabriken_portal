import {
	ProductSchema,
	ProductsSchema,
	HistoricPurchasesSchema,
	OpenPeriodsSchema,
	BillingCategoriesSchema,
	ProductCategoriesSchema,
	UnitNamesSchema,
	VatPercentagesSchema,
	ClaimsSchema
} from '$lib/schemas/cog';
import type { NewProduct, Product, Purchase } from '$lib/types/cog';

import { LRUCache } from 'lru-cache';

import { env } from '$env/dynamic/private';

const BASE_URL = env.UF_COG_BASE_URL;

function headers(token: string | undefined) {
	return {
		Accept: 'application/json',
		'Content-Type': 'application/json',
		...(token ? { Authorization: `Bearer ${token}` } : {})
	};
}

export async function getProduct(uuid: string) {
	try {
		const response = await fetch(`${BASE_URL}/products/${uuid}`, {
			method: 'GET',
			headers: headers(undefined)
		});

		if (response.status === 404) {
			return null;
		}

		if (!response.ok) {
			throw new Error(`http error: ${response.status} ${response.statusText}`);
		}

		const data = await response.json();
		const product = ProductSchema.parse(data);

		return product;
	} catch (e) {
		console.error(`could not fetch product info for ${uuid}`);
		throw e;
	}
}

export async function getProductByEan(ean: string) {
	try {
		const response = await fetch(`${BASE_URL}/products/byEan/${ean}`, {
			method: 'GET',
			headers: headers(undefined)
		});

		if (response.status === 404) {
			return null;
		}

		if (!response.ok) {
			throw new Error(`http error: ${response.status} ${response.statusText}`);
		}

		const data = await response.json();
		const product = ProductSchema.parse(data);

		return product;
	} catch (e) {
		console.error(`could not fetch product info for ${ean}`);
		throw e;
	}
}

export async function getProducts() {
	try {
		const response = await fetch(`${BASE_URL}/products`, {
			method: 'GET',
			headers: headers(undefined)
		});

		if (!response.ok) {
			throw new Error(`http error: ${response.status} ${response.statusText}`);
		}

		const data = await response.json();
		const products = ProductsSchema.parse(data);

		return products;
	} catch (e) {
		console.error('could not fetch products');
		throw e;
	}
}

export async function updateProduct(token: string, product: Product) {
	try {
		const response = await fetch(`${BASE_URL}/products/${product.uuid}`, {
			method: 'PUT',
			headers: headers(token),
			body: JSON.stringify(product)
		});

		if (!response.ok) {
			throw new Error(`http error: ${response.status} ${response.statusText}`);
		}
	} catch (e) {
		console.error(`could not update product ${product.uuid}`);
		throw e;
	}
}

export async function createProduct(token: string, product: NewProduct) {
	try {
		const response = await fetch(`${BASE_URL}/products`, {
			method: 'POST',
			headers: headers(token),
			body: JSON.stringify(product)
		});

		if (!response.ok) {
			throw new Error(`http error: ${response.status} ${response.statusText}`);
		}

		return ProductSchema.parse(await response.json());
	} catch (e) {
		console.error(`could not create product`);
		throw e;
	}
}

export async function removeProduct(token: string, uuid: string) {
	try {
		const response = await fetch(`${BASE_URL}/products/${uuid}`, {
			method: 'DELETE',
			headers: headers(token)
		});

		if (!response.ok) {
			throw new Error(`http error: ${response.status} ${response.statusText}`);
		}
	} catch (e) {
		console.error(`could not remove product ${uuid}`);
		throw e;
	}
}

export async function getProductCategories() {
	try {
		const response = await fetch(`${BASE_URL}/products/allProductCategories`, {
			method: 'GET',
			headers: headers(undefined)
		});

		if (!response.ok) {
			throw new Error(`http error: ${response.status} ${response.statusText}`);
		}

		const data = await response.json();
		return ProductCategoriesSchema.parse(data);
	} catch (e) {
		console.error('could not fetch product categories');
		throw e;
	}
}

export async function getBillingCategories() {
	try {
		const response = await fetch(`${BASE_URL}/products/allBillingCategories`, {
			method: 'GET',
			headers: headers(undefined)
		});

		if (!response.ok) {
			throw new Error(`http error: ${response.status} ${response.statusText}`);
		}

		const data = await response.json();
		return BillingCategoriesSchema.parse(data);
	} catch (e) {
		console.error('could not fetch billing categories');
		throw e;
	}
}

export async function getUnitNames() {
	try {
		const response = await fetch(`${BASE_URL}/products/allUnitNames`, {
			method: 'GET',
			headers: headers(undefined)
		});

		if (!response.ok) {
			throw new Error(`http error: ${response.status} ${response.statusText}`);
		}

		const data = await response.json();
		return UnitNamesSchema.parse(data);
	} catch (e) {
		console.error('could not fetch unit names');
		throw e;
	}
}

export async function getVatPercentages() {
	try {
		const response = await fetch(`${BASE_URL}/products/allVats`, {
			method: 'GET',
			headers: headers(undefined)
		});

		if (!response.ok) {
			throw new Error(`http error: ${response.status} ${response.statusText}`);
		}

		const data = await response.json();
		return VatPercentagesSchema.parse(data);
	} catch (e) {
		console.error('could not fetch VAT percentages');
		throw e;
	}
}

export async function getPurchases(token: string, crNumber: string, offset = 0) {
	try {
		const response = await fetch(`${BASE_URL}/purchases/perUserMonth/${crNumber}/${offset}`, {
			method: 'GET',
			headers: headers(token)
		});

		if (!response.ok) {
			throw new Error(`http error: ${response.status} ${response.statusText}`);
		}

		const data = await response.json();
		const purchases = HistoricPurchasesSchema.parse(data);

		return purchases;
	} catch (e) {
		console.error(`could not fetch purchases for token ${token}`);
		throw e;
	}
}

export async function purchaseProduct(token: string, purchase: Purchase) {
	try {
		const response = await fetch(`${BASE_URL}/purchases/product`, {
			method: 'POST',
			headers: headers(token),
			body: JSON.stringify(purchase)
		});

		if (!response.ok) {
			throw new Error(`http error: ${response.status} ${response.statusText}`);
		}

		// TODO: parse and return purchase json when cog supports it
	} catch (e) {
		console.error(`could not purchase product ${purchase.productUuid} for token ${token}`);
		throw e;
	}
}

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
		const response = await fetch(`${BASE_URL}/persons/avatar/${size}/${crNumber}?raw=true`, {
			method: 'GET',
			headers: headers(undefined)
		});

		if (!response.ok) {
			return undefined;
		}

		const data = await response.blob();
		const buffer = Buffer.from(await data.arrayBuffer());
		const base64Data = `data:image/png;base64,${buffer.toString('base64')}`;

		cache.set(cacheKey, base64Data);
		return base64Data;
	} catch (e) {
		console.error(`could not fetch avatar for crNumber ${crNumber}`);
		throw e;
	}
}

export async function getOpenPeriods(prefix: string | null = null) {
	try {
		const response = await fetch(
			`${BASE_URL}/resources/periods/open${prefix ? `/${prefix}` : ''}`,
			{
				method: 'GET',
				headers: headers(undefined)
			}
		);

		if (!response.ok) {
			throw new Error(`http error: ${response.status} ${response.statusText}`);
		}

		const data = await response.json();
		const periods = OpenPeriodsSchema.parse(data);

		return periods;
	} catch (e) {
		console.error(`could not fetch open periods`);
		throw e;
	}
}

export async function getClaims(token: string, crNumber: string) {
	try {
		const response = await Promise.race([
			fetch(`${BASE_URL}/persons/claims/${crNumber}`, {
				method: 'GET',
				headers: headers(token)
			}),
			new Promise<Response>((_, reject) =>
				setTimeout(() => reject(new Error('Request timeout')), 5000)
			)
		]);

		if (!response.ok) {
			throw new Error(`http error: ${response.status} ${response.statusText}`);
		}

		const data = await response.json();
		const claims = ClaimsSchema.parse(data);

		return claims;
	} catch (e) {
		console.error(`could not fetch claims for crNumber ${crNumber}: ${e}`);
		return [];
	}
}