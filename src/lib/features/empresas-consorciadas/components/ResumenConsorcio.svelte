<!-- src/lib/features/empresas-consorciadas/components/ResumenConsorcio.svelte -->
<script lang="ts">
	import type { ConsorcioResumen } from '../types';

	interface ResumenConsorcioProps {
		resumen: ConsorcioResumen;
	}

	let { resumen }: ResumenConsorcioProps = $props();

	const getPorcentajeColor = (porcentaje: number) => {
		if (porcentaje === 100) return 'text-green-600 dark:text-green-400';
		if (porcentaje > 100) return 'text-red-600 dark:text-red-400';
		return 'text-amber-600 dark:text-amber-400';
	};

	const getPorcentajeBarColor = (porcentaje: number) => {
		if (porcentaje === 100) return 'bg-green-600 dark:bg-green-500';
		if (porcentaje > 100) return 'bg-red-600 dark:bg-red-500';
		return 'bg-amber-600 dark:bg-amber-500';
	};
</script>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
	<!-- Total de Empresas -->
	<div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between">
			<div>
				<p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total de Empresas</p>
				<p class="text-3xl font-bold text-gray-900 dark:text-white mt-2">
					{resumen.totalEmpresas}
				</p>
			</div>
			<div class="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="2"
					stroke="currentColor"
					class="w-6 h-6 text-blue-600 dark:text-blue-400"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z"
					/>
				</svg>
			</div>
		</div>
	</div>

	<!-- Porcentaje Total -->
	<div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between">
			<div class="flex-1">
				<p class="text-sm font-medium text-gray-600 dark:text-gray-400">Participación Total</p>
				<p class="text-3xl font-bold {getPorcentajeColor(resumen.porcentajeTotal)} mt-2">
					{resumen.porcentajeTotal}%
				</p>
				<div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-3">
					<div
						class="{getPorcentajeBarColor(resumen.porcentajeTotal)} h-2 rounded-full transition-all"
						style="width: {Math.min(resumen.porcentajeTotal, 100)}%"
					></div>
				</div>
			</div>
		</div>
	</div>

	<!-- Empresa Líder -->
	<div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between">
			<div class="flex-1">
				<p class="text-sm font-medium text-gray-600 dark:text-gray-400">Empresa Líder</p>
				{#if resumen.empresaLider}
					<p class="text-sm font-bold text-gray-900 dark:text-white mt-2 line-clamp-2">
						{resumen.empresaLider.razonSocial}
					</p>
					<div class="flex items-center mt-2 text-xs text-blue-600 dark:text-blue-400">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="2"
							stroke="currentColor"
							class="w-3 h-3 mr-1"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
							/>
						</svg>
						{resumen.empresaLider.porcentajeParticipacion}% participación
					</div>
				{:else}
					<p class="text-sm text-red-600 dark:text-red-400 mt-2 font-medium">
						No definida
					</p>
					<p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
						Asigna una empresa líder
					</p>
				{/if}
			</div>
		</div>
	</div>

	<!-- Estado del Consorcio -->
	<div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between">
			<div class="flex-1">
				<p class="text-sm font-medium text-gray-600 dark:text-gray-400">Estado del Consorcio</p>
				{#if resumen.esValido}
					<div class="flex items-center mt-2">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="2"
							stroke="currentColor"
							class="w-6 h-6 text-green-600 dark:text-green-400 mr-2"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						<span class="text-sm font-bold text-green-600 dark:text-green-400">Válido</span>
					</div>
					<p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
						Listo para usar en licitaciones
					</p>
				{:else}
					<div class="flex items-center mt-2">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="2"
							stroke="currentColor"
							class="w-6 h-6 text-amber-600 dark:text-amber-400 mr-2"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
							/>
						</svg>
						<span class="text-sm font-bold text-amber-600 dark:text-amber-400">Incompleto</span>
					</div>
					<p class="text-xs text-red-600 dark:text-red-400 mt-1">
						{#if resumen.porcentajeTotal !== 100}
							El porcentaje debe sumar 100%
						{:else if !resumen.empresaLider}
							Falta asignar empresa líder
						{/if}
					</p>
				{/if}
			</div>
		</div>
	</div>
</div>