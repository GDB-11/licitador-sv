<!-- src/lib/features/anexos/WizardAnexosPage.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { wizardAnexosStore } from './stores/wizard-anexos.svelte';
	import type { 
		ConfiguracionAnexos, 
		Anexo1Data, 
		Anexo2Data, 
		Anexo3Data,
		EmpresaConsorcio 
	} from './types';
	
	// Componentes
	import WizardProgress from './components/WizardProgress.svelte';
	import PasoConfiguracion from './components/PasoConfiguracion.svelte';
	import PasoAnexo1 from './components/PasoAnexo1.svelte';
	import PasoAnexo2 from './components/PasoAnexo2.svelte';
	import PasoAnexo3 from './components/PasoAnexo3.svelte';
	import PasoResumen from './components/PasoResumen.svelte';

	let empresasDisponibles = $state<EmpresaConsorcio[]>([]);

	onMount(async () => {
		// Load company data for auto-population
		await wizardAnexosStore.fetchCompanyData();
		
		// Cargar empresas disponibles para consorcio (if needed in the future)
		// empresasDisponibles = await wizardAnexosStore.obtenerEmpresasConsorcio();
	});

	function handleGuardarConfiguracion(config: ConfiguracionAnexos) {
		wizardAnexosStore.guardarConfiguracion(config);
		wizardAnexosStore.siguiente();
	}

	function handleGuardarAnexo1(data: Anexo1Data) {
		wizardAnexosStore.guardarAnexo1(data);
		wizardAnexosStore.siguiente();
	}

	function handleGuardarAnexo2(data: Anexo2Data) {
		wizardAnexosStore.guardarAnexo2(data);
		wizardAnexosStore.siguiente();
	}

	function handleGuardarAnexo3(data: Anexo3Data) {
		wizardAnexosStore.guardarAnexo3(data);
		wizardAnexosStore.siguiente();
	}

	async function handleGenerar() {
		if (!wizardAnexosStore.validarDatos()) {
			alert('Por favor complete todos los pasos antes de generar los documentos');
			return [];
		}
		return await wizardAnexosStore.generarDocumentos();
	}

	function handleNuevo() {
		wizardAnexosStore.reiniciar();
	}
</script>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
	<div class="container mx-auto px-4 max-w-5xl">
		<!-- Header -->
		<div class="mb-8">
			<div class="flex items-center justify-between">
				<div>
					<h1 class="text-3xl font-bold text-gray-900 dark:text-white">
						Generador de Anexos
					</h1>
					<p class="mt-2 text-gray-600 dark:text-gray-300">
						Ley N° 32069 - Ley General de Contrataciones Públicas
					</p>
				</div>
				{#if wizardAnexosStore.pasoActual !== 'configuracion'}
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

		<!-- Progress bar -->
		<div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
			<WizardProgress 
				pasoActual={wizardAnexosStore.pasoActual}
				onNavigate={(paso) => wizardAnexosStore.irAPaso(paso)}
			/>
		</div>

		<!-- Contenido del paso actual -->
		<div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
			{#if wizardAnexosStore.pasoActual === 'configuracion'}
				<PasoConfiguracion
					onGuardar={handleGuardarConfiguracion}
					datosIniciales={wizardAnexosStore.configuracion}
				/>
			{:else if wizardAnexosStore.pasoActual === 'anexo1'}
				<PasoAnexo1
					onGuardar={handleGuardarAnexo1}
					onRegresar={() => wizardAnexosStore.anterior()}
					tipoParticipacion={wizardAnexosStore.configuracion?.tipoParticipacion || 'individual'}
					datosIniciales={wizardAnexosStore.anexo1}
					empresasDisponibles={empresasDisponibles}
				/>
			{:else if wizardAnexosStore.pasoActual === 'anexo2'}
				<PasoAnexo2
					onGuardar={handleGuardarAnexo2}
					onRegresar={() => wizardAnexosStore.anterior()}
					datosIniciales={wizardAnexosStore.anexo2}
				/>
			{:else if wizardAnexosStore.pasoActual === 'anexo3'}
				<PasoAnexo3
					onGuardar={handleGuardarAnexo3}
					onRegresar={() => wizardAnexosStore.anterior()}
					datosIniciales={wizardAnexosStore.anexo3}
				/>
			{:else if wizardAnexosStore.pasoActual === 'resumen'}
				<PasoResumen
					configuracion={wizardAnexosStore.configuracion!}
					anexo1={wizardAnexosStore.anexo1!}
					anexo2={wizardAnexosStore.anexo2!}
					anexo3={wizardAnexosStore.anexo3!}
					onRegresar={() => wizardAnexosStore.anterior()}
					onGenerar={handleGenerar}
					onNuevo={handleNuevo}
				/>
			{/if}
		</div>

		<!-- Información adicional -->
		{#if wizardAnexosStore.pasoActual !== 'resumen'}
			<div class="mt-6 bg-blue-50 dark:bg-blue-950 border-l-4 border-blue-600 dark:border-blue-500 p-4 rounded-r-lg">
				<div class="flex items-start space-x-3">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" 
						class="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5">
						<path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
					</svg>
					<div class="flex-1">
						<h4 class="font-semibold text-blue-900 dark:text-blue-100 text-sm">Información</h4>
						<p class="text-sm text-blue-800 dark:text-blue-200 mt-1">
							{#if wizardAnexosStore.pasoActual === 'configuracion'}
								Configure los datos básicos del proceso de contratación. Esta información se utilizará en todos los anexos.
							{:else if wizardAnexosStore.pasoActual === 'anexo1'}
								Complete la declaración jurada de datos del postor. Los campos se auto-completan con la información de su perfil empresarial.
							{:else if wizardAnexosStore.pasoActual === 'anexo2'}
								El Pacto de Integridad es un compromiso ético obligatorio para participar en el proceso de contratación.
							{:else if wizardAnexosStore.pasoActual === 'anexo3'}
								Declare bajo juramento que no tiene impedimentos para contratar con el Estado según la Ley N° 32069.
							{/if}
						</p>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>