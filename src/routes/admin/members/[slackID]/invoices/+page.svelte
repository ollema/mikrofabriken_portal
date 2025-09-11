<script lang="ts">
	import InvoiceList from '$lib/components/invoice/invoice-list.svelte';
	import { page } from '$app/stores';
	import type { Invoice } from '$lib/types/fortnox.js';

	let { data } = $props();

	function getInvoiceUrl(invoice: Invoice) {
		return `/admin/members/${$page.params.slackID}/invoices/${invoice.DocumentNumber}`;
	}
</script>

<InvoiceList {data} {getInvoiceUrl} />
