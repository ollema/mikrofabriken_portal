<script lang="ts">
	import InvoiceDetails from '$lib/components/invoice/invoice-details.svelte';
	import { page } from '$app/stores';

	let { data } = $props();

	function getPdfUrl(documentNumber: string) {
		return `/admin/members/${$page.params.slackID}/invoices/${documentNumber}/pdf`;
	}
</script>

<InvoiceDetails {data} {getPdfUrl} />
