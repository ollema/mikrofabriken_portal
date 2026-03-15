<script lang="ts">
	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button/index.js';
</script>

<div class="flex flex-col items-center justify-center gap-4 py-20">
	<h1 class="text-6xl font-bold">{page.status}</h1>
	<p class="text-muted-foreground text-lg">{page.error?.message ?? 'Ett oväntat fel inträffade.'}</p>
	<Button href="/" variant="outline">Tillbaka till startsidan</Button>
</div>
