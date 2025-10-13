<!-- src/lib/features/dashboard/DashboardPage.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { dashboardStore } from './stores/dashboard.svelte';
	import StatsCard from './components/StatsCard.svelte';
	import AlertaPerfilIncompleto from './components/AlertaPerfilIncompleto.svelte';
	import GenerarDocumentosSection from './components/GenerarDocumentosSection.svelte';
	import DocumentosRecientes from './components/DocumentosRecientes.svelte';
	import DashboardSidebar from './components/DashboardSidebar.svelte';

	// Cargar datos al montar el componente
	onMount(() => {
		dashboardStore.loadDashboardData();
	});

	// Handlers para acciones
	function handleEditarPerfil() {
		console.log('Editar perfil empresarial');
		// TODO: Navegar a la página de perfil
	}

	function handleCompletarPerfil() {
		console.log('Completar perfil empresarial');
		// TODO: Navegar a la página de perfil
	}

	function handleIniciarProceso() {
		console.log('Iniciar proceso completo de licitación');
		// TODO: Navegar al wizard de generación de documentos
	}

	function handleGenerarAnexo1() {
		console.log('Generar Anexo N° 1');
		// TODO: Navegar a la página de generación del Anexo 1
	}

	function handleGenerarAnexo2() {
		console.log('Generar Anexo N° 2');
		// TODO: Navegar a la página de generación del Anexo 2
	}

	function handleGenerarAnexo3() {
		console.log('Generar Anexo N° 3');
		// TODO: Navegar a la página de generación del Anexo 3
	}

	function handleVerDocumento(id: number) {
		console.log(`Ver documento con ID: ${id}`);
		// TODO: Abrir vista previa del documento
	}

	function handleDescargarDocumento(id: number) {
		console.log(`Descargar documento con ID: ${id}`);
		// TODO: Iniciar descarga del documento
	}

	function handleVerTodosDocumentos() {
		console.log('Ver todos los documentos');
		// TODO: Navegar a la página de historial de documentos
	}

	function handleGestionarPerfil() {
		console.log('Gestionar perfil empresarial');
		// TODO: Navegar a la página de perfil
	}
</script>

<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
	<!-- Alerta de perfil incompleto -->
	{#if dashboardStore.perfilIncompleto && dashboardStore.estadisticas}
		<AlertaPerfilIncompleto
			perfilCompleto={dashboardStore.estadisticas.perfilCompleto}
			onCompletar={handleCompletarPerfil}
		/>
	{/if}

	<!-- Estadísticas principales -->
	{#if dashboardStore.isLoading}
		<div class="flex justify-center items-center py-12">
			<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
		</div>
	{:else if dashboardStore.estadisticas}
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
			<StatsCard
				title="Documentos Generados"
				value={dashboardStore.estadisticas.documentosGenerados}
				subtitle="Este mes"
				iconBgColor="bg-indigo-100 dark:bg-indigo-900"
			>
				{#snippet icon()}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="2"
						stroke="currentColor"
						class="w-5 h-5 text-indigo-600 dark:text-indigo-400"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
						/>
					</svg>
				{/snippet}
			</StatsCard>

			<StatsCard
				title="Perfil Empresarial"
				value="{dashboardStore.estadisticas.perfilCompleto}%"
				progressValue={dashboardStore.estadisticas.perfilCompleto}
				iconBgColor="bg-purple-100 dark:bg-purple-900"
				onEdit={handleEditarPerfil}
			>
				{#snippet icon()}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="2"
						stroke="currentColor"
						class="w-5 h-5 text-purple-600 dark:text-purple-400"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z"
						/>
					</svg>
				{/snippet}
			</StatsCard>
		</div>
	{/if}

	<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
		<!-- Contenido principal -->
		<div class="lg:col-span-2 space-y-8">
			<!-- Sección de generación de documentos -->
			<GenerarDocumentosSection
				onIniciarProceso={handleIniciarProceso}
				onGenerarAnexo1={handleGenerarAnexo1}
				onGenerarAnexo2={handleGenerarAnexo2}
				onGenerarAnexo3={handleGenerarAnexo3}
			/>

			<!-- Documentos recientes -->
			{#if dashboardStore.documentosRecientes.length > 0}
				<DocumentosRecientes
					documentos={dashboardStore.documentosRecientes}
					onVer={handleVerDocumento}
					onDescargar={handleDescargarDocumento}
					onVerTodos={handleVerTodosDocumentos}
				/>
			{/if}
		</div>

		<!-- Sidebar -->
		<div class="lg:col-span-1">
			<DashboardSidebar onGestionarPerfil={handleGestionarPerfil} />
		</div>
	</div>
</main>