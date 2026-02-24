<!-- src/routes/(protected)/anexos-consorcio/+page.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { requireAuth } from '$lib/guards/auth.guard';
	import WizardAnexosConsorcioPage from '$lib/features/anexos-consorcio/WizardAnexosConsorcioPage.svelte';

	onMount(() => {
		requireAuth();
	});
</script>

<WizardAnexosConsorcioPage />