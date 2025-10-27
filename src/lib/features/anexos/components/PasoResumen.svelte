<!-- src/lib/features/anexos/components/PasoResumen.svelte -->
<script lang="ts">
	import type { 
		ConfiguracionAnexos, 
		Anexo1Data, 
		Anexo2Data, 
		Anexo3Data,
		DocumentoGenerado 
	} from '../types';

	interface Props {
		configuracion: ConfiguracionAnexos;
		anexo1: Anexo1Data;
		anexo2: Anexo2Data;
		anexo3: Anexo3Data;
		onRegresar: () => void;
		onGenerar: () => Promise<DocumentoGenerado[]>;
		onNuevo: () => void;
	}

	let { 
		configuracion, 
		anexo1, 
		anexo2, 
		anexo3, 
		onRegresar, 
		onGenerar,
		onNuevo
	}: Props = $props();

	let generando = $state(false);
	let documentoGenerado = $state<DocumentoGenerado | null>(null);
	let error = $state<string | null>(null);
	let exitoso = $state(false);

	async function handleGenerar() {
		generando = true;
		error = null;
		try {
			const docs = await onGenerar();
			// Tomamos el primer documento (documento consolidado)
			documentoGenerado = docs[0] || null;
			exitoso = true;
		} catch (err) {
			error = err instanceof Error ? err.message : 'Error al generar documentos';
		} finally {
			generando = false;
		}
	}

	function descargarDocumento(url: string, nombre: string) {
		// Simulación de descarga
		console.log(`Descargando: ${nombre} desde ${url}`);
		alert(`En producción, se descargará: ${nombre}`);
	}
</script>

<div class="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
	<!-- Encabezado -->
	<div class="text-center sm:text-left">
		<h2 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
			Resumen y Generación de Documentos
		</h2>
		<p class="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-300">
			Revise la información antes de generar los anexos consolidados
		</p>
	</div>

	{#if !exitoso}
		<!-- Resumen de la configuración -->
		<div class="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 
			border border-blue-200 dark:border-gray-700 rounded-xl p-4 sm:p-6 shadow-sm">
			<h3 class="font-semibold text-base sm:text-lg text-gray-900 dark:text-white flex items-center mb-4">
				<div class="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-blue-600 dark:bg-blue-500 flex items-center justify-center mr-3 shadow-lg">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" 
						class="w-4 h-4 sm:w-5 sm:h-5 text-white">
						<path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
					</svg>
				</div>
				<span class="text-sm sm:text-base">Datos del Proceso</span>
			</h3>
			<div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
				<div class="bg-white dark:bg-gray-800/50 rounded-lg p-3 shadow-sm">
					<span class="block text-gray-600 dark:text-gray-400 mb-1">Tipo de Participación</span>
					<p class="font-semibold text-gray-900 dark:text-white capitalize">
						{configuracion.tipoParticipacion === 'individual' ? 'Individual' : 'Consorcio'}
					</p>
				</div>
				<div class="bg-white dark:bg-gray-800/50 rounded-lg p-3 shadow-sm">
					<span class="block text-gray-600 dark:text-gray-400 mb-1">Número de Proceso</span>
					<p class="font-semibold text-gray-900 dark:text-white break-all">{configuracion.numeroProceso}</p>
				</div>
				<div class="bg-white dark:bg-gray-800/50 rounded-lg p-3 shadow-sm">
					<span class="block text-gray-600 dark:text-gray-400 mb-1">Ciudad</span>
					<p class="font-semibold text-gray-900 dark:text-white">{configuracion.ciudad}</p>
				</div>
				<div class="bg-white dark:bg-gray-800/50 rounded-lg p-3 shadow-sm sm:col-span-2">
					<span class="block text-gray-600 dark:text-gray-400 mb-1">Entidad</span>
					<p class="font-semibold text-gray-900 dark:text-white">{configuracion.entidad}</p>
				</div>
				<div class="bg-white dark:bg-gray-800/50 rounded-lg p-3 shadow-sm sm:col-span-2">
					<span class="block text-gray-600 dark:text-gray-400 mb-1">Objeto</span>
					<p class="font-semibold text-gray-900 dark:text-white">{configuracion.objeto}</p>
				</div>
			</div>
		</div>

		<!-- Resumen Anexo 1 -->
		<div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
			<h3 class="font-semibold text-base sm:text-lg text-gray-900 dark:text-white flex items-center mb-4">
				<div class="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-green-600 dark:bg-green-500 flex items-center justify-center mr-3 shadow-lg">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" 
						class="w-4 h-4 sm:w-5 sm:h-5 text-white">
						<path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
				</div>
				<div>
					<span class="text-sm sm:text-base">Anexo N° 1</span>
					<p class="text-xs text-gray-600 dark:text-gray-400 font-normal">Declaración Jurada de Datos</p>
				</div>
			</h3>
			<div class="text-xs sm:text-sm space-y-3">
				{#if anexo1.tipoParticipacion === 'individual'}
					<div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
						<span class="block text-gray-600 dark:text-gray-400 mb-1">Empresa</span>
						<p class="font-semibold text-gray-900 dark:text-white break-words">
							{anexo1.razonSocial}
						</p>
						<p class="text-xs text-gray-600 dark:text-gray-400 mt-1">RUC: {anexo1.ruc}</p>
					</div>
					<div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
						<span class="block text-gray-600 dark:text-gray-400 mb-1">Representante Legal</span>
						<p class="font-semibold text-gray-900 dark:text-white">
							{anexo1.representanteLegal}
						</p>
						<p class="text-xs text-gray-600 dark:text-gray-400 mt-1">DNI: {anexo1.dniRepresentante}</p>
					</div>
				{:else}
					<div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
						<span class="block text-gray-600 dark:text-gray-400 mb-1">Consorcio</span>
						<p class="font-semibold text-gray-900 dark:text-white">{anexo1.nombreConsorcio}</p>
					</div>
					<div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
						<span class="block text-gray-600 dark:text-gray-400 mb-2">Miembros del Consorcio</span>
						<ul class="space-y-2">
							{#each anexo1.miembros || [] as miembro}
								<li class="flex items-start justify-between gap-2 text-gray-900 dark:text-white p-2 bg-white dark:bg-gray-900/50 rounded">
									<div class="flex-1 min-w-0">
										<p class="font-medium truncate">{miembro.nombreEmpresa}</p>
										<p class="text-xs text-gray-600 dark:text-gray-400">
											Participación: {miembro.porcentajeParticipacion}%
										</p>
									</div>
									{#if miembro.esLider}
										<span class="flex-shrink-0 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded">
											Líder
										</span>
									{/if}
								</li>
							{/each}
						</ul>
					</div>
				{/if}
				<div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
					<span class="block text-gray-600 dark:text-gray-400 mb-1">Notificaciones por Email</span>
					<p class="font-semibold text-gray-900 dark:text-white break-all">
						{anexo1.autorizaNotificacionesEmail ? `Sí - ${anexo1.emailNotificaciones}` : 'No autorizado'}
					</p>
				</div>
			</div>
		</div>

		<!-- Resumen Anexo 2 -->
		<div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
			<h3 class="font-semibold text-base sm:text-lg text-gray-900 dark:text-white flex items-center mb-4">
				<div class="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-purple-600 dark:bg-purple-500 flex items-center justify-center mr-3 shadow-lg">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" 
						class="w-4 h-4 sm:w-5 sm:h-5 text-white">
						<path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
					</svg>
				</div>
				<div>
					<span class="text-sm sm:text-base">Anexo N° 2</span>
					<p class="text-xs text-gray-600 dark:text-gray-400 font-normal">Pacto de Integridad</p>
				</div>
			</h3>
			<div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
				<div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
					<span class="block text-gray-600 dark:text-gray-400 mb-1">Firmante</span>
					<p class="font-semibold text-gray-900 dark:text-white">{anexo2.representanteLegal}</p>
					<p class="text-xs text-gray-600 dark:text-gray-400 mt-1">{anexo2.cargoRepresentante}</p>
				</div>
				<div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
					<span class="block text-gray-600 dark:text-gray-400 mb-1">Fecha</span>
					<p class="font-semibold text-gray-900 dark:text-white">{anexo2.fecha}</p>
				</div>
				<div class="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 sm:col-span-2 border border-green-200 dark:border-green-800">
					<div class="flex items-center gap-2">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 text-green-600 dark:text-green-400">
							<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
						</svg>
						<span class="font-semibold text-green-700 dark:text-green-300">Compromisos Aceptados</span>
					</div>
				</div>
			</div>
		</div>

		<!-- Resumen Anexo 3 -->
		<div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
			<h3 class="font-semibold text-base sm:text-lg text-gray-900 dark:text-white flex items-center mb-4">
				<div class="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-amber-600 dark:bg-amber-500 flex items-center justify-center mr-3 shadow-lg">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" 
						class="w-4 h-4 sm:w-5 sm:h-5 text-white">
						<path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
					</svg>
				</div>
				<div>
					<span class="text-sm sm:text-base">Anexo N° 3</span>
					<p class="text-xs text-gray-600 dark:text-gray-400 font-normal">Declaración Jurada de Impedimentos</p>
				</div>
			</h3>
			<div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
				<div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
					<span class="block text-gray-600 dark:text-gray-400 mb-1">Declarante</span>
					<p class="font-semibold text-gray-900 dark:text-white">{anexo3.representanteLegal}</p>
				</div>
				<div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
					<span class="block text-gray-600 dark:text-gray-400 mb-1">Fecha</span>
					<p class="font-semibold text-gray-900 dark:text-white">{anexo3.fecha}</p>
				</div>
				<div class="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 sm:col-span-2 border border-green-200 dark:border-green-800">
					<span class="block text-gray-600 dark:text-gray-400 mb-2 text-xs">Declaraciones</span>
					<ul class="space-y-1.5 text-green-700 dark:text-green-300">
						<li class="flex items-start gap-2">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4 mt-0.5 flex-shrink-0">
								<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
							</svg>
							<span>No tiene impedimentos para contratar</span>
						</li>
						<li class="flex items-start gap-2">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4 mt-0.5 flex-shrink-0">
								<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
							</svg>
							<span>Conoce las sanciones por falsedad</span>
						</li>
						<li class="flex items-start gap-2">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4 mt-0.5 flex-shrink-0">
								<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
							</svg>
							<span>Asume plena responsabilidad</span>
						</li>
					</ul>
				</div>
			</div>
		</div>

		<!-- Mensaje de error -->
		{#if error}
			<div class="bg-red-50 dark:bg-red-950 border-l-4 border-red-600 dark:border-red-500 rounded-lg p-4 shadow-lg animate-[fadeIn_0.3s_ease-in]">
				<div class="flex items-start gap-3">
					<div class="flex-shrink-0">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" 
							class="w-5 h-5 sm:w-6 sm:h-6 text-red-600 dark:text-red-400">
							<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
						</svg>
					</div>
					<div class="flex-1 min-w-0">
						<p class="text-sm font-semibold text-red-800 dark:text-red-200">Error al generar documentos</p>
						<p class="text-xs sm:text-sm text-red-700 dark:text-red-300 mt-1 break-words">{error}</p>
					</div>
				</div>
			</div>
		{/if}

		<!-- Botones de acción -->
		<div class="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
			<button
				type="button"
				onclick={onRegresar}
				disabled={generando}
				class="w-full sm:w-auto order-2 sm:order-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 
					rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 font-semibold transition-all
					disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
			>
				Regresar
			</button>
			<button
				type="button"
				onclick={handleGenerar}
				disabled={generando}
				class="w-full sm:flex-1 order-1 sm:order-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 text-white rounded-xl
					hover:from-blue-700 hover:to-blue-800 dark:hover:from-blue-600 dark:hover:to-blue-700 font-semibold transition-all
					disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:scale-105 active:scale-95"
			>
				{#if generando}
					<svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
						<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
					</svg>
					<span>Generando Documentos...</span>
				{:else}
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
						<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
					</svg>
					<span>Generar Documento Consolidado</span>
				{/if}
			</button>
		</div>
	{:else}
		<!-- Pantalla de éxito -->
		<div class="text-center space-y-6 py-8 sm:py-12 animate-[fadeIn_0.5s_ease-in]">
			<div class="flex justify-center">
				<div class="relative">
					<div class="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-green-400 to-green-600 dark:from-green-500 dark:to-green-700 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/50 animate-[scaleIn_0.5s_ease-out]">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" 
							class="w-10 h-10 sm:w-12 sm:h-12 text-white">
							<path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
					</div>
					<div class="absolute inset-0 bg-green-400 dark:bg-green-500 rounded-full animate-ping opacity-20"></div>
				</div>
			</div>
			
			<div class="px-4">
				<h3 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
					¡Documento Generado Exitosamente!
				</h3>
				<p class="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-md mx-auto">
					El documento consolidado con los 3 anexos está listo para descargar
				</p>
			</div>

			<!-- Documento generado -->
			{#if documentoGenerado}
				<div class="max-w-2xl mx-auto px-4">
					<div class="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 
						border-2 border-blue-200 dark:border-blue-800 rounded-2xl p-6 sm:p-8 
						shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
						<div class="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
							<div class="flex-shrink-0">
								<div class="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 
									rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/50 transform rotate-3">
									<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" 
										class="w-8 h-8 sm:w-10 sm:h-10 text-white">
										<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
									</svg>
								</div>
							</div>
							<div class="flex-1 text-center sm:text-left">
								<p class="font-bold text-lg sm:text-xl text-gray-900 dark:text-white break-words">
									{documentoGenerado.titulo}
								</p>
								<p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
									Generado el {new Date(documentoGenerado.fechaGeneracion).toLocaleDateString('es-PE', {
										year: 'numeric',
										month: 'long',
										day: 'numeric'
									})}
								</p>
								<div class="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-2">
									<span class="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-semibold rounded-full">
										<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3.5 h-3.5">
											<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
										</svg>
										Anexo 1
									</span>
									<span class="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-semibold rounded-full">
										<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3.5 h-3.5">
											<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
										</svg>
										Anexo 2
									</span>
									<span class="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-semibold rounded-full">
										<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3.5 h-3.5">
											<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
										</svg>
										Anexo 3
									</span>
								</div>
							</div>
							<div class="flex-shrink-0 w-full sm:w-auto">
								<button
									type="button"
									onclick={() => {
										if (documentoGenerado) {
											descargarDocumento(documentoGenerado.url, documentoGenerado.titulo);
										}
									}}
									class="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 
										text-white text-sm font-semibold rounded-xl
										hover:from-blue-700 hover:to-blue-800 dark:hover:from-blue-600 dark:hover:to-blue-700 
										transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 
										hover:shadow-xl hover:scale-105 active:scale-95"
								>
									<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5">
										<path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
									</svg>
									<span>Descargar</span>
								</button>
							</div>
						</div>
					</div>
				</div>
			{/if}

			<!-- Información adicional -->
			<div class="max-w-xl mx-auto px-4">
				<div class="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-4 sm:p-6">
					<div class="flex items-start gap-3">
						<div class="flex-shrink-0">
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" 
								class="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400">
								<path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
							</svg>
						</div>
						<div class="text-left flex-1">
							<p class="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
								Documento consolidado generado
							</p>
							<p class="text-xs sm:text-sm text-blue-700 dark:text-blue-300">
								Este archivo contiene todos los anexos requeridos (Anexo 1, 2 y 3) en un solo documento PDF listo para presentar en el proceso de contratación pública.
							</p>
						</div>
					</div>
				</div>
			</div>

			<!-- Botones de acción -->
			<div class="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 pt-6 px-4">
				<button
					type="button"
					onclick={onNuevo}
					class="w-full sm:w-auto px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 
						rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 font-semibold transition-all
						hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
				>
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
						<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
					</svg>
					<span>Generar Nuevos Anexos</span>
				</button>
				<a
					href="/dashboard"
					class="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 
						text-white rounded-xl hover:from-blue-700 hover:to-blue-800 dark:hover:from-blue-600 dark:hover:to-blue-700 
						font-semibold transition-all inline-flex items-center justify-center gap-2
						shadow-lg shadow-blue-500/30 hover:shadow-xl hover:scale-105 active:scale-95"
				>
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
						<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
					</svg>
					<span>Ir al Dashboard</span>
				</a>
			</div>
		</div>
	{/if}
</div>

<style>
	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes scaleIn {
		from {
			opacity: 0;
			transform: scale(0.5);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}
</style>