<!-- src/lib/features/anexos/components/WizardProgress.svelte -->
<script lang="ts">
	import type { EstadoWizard } from '../types';

	interface Props {
		pasoActual: EstadoWizard;
		onNavigate?: (paso: EstadoWizard) => void;
	}

	let { pasoActual, onNavigate }: Props = $props();

	const pasos = [
		{ id: 'configuracion' as EstadoWizard, nombre: 'Configuración', numero: 1 },
		{ id: 'anexo1' as EstadoWizard, nombre: 'Anexo 1', numero: 2 },
		{ id: 'anexo2' as EstadoWizard, nombre: 'Anexo 2', numero: 3 },
		{ id: 'anexo3' as EstadoWizard, nombre: 'Anexo 3', numero: 4 },
		{ id: 'resumen' as EstadoWizard, nombre: 'Resumen', numero: 5 }
	];

	const indicePasoActual = $derived(pasos.findIndex((p) => p.id === pasoActual));

	function esPasoCompletado(index: number): boolean {
		return index < indicePasoActual;
	}

	function esPasoActual(index: number): boolean {
		return index === indicePasoActual;
	}

	function handlePasoClick(paso: EstadoWizard, index: number) {
		if (onNavigate && index <= indicePasoActual) {
			onNavigate(paso);
		}
	}
</script>

<div class="w-full px-4 py-8 sm:px-6 lg:px-8">
	<div class="max-w-5xl mx-auto">
		<!-- Barra de progreso en móvil -->
		<div class="block sm:hidden mb-6">
			<div class="flex items-center justify-between mb-2">
				<span class="text-sm font-medium text-gray-700 dark:text-gray-300">
					Paso {indicePasoActual + 1} de {pasos.length}
				</span>
				<span class="text-sm font-semibold text-blue-600 dark:text-blue-400">
					{Math.round(((indicePasoActual + 1) / pasos.length) * 100)}%
				</span>
			</div>
			<div class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
				<div
					class="h-full bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-500 transition-all duration-500 ease-out rounded-full"
					style="width: {((indicePasoActual + 1) / pasos.length) * 100}%"
				></div>
			</div>
			<p class="mt-3 text-center text-base font-semibold text-gray-900 dark:text-white">
				{pasos[indicePasoActual].nombre}
			</p>
		</div>

		<!-- Wizard completo en desktop -->
		<div class="hidden sm:block">
			<div class="relative">
				<!-- Línea de fondo -->
				<div
					class="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-700"
					style="margin-left: 2.5rem; margin-right: 2.5rem;"
				></div>

				<!-- Línea de progreso -->
				<div
					class="absolute top-5 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-500 transition-all duration-700 ease-out"
					style="margin-left: 2.5rem; width: calc({(indicePasoActual / (pasos.length - 1)) * 100}% - 2.5rem);"
				></div>

				<!-- Pasos -->
				<div class="relative flex justify-between">
					{#each pasos as paso, index}
						<div class="flex flex-col items-center group" style="flex: 0 0 auto;">
							<!-- Botón del paso -->
							<button
								onclick={() => handlePasoClick(paso.id, index)}
								disabled={index > indicePasoActual}
								class="relative flex items-center justify-center w-11 h-11 rounded-full font-bold text-sm transition-all duration-300 transform
									{esPasoCompletado(index)
										? 'bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-500 text-white shadow-lg shadow-blue-500/50 dark:shadow-blue-600/50 cursor-pointer hover:scale-110 hover:shadow-xl hover:shadow-blue-500/60'
										: esPasoActual(index)
											? 'bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 text-white shadow-xl shadow-blue-600/60 dark:shadow-blue-500/60 scale-110 ring-4 ring-blue-100 dark:ring-blue-900/50'
											: 'bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-500 border-2 border-gray-200 dark:border-gray-700 cursor-not-allowed'}
									{index <= indicePasoActual && index !== indicePasoActual ? 'hover:scale-110' : ''}"
							>
								{#if esPasoCompletado(index)}
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke-width="3"
										stroke="currentColor"
										class="w-6 h-6 animate-[fadeIn_0.3s_ease-in]"
									>
										<path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
									</svg>
								{:else}
									<span class="transition-transform duration-300">
										{paso.numero}
									</span>
								{/if}

								<!-- Pulso animado para paso actual -->
								{#if esPasoActual(index)}
									<span
										class="absolute inset-0 rounded-full bg-blue-600 dark:bg-blue-500 animate-ping opacity-20"
									></span>
								{/if}
							</button>

							<!-- Nombre del paso -->
							<div class="mt-4 flex flex-col items-center max-w-[120px]">
								<span
									class="text-xs sm:text-sm font-semibold text-center leading-tight transition-colors duration-300
									{esPasoActual(index)
										? 'text-blue-600 dark:text-blue-400'
										: esPasoCompletado(index)
											? 'text-gray-900 dark:text-white'
											: 'text-gray-500 dark:text-gray-400'}"
								>
									{paso.nombre}
								</span>

								<!-- Indicador de completado -->
								{#if esPasoCompletado(index)}
									<span
										class="mt-1 text-[10px] font-medium text-green-600 dark:text-green-400 flex items-center gap-1"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 16 16"
											fill="currentColor"
											class="w-3 h-3"
										>
											<path
												fill-rule="evenodd"
												d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14Zm3.844-8.791a.75.75 0 0 0-1.188-.918l-3.7 4.79-1.649-1.833a.75.75 0 1 0-1.114 1.004l2.25 2.5a.75.75 0 0 0 1.15-.043l4.25-5.5Z"
												clip-rule="evenodd"
											/>
										</svg>
										Completado
									</span>
								{/if}
							</div>
						</div>
					{/each}
				</div>
			</div>

			<!-- Información adicional -->
			<div
				class="mt-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-xl border border-blue-100 dark:border-gray-600"
			>
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-3">
						<div
							class="w-10 h-10 rounded-lg bg-blue-600 dark:bg-blue-500 flex items-center justify-center shadow-lg"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="2"
								stroke="currentColor"
								class="w-5 h-5 text-white"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
								/>
							</svg>
						</div>
						<div>
							<p class="text-sm font-semibold text-gray-900 dark:text-white">
								{pasos[indicePasoActual].nombre}
							</p>
							<p class="text-xs text-gray-600 dark:text-gray-400">
								Paso {indicePasoActual + 1} de {pasos.length} • {Math.round(
									((indicePasoActual + 1) / pasos.length) * 100
								)}% completado
							</p>
						</div>
					</div>
					<div class="text-right">
						<p class="text-2xl font-bold text-blue-600 dark:text-blue-400">
							{indicePasoActual + 1}/{pasos.length}
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: scale(0.8);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}
</style>