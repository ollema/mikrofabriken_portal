import * as fs from 'node:fs';
import sharp from 'sharp';

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
import type { NewHoldingPeriod, NewProduct, Product, Purchase } from '$lib/types/cog.js';

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
		let path = `${env.UFPERSONSLIST_REPO_PATH}/photos/${crNumber}.jpg`;

		try {
			await fs.promises.access(path);
		} catch (err) {
			console.log(`could not read path to avatar: ${path}, using default`);
			console.log(err);
			path = `${env.UFPERSONSLIST_REPO_PATH}/photos/default.png`;
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

// ----------------------------------------------------------------------------
// /products
// ----------------------------------------------------------------------------
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

export async function deleteProduct(token: string, uuid: string) {
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

// ----------------------------------------------------------------------------
// /purchases
// ----------------------------------------------------------------------------
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

// ----------------------------------------------------------------------------
// /resources
// ----------------------------------------------------------------------------
export async function getResources(prefix: string | null = null) {
	try {
		const response = await fetch(`${BASE_URL}/resources${prefix ? `/prefix/${prefix}` : ''}`, {
			method: 'GET',
			headers: headers(undefined)
		});

		if (!response.ok) {
			throw new Error(`http error: ${response.status} ${response.statusText}`);
		}

		const data = await response.json();
		return ResourcesSchema.parse(data);
	} catch (e) {
		console.error(
			prefix ? `could not fetch resources with prefix ${prefix}` : 'could not fetch resources'
		);
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
		const periods = PeriodsSchema.parse(data);

		return periods;
	} catch (e) {
		console.error(`could not fetch open periods`);
		throw e;
	}
}

export async function startPeriod(token: string, period: NewHoldingPeriod) {
	try {
		const response = await fetch(`${BASE_URL}/resources/periods`, {
			method: 'POST',
			headers: headers(token),
			body: JSON.stringify(period)
		});

		if (!response.ok) {
			throw new Error(`http error: ${response.status} ${response.statusText}`);
		}

		const data = await response.json();
		return PeriodsSchema.element.parse(data);
	} catch (e) {
		console.error('could not start period');
		throw e;
	}
}

export async function closePeriod(token: string, uuid: string) {
	try {
		const response = await fetch(`${BASE_URL}/resources/periods/${uuid}`, {
			method: 'DELETE',
			headers: headers(token)
		});

		if (!response.ok) {
			throw new Error(`http error: ${response.status} ${response.statusText}`);
		}
	} catch (e) {
		console.error(`could not close period ${uuid}`);
		throw e;
	}
}

export async function getClosedPeriods(token: string, monthOffset: number, prefix: string) {
	try {
		const response = await fetch(`${BASE_URL}/resources/periods/closed/${monthOffset}/${prefix}`, {
			method: 'GET',
			headers: headers(token)
		});

		if (!response.ok) {
			throw new Error(`http error: ${response.status} ${response.statusText}`);
		}

		const data = await response.json();
		const periods = PeriodsSchema.parse(data);

		return periods;
	} catch (e) {
		console.error(
			`could not fetch closed periods for month offset ${monthOffset} and prefix ${prefix}`
		);
		throw e;
	}
}

export async function getMyClosedPeriods(token: string, prefix: string) {
	try {
		const response = await fetch(`${BASE_URL}/resources/periods/myClosed/${prefix}`, {
			method: 'GET',
			headers: headers(token)
		});

		if (!response.ok) {
			throw new Error(`http error: ${response.status} ${response.statusText}`);
		}

		const data = await response.json();
		const periods = PeriodsSchema.parse(data);

		return periods;
	} catch (e) {
		console.error(`could not fetch my closed periods for prefix ${prefix}`);
		throw e;
	}
}

export async function getEstimatedCost(
	token: string,
	samplePeriod: {
		resourceName: string;
		startDate: Date;
		endDate: Date;
	}
) {
	try {
		const response = await fetch(`${BASE_URL}/resources/periods/estimatedCost`, {
			method: 'POST',
			headers: headers(token),
			body: JSON.stringify(samplePeriod)
		});

		if (!response.ok) {
			throw new Error(`http error: ${response.status} ${response.statusText}`);
		}

		const data = await response.json();
		return PeriodCostSchema.parse(data);
	} catch (e) {
		console.error(`could not get estimated cost for period`);
		throw e;
	}
}

export async function getPeriodDiscount(token: string, costModel: string) {
	try {
		const response = await fetch(`${BASE_URL}/resources/periods/discount/${costModel}`, {
			method: 'GET',
			headers: headers(token)
		});

		if (!response.ok) {
			throw new Error(`http error: ${response.status} ${response.statusText}`);
		}

		const data = await response.json();
		return PeriodDiscountSchema.parse(data);
	} catch (e) {
		console.error(`could not get period discount for cost model ${costModel}`);
		throw e;
	}
}
