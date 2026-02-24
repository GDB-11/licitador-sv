<!-- src/lib/features/anexos-consorcio/components/WizardProgressConsorcio.svelte -->
<script lang="ts">
	import type { EstadoWizardConsorcio } from '../types';

	interface Props {
		pasoActual: EstadoWizardConsorcio;
		onNavigate: (paso: EstadoWizardConsorcio) => void;
		pasosCompletados: Set<EstadoWizardConsorcio>;
	}

	let { pasoActual, onNavigate, pasosCompletados }: Props = $props();

	const pasos: { id: EstadoWizardConsorcio; label: string; sublabel: string }[] = [
		{ id: 'configuracion', label: 'Consorcio', sublabel: 'Proceso y miembros' },
		{ id: 'anexo1', label: 'Anexo 1', sublabel: 'DJ de Datos' },
		{ id: 'anexo2', label: 'Anexo 2', sublabel: 'Pacto Integridad' },
		{ id: 'anexo3', label: 'Anexo 3', sublabel: 'No Impedimentos' },
		{ id: 'resumen', label: 'Generar', sublabel: 'Resumen' }
	];

	const idxActual = $derived(pasos.findIndex((p) => p.id === pasoActual));
</script>

<div class="px-6 py-5">
	<!-- Barra de progreso -->
	<div class="mb-5 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
		<div
			class="h-full bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 rounded-full transition-all duration-500"
			style="width: {((idxActual + 1) / pasos.length) * 100}%"
		></div>
	</div>

	<!-- Steps -->
	<div class="flex items-start justify-between">
		{#each pasos as paso, idx (paso.id)}
			{@const completado = pasosCompletados.has(paso.id)}
			{@const esActual = paso.id === pasoActual}
			{@const puedeNavegar = completado || idx <= idxActual}

			<button
				type="button"
				onclick={() => puedeNavegar && onNavigate(paso.id)}
				disabled={!puedeNavegar}
				class="flex flex-col items-center gap-1.5 min-w-0 flex-1
					{puedeNavegar ? 'cursor-pointer' : 'cursor-not-allowed opacity-40'}"
			>
				<!-- Indicador circular -->
				<div class="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all
					{esActual
						? 'bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 shadow-lg shadow-blue-500/30 ring-4 ring-blue-100 dark:ring-blue-900'
						: completado
						? 'bg-green-500 dark:bg-green-600'
						: 'bg-gray-200 dark:bg-gray-700'}">
					{#if completado && !esActual}
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4 sm:w-5 sm:h-5 text-white">
							<path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
						</svg>
					{:else}
						<span class="text-xs sm:text-sm font-bold {esActual || completado ? 'text-white' : 'text-gray-500 dark:text-gray-400'}">
							{idx + 1}
						</span>
					{/if}
				</div>

				<!-- Label -->
				<div class="text-center hidden sm:block">
					<p class="text-xs font-semibold truncate
						{esActual ? 'text-blue-700 dark:text-blue-400' : completado ? 'text-green-700 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}">
						{paso.label}
					</p>
					<p class="text-xs text-gray-400 dark:text-gray-500 truncate">{paso.sublabel}</p>
				</div>
				<!-- Mobile: solo label -->
				<p class="text-xs font-medium sm:hidden truncate max-w-[60px]
					{esActual ? 'text-blue-700 dark:text-blue-400' : completado ? 'text-green-700 dark:text-green-400' : 'text-gray-400 dark:text-gray-500'}">
					{paso.label}
				</p>
			</button>

			<!-- Separador -->
			{#if idx < pasos.length - 1}
				<div class="flex-1 h-0.5 mt-4 sm:mt-5 mx-1
					{idx < idxActual ? 'bg-green-400 dark:bg-green-600' : 'bg-gray-200 dark:bg-gray-700'}
					transition-colors duration-300">
				</div>
			{/if}
		{/each}
	</div>
</div>