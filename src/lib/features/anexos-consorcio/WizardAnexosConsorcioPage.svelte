<!-- src/lib/features/anexos-consorcio/WizardAnexosConsorcioPage.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { wizardConsorcioStore } from './stores/wizard-anexos-consorcio.svelte';
	import { authStore } from '$lib/features/auth/stores/auth.svelte';
	import type {
		ConfiguracionConsorcio,
		Anexo1ConsorcioData,
		Anexo2ConsorcioData,
		Anexo3ConsorcioData,
		EstadoWizardConsorcio
	} from './types';

	import WizardProgressConsorcio from './components/WizardProgressConsorcio.svelte';
	import PasoConfiguracionConsorcio from './components/PasoConfiguracionConsorcio.svelte';
	import PasoAnexo1Consorcio from './components/PasoAnexo1Consorcio.svelte';
	import PasoAnexo2Consorcio from './components/PasoAnexo2Consorcio.svelte';
	import PasoAnexo3Consorcio from './components/PasoAnexo3Consorcio.svelte';
	import PasoResumenConsorcio from './components/PasoResumenConsorcio.svelte';

	// Pasos completados para navegación del progress bar
	const pasosCompletados: Set<EstadoWizardConsorcio> = $derived((() => {
		const set = new Set<EstadoWizardConsorcio>();
		if (wizardConsorcioStore.configuracion) set.add('configuracion');
		if (wizardConsorcioStore.anexo1) set.add('anexo1');
		if (wizardConsorcioStore.anexo2) set.add('anexo2');
		if (wizardConsorcioStore.anexo3) set.add('anexo3');
		return set;
	})());

	onMount(async () => {
		if (!authStore.company) await authStore.fetchCompany();
		if (authStore.company?.companyId) {
			await wizardConsorcioStore.fetchDatosIniciales(authStore.company.companyId);
		}
	});

	// ─── Handlers de navegación ───────────────────────────────────────────────

	function handleGuardarConfiguracion(config: ConfiguracionConsorcio) {
		wizardConsorcioStore.guardarConfiguracion(config);
		wizardConsorcioStore.siguiente();
	}

	function handleGuardarAnexo1(data: Anexo1ConsorcioData) {
		wizardConsorcioStore.guardarAnexo1(data);
		wizardConsorcioStore.siguiente();
	}

	function handleGuardarAnexo2(data: Anexo2ConsorcioData) {
		wizardConsorcioStore.guardarAnexo2(data);
		wizardConsorcioStore.siguiente();
	}

	function handleGuardarAnexo3(data: Anexo3ConsorcioData) {
		wizardConsorcioStore.guardarAnexo3(data);
		wizardConsorcioStore.siguiente();
	}

	async function handleGenerar() {
		if (!wizardConsorcioStore.validarDatos()) {
			alert('Por favor complete todos los pasos antes de generar los documentos');
			return [];
		}
		return await wizardConsorcioStore.generarDocumentos();
	}

	function handleNuevo() {
		wizardConsorcioStore.reiniciar();
	}
</script>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
	<div class="container mx-auto px-4 max-w-5xl">

		<!-- ── Header ─────────────────────────────────────────────────────────── -->
		<div class="mb-8 flex items-start justify-between gap-4">
			<div>
				<div class="flex items-center gap-3 mb-1">
					<!-- Badge consorcio -->
					<span class="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-100 dark:bg-indigo-900/40
						text-indigo-700 dark:text-indigo-300 text-xs font-semibold rounded-full border border-indigo-200 dark:border-indigo-700">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3.5 h-3.5">
							<path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
						</svg>
						Modalidad Consorcio
					</span>
				</div>
				<h1 class="text-3xl font-bold text-gray-900 dark:text-white">Generador de Anexos</h1>
				<p class="mt-1 text-gray-600 dark:text-gray-300">
					Ley N° 32069 · Participación en Consorcio
				</p>
			</div>

			<div class="flex items-center gap-3">
				<!-- Link a modalidad individual -->
				<a
					href="/generar-anexos"
					class="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-600 dark:text-gray-400
						border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
				>
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3.5 h-3.5">
						<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
					</svg>
					Modo Individual
				</a>

				{#if wizardConsorcioStore.pasoActual !== 'configuracion'}
					<button
						onclick={handleNuevo}
						class="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white
							border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
					>
						Cancelar
					</button>
				{/if}
			</div>
		</div>

		<!-- ── Progress bar ────────────────────────────────────────────────────── -->
		<div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
			<WizardProgressConsorcio
				pasoActual={wizardConsorcioStore.pasoActual}
				{pasosCompletados}
				onNavigate={(paso) => wizardConsorcioStore.irAPaso(paso)}
			/>
		</div>

		<!-- ── Error global ────────────────────────────────────────────────────── -->
		{#if wizardConsorcioStore.error && wizardConsorcioStore.pasoActual === 'configuracion'}
			<div class="mb-4 rounded-lg border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/30 p-4 flex items-start gap-3">
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5">
					<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
				</svg>
				<div>
					<p class="text-sm font-medium text-amber-800 dark:text-amber-200">Advertencia</p>
					<p class="text-xs text-amber-700 dark:text-amber-300 mt-0.5">{wizardConsorcioStore.error}</p>
				</div>
			</div>
		{/if}

		<!-- ── Cargando datos iniciales ───────────────────────────────────────── -->
		{#if wizardConsorcioStore.isLoading && wizardConsorcioStore.pasoActual === 'configuracion' && !wizardConsorcioStore.companyDetails}
			<div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-16 text-center">
				<svg class="animate-spin w-10 h-10 text-blue-600 dark:text-blue-400 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
					<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
					<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
				</svg>
				<p class="text-gray-600 dark:text-gray-400 font-medium">Cargando datos del consorcio...</p>
				<p class="text-sm text-gray-400 dark:text-gray-500 mt-1">
					Obteniendo su perfil empresarial y empresas consorciadas
				</p>
			</div>

		{:else}
			<!-- ── Contenido del paso ──────────────────────────────────────────────── -->
			<div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8">

				{#if wizardConsorcioStore.pasoActual === 'configuracion'}
					<PasoConfiguracionConsorcio
						onGuardar={handleGuardarConfiguracion}
						datosIniciales={wizardConsorcioStore.configuracion}
						empresaPropia={wizardConsorcioStore.companyDetails
							? { razonSocial: wizardConsorcioStore.companyDetails.razonSocial, ruc: wizardConsorcioStore.companyDetails.ruc }
							: null}
						empresasDisponibles={wizardConsorcioStore.empresasDisponibles}
						isLoading={wizardConsorcioStore.isLoading}
					/>

				{:else if wizardConsorcioStore.pasoActual === 'anexo1'}
					<PasoAnexo1Consorcio
						onGuardar={handleGuardarAnexo1}
						onRegresar={() => wizardConsorcioStore.anterior()}
						datosIniciales={wizardConsorcioStore.anexo1}
						configuracion={wizardConsorcioStore.configuracion!}
					/>

				{:else if wizardConsorcioStore.pasoActual === 'anexo2'}
					<PasoAnexo2Consorcio
						onGuardar={handleGuardarAnexo2}
						onRegresar={() => wizardConsorcioStore.anterior()}
						datosIniciales={wizardConsorcioStore.anexo2}
						configuracion={wizardConsorcioStore.configuracion!}
					/>

				{:else if wizardConsorcioStore.pasoActual === 'anexo3'}
					<PasoAnexo3Consorcio
						onGuardar={handleGuardarAnexo3}
						onRegresar={() => wizardConsorcioStore.anterior()}
						datosIniciales={wizardConsorcioStore.anexo3}
						configuracion={wizardConsorcioStore.configuracion!}
					/>

				{:else if wizardConsorcioStore.pasoActual === 'resumen'}
					<PasoResumenConsorcio
						configuracion={wizardConsorcioStore.configuracion!}
						anexo1={wizardConsorcioStore.anexo1!}
						anexo2={wizardConsorcioStore.anexo2!}
						anexo3={wizardConsorcioStore.anexo3!}
						onRegresar={() => wizardConsorcioStore.anterior()}
						onGenerar={handleGenerar}
						onNuevo={handleNuevo}
					/>
				{/if}
			</div>

			<!-- ── Info contextual ──────────────────────────────────────────────────── -->
			{#if wizardConsorcioStore.pasoActual !== 'resumen'}
				<div class="mt-5 bg-blue-50 dark:bg-blue-950/30 border-l-4 border-blue-600 dark:border-blue-500 p-4 rounded-r-lg">
					<div class="flex items-start gap-3">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
							class="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5">
							<path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
						</svg>
						<div>
							<h4 class="font-semibold text-blue-900 dark:text-blue-100 text-sm">Información</h4>
							<p class="text-sm text-blue-800 dark:text-blue-200 mt-0.5">
								{#if wizardConsorcioStore.pasoActual === 'configuracion'}
									Seleccione las empresas que integran el consorcio (máximo 3 en total incluyendo la suya) y designe al líder. Las empresas deben estar registradas previamente en la sección Empresas Consorciadas.
								{:else if wizardConsorcioStore.pasoActual === 'anexo1'}
									Complete los datos de <strong>su empresa</strong>. Los datos de las demás empresas del consorcio se tomarán de sus perfiles registrados.
								{:else if wizardConsorcioStore.pasoActual === 'anexo2'}
									El Pacto de Integridad es obligatorio para cada integrante del consorcio. Usted lo firma en nombre de su empresa.
								{:else if wizardConsorcioStore.pasoActual === 'anexo3'}
									Cada integrante del consorcio debe declarar no tener impedimentos para contratar con el Estado conforme al Art. 50 de la Ley N° 32069.
								{/if}
							</p>
						</div>
					</div>
				</div>
			{/if}
		{/if}
	</div>
</div>