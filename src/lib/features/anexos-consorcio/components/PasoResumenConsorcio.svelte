<!-- src/lib/features/anexos-consorcio/components/PasoResumenConsorcio.svelte -->
<script lang="ts">
	import type {
		ConfiguracionConsorcio,
		Anexo1ConsorcioData,
		Anexo2ConsorcioData,
		Anexo3ConsorcioData,
		DocumentoConsorcioGenerado
	} from '../types';

	interface Props {
		configuracion: ConfiguracionConsorcio;
		anexo1: Anexo1ConsorcioData;
		anexo2: Anexo2ConsorcioData;
		anexo3: Anexo3ConsorcioData;
		onRegresar: () => void;
		onGenerar: () => Promise<DocumentoConsorcioGenerado[]>;
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
	let documentoGenerado = $state<DocumentoConsorcioGenerado | null>(null);
	let error = $state<string | null>(null);
	let exitoso = $state(false);

	const lider = $derived(configuracion.miembros.find((m) => m.esLider));

	async function handleGenerar() {
		generando = true;
		error = null;
		try {
			const docs = await onGenerar();
			documentoGenerado = docs[0] ?? null;
			exitoso = true;
		} catch (err) {
			error = err instanceof Error ? err.message : 'Error al generar documentos';
		} finally {
			generando = false;
		}
	}
</script>

<div class="w-full max-w-5xl mx-auto space-y-6">

	{#if !exitoso}
		<!-- Header -->
		<div>
			<h2 class="text-2xl font-bold text-gray-900 dark:text-white">Resumen y Generación</h2>
			<p class="mt-1 text-gray-600 dark:text-gray-300">
				Revise la información antes de generar los anexos del consorcio
			</p>
		</div>

		<!-- Card: Proceso -->
		<div class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden">
			<div class="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 px-5 py-3">
				<h3 class="text-sm font-semibold text-white">Datos del Proceso</h3>
			</div>
			<div class="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
				<div>
					<p class="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Número de Proceso</p>
					<p class="font-semibold text-gray-900 dark:text-white">{configuracion.numeroProceso}</p>
				</div>
				<div>
					<p class="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Ciudad</p>
					<p class="font-semibold text-gray-900 dark:text-white">{configuracion.ciudad}</p>
				</div>
				<div class="sm:col-span-2">
					<p class="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Entidad</p>
					<p class="font-semibold text-gray-900 dark:text-white">{configuracion.entidad}</p>
				</div>
				<div class="sm:col-span-2">
					<p class="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Objeto</p>
					<p class="font-medium text-gray-900 dark:text-white">{configuracion.objeto}</p>
				</div>
			</div>
		</div>

		<!-- Card: Consorcio -->
		<div class="rounded-xl border border-blue-200 dark:border-blue-800 bg-white dark:bg-gray-900 overflow-hidden">
			<div class="bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-indigo-700 dark:to-blue-700 px-5 py-3">
				<h3 class="text-sm font-semibold text-white">Composición del Consorcio</h3>
			</div>
			<div class="p-5">
				<p class="text-xl font-bold text-gray-900 dark:text-white mb-4">
					{configuracion.nombreConsorcio}
				</p>
				<div class="space-y-2">
					{#each configuracion.miembros as m (m.consortiumCompanyId)}
						<div class="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
							{#if m.esLider}
								<div class="w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center flex-shrink-0">
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4 text-yellow-600 dark:text-yellow-400">
										<path fill-rule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clip-rule="evenodd" />
									</svg>
								</div>
							{:else}
								<div class="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
									<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 text-gray-500 dark:text-gray-400">
										<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
									</svg>
								</div>
							{/if}
							<div class="min-w-0 flex-1">
								<p class="font-medium text-sm text-gray-900 dark:text-white truncate">{m.razonSocial}</p>
								<p class="text-xs text-gray-500 dark:text-gray-400">RUC: {m.ruc}</p>
							</div>
							<div class="flex gap-1.5 flex-shrink-0">
								{#if m.esLider}
									<span class="text-xs font-semibold px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full">
										Líder
									</span>
								{/if}
								{#if m.esEmpresaPropia}
									<span class="text-xs font-semibold px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full">
										Tu empresa
									</span>
								{/if}
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>

		<!-- Cards: Anexos -->
		<div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
			<!-- Anexo 1 -->
			<div class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
				<div class="flex items-center gap-2 mb-3">
					<div class="w-7 h-7 rounded-lg bg-green-600 dark:bg-green-500 flex items-center justify-center">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4 text-white">
							<path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
					</div>
					<div>
						<p class="text-xs font-bold text-gray-900 dark:text-white">Anexo 1</p>
						<p class="text-xs text-gray-500 dark:text-gray-400">DJ de Datos</p>
					</div>
				</div>
				<p class="text-xs text-gray-700 dark:text-gray-300 font-medium truncate">{anexo1.razonSocial}</p>
				<p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Rep: {anexo1.representanteLegal}</p>
			</div>

			<!-- Anexo 2 -->
			<div class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
				<div class="flex items-center gap-2 mb-3">
					<div class="w-7 h-7 rounded-lg bg-purple-600 dark:bg-purple-500 flex items-center justify-center">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4 text-white">
							<path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
					</div>
					<div>
						<p class="text-xs font-bold text-gray-900 dark:text-white">Anexo 2</p>
						<p class="text-xs text-gray-500 dark:text-gray-400">Pacto de Integridad</p>
					</div>
				</div>
				<p class="text-xs text-gray-700 dark:text-gray-300 font-medium truncate">{anexo2.representanteLegal}</p>
				<p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{anexo2.cargoRepresentante}</p>
			</div>

			<!-- Anexo 3 -->
			<div class="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
				<div class="flex items-center gap-2 mb-3">
					<div class="w-7 h-7 rounded-lg bg-orange-600 dark:bg-orange-500 flex items-center justify-center">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4 text-white">
							<path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
					</div>
					<div>
						<p class="text-xs font-bold text-gray-900 dark:text-white">Anexo 3</p>
						<p class="text-xs text-gray-500 dark:text-gray-400">DJ No Impedimentos</p>
					</div>
				</div>
				<p class="text-xs text-gray-700 dark:text-gray-300 font-medium truncate">{anexo3.representanteLegal}</p>
				<p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
					{[
						anexo3.declaraciones.noTieneImpedimentos && 'Sin impedimentos',
						anexo3.declaraciones.conoceSanciones && 'Conoce sanciones',
						anexo3.declaraciones.asumeResponsabilidad && 'Asume responsabilidad'
					].filter(Boolean).join(' · ')}
				</p>
			</div>
		</div>

		<!-- Error -->
		{#if error}
			<div class="rounded-lg border border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-950/30 p-4 flex items-start gap-3">
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5">
					<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
				</svg>
				<div>
					<p class="text-sm font-medium text-red-800 dark:text-red-200">Error al generar el documento</p>
					<p class="text-xs text-red-700 dark:text-red-300 mt-0.5">{error}</p>
				</div>
			</div>
		{/if}

		<!-- Botones -->
		<div class="flex flex-col sm:flex-row justify-between gap-3 pt-2">
			<button
				type="button"
				onclick={onRegresar}
				disabled={generando}
				class="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600
					rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
			>
				Regresar
			</button>
			<button
				type="button"
				onclick={handleGenerar}
				disabled={generando}
				class="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500
					text-white rounded-lg font-semibold transition-all
					hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed
					focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 shadow-lg shadow-blue-500/25
					flex items-center gap-2"
			>
				{#if generando}
					<svg class="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
						<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
					</svg>
					Generando...
				{:else}
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
						<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
					</svg>
					Generar Anexos del Consorcio
				{/if}
			</button>
		</div>

	{:else}
		<!-- ══ ESTADO EXITOSO ══ -->
		<div class="text-center space-y-6 py-8">
			<!-- Ícono de éxito -->
			<div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 relative">
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-10 h-10 text-green-600 dark:text-green-400">
					<path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
				</svg>
				<div class="absolute inset-0 bg-green-400 dark:bg-green-500 rounded-full animate-ping opacity-20"></div>
			</div>

			<div>
				<h3 class="text-2xl font-bold text-gray-900 dark:text-white">¡Documento Generado!</h3>
				<p class="mt-2 text-gray-600 dark:text-gray-300">
					Los anexos del <strong>{configuracion.nombreConsorcio}</strong> se descargaron correctamente.
				</p>
			</div>

			{#if documentoGenerado}
				<div class="max-w-lg mx-auto bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900
					border-2 border-blue-200 dark:border-blue-800 rounded-2xl p-6 shadow-xl">
					<div class="flex items-center gap-4">
						<div class="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/30">
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-7 h-7 text-white">
								<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
							</svg>
						</div>
						<div class="flex-1 text-left min-w-0">
							<p class="font-bold text-gray-900 dark:text-white truncate">{documentoGenerado.titulo}</p>
							<p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
								{new Date(documentoGenerado.fechaGeneracion).toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric' })}
							</p>
							<div class="flex flex-wrap gap-1.5 mt-2">
								{#each ['Anexo 1', 'Anexo 2', 'Anexo 3'] as tag}
									<span class="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-semibold rounded-full">
										<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3 h-3">
											<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
										</svg>
										{tag}
									</span>
								{/each}
							</div>
						</div>
					</div>
				</div>
			{/if}

			<!-- Acciones -->
			<div class="flex flex-col sm:flex-row justify-center gap-3">
				<button
					type="button"
					onclick={onNuevo}
					class="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300
						rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 font-semibold transition-all flex items-center justify-center gap-2"
				>
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
						<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
					</svg>
					Nuevo Proceso
				</button>
				<a
					href="/dashboard"
					class="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500
						text-white rounded-xl font-semibold transition-all inline-flex items-center justify-center gap-2
						shadow-lg shadow-blue-500/30 hover:shadow-xl hover:from-blue-700 hover:to-indigo-700"
				>
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
						<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
					</svg>
					Ir al Dashboard
				</a>
			</div>
		</div>
	{/if}
</div>