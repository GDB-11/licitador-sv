<!-- src/routes/(protected)/+layout.svelte -->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import DashboardHeader from '$lib/features/dashboard/components/DashboardHeader.svelte';
	import { dashboardStore } from '$lib/features/dashboard/stores/dashboard.svelte';
	import { authStore } from '$lib/features/auth/stores/auth.svelte';
	import { goto } from '$app/navigation';

	interface ProtectedLayoutProps {
		children: Snippet;
	}

	let { children }: ProtectedLayoutProps = $props();

	function handleSettings() {
		console.log('Abrir configuración');
		// TODO: Implementar navegación a configuración
	}

	async function handleLogout() {
		await authStore.logout();
		goto('/login');
	}
</script>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
	<!-- Header del dashboard -->
	<DashboardHeader 
		nombreEmpresa={dashboardStore.companyName}
		nombreUsuario={dashboardStore.userName}
		onSettings={handleSettings} 
		onLogout={handleLogout} 
	/>

	<!-- Contenido principal -->
	<main class="flex-1">
		{@render children()}
	</main>
</div>