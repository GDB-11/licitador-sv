<!-- src/lib/features/empresas-consorciadas/components/ResumenEmpresas.svelte -->
<script lang="ts">
	import type { EmpresasResumen } from '../types';

	interface ResumenEmpresasProps {
		resumen: EmpresasResumen;
		onToggleFiltro: () => void;
		mostrandoSoloActivas: boolean;
	}

	let { resumen, onToggleFiltro, mostrandoSoloActivas }: ResumenEmpresasProps = $props();
</script>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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

	<!-- Empresas Activas -->
	<div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between">
			<div class="flex-1">
				<p class="text-sm font-medium text-gray-600 dark:text-gray-400">Empresas Activas</p>
				<p class="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">
					{resumen.empresasActivas}
				</p>
				{#if resumen.totalEmpresas > 0}
					<div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-3">
						<div
							class="bg-green-600 dark:bg-green-500 h-2 rounded-full transition-all"
							style="width: {(resumen.empresasActivas / resumen.totalEmpresas) * 100}%"
						></div>
					</div>
				{/if}
			</div>
		</div>
	</div>

	<!-- Empresas Inactivas -->
	<div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between">
			<div class="flex-1">
				<p class="text-sm font-medium text-gray-600 dark:text-gray-400">Empresas Inactivas</p>
				<p class="text-3xl font-bold text-gray-500 dark:text-gray-400 mt-2">
					{resumen.empresasInactivas}
				</p>
				{#if resumen.totalEmpresas > 0}
					<div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-3">
						<div
							class="bg-gray-500 dark:bg-gray-600 h-2 rounded-full transition-all"
							style="width: {(resumen.empresasInactivas / resumen.totalEmpresas) * 100}%"
						></div>
					</div>
				{/if}
			</div>
		</div>
	</div>

	<!-- RNP Vigente -->
	<div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between">
			<div class="flex-1">
				<p class="text-sm font-medium text-gray-600 dark:text-gray-400">RNP Vigente</p>
				<p class="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">
					{resumen.empresasConRNPVigente}
				</p>
				<p class="text-xs text-gray-500 dark:text-gray-500 mt-2">
					Empresas con registro activo
				</p>
			</div>
		</div>
	</div>

	<!-- Filtro de Empresas -->
	<div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
		<div class="flex items-center justify-between h-full">
			<div class="flex-1">
				<p class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">Filtro de Vista</p>
				<button
					onclick={onToggleFiltro}
					class="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors flex items-center justify-center"
				>
					{#if mostrandoSoloActivas}
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 mr-2 text-green-600 dark:text-green-400">
							<path stroke-linecap="round" stroke-linejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
						</svg>
						<span class="text-sm font-medium text-gray-700 dark:text-gray-300">Solo Activas</span>
					{:else}
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 mr-2 text-gray-600 dark:text-gray-400">
							<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
						</svg>
						<span class="text-sm font-medium text-gray-700 dark:text-gray-300">Todas</span>
					{/if}
				</button>
			</div>
		</div>
	</div>
</div>