<!-- src/lib/features/perfil-empresarial/components/PerfilProgress.svelte -->
<script lang="ts">
	interface PerfilProgressProps {
		completitud: number;
	}

	let { completitud }: PerfilProgressProps = $props();

	const getColorClass = (value: number) => {
		if (value === 100) return 'bg-green-600 dark:bg-green-500';
		if (value >= 75) return 'bg-blue-600 dark:bg-blue-500';
		if (value >= 50) return 'bg-indigo-600 dark:bg-indigo-500';
		if (value >= 25) return 'bg-amber-600 dark:bg-amber-500';
		return 'bg-red-600 dark:bg-red-500';
	};

	const getStatusMessage = (value: number) => {
		if (value === 100) return '¡Perfil completo! Listo para generar documentos.';
		if (value >= 75) return 'Casi listo. Completa los campos restantes.';
		if (value >= 50) return 'Vas por buen camino. Continúa completando.';
		if (value >= 25) return 'Aún faltan varios campos por completar.';
		return 'Perfil incompleto. Completa la información necesaria.';
	};

	const getStatusColor = (value: number) => {
		if (value === 100) return 'text-green-600 dark:text-green-400';
		if (value >= 75) return 'text-blue-600 dark:text-blue-400';
		if (value >= 50) return 'text-indigo-600 dark:text-indigo-400';
		if (value >= 25) return 'text-amber-600 dark:text-amber-400';
		return 'text-red-600 dark:text-red-400';
	};
</script>

<div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
	<div class="flex items-center justify-between mb-3">
		<h3 class="text-sm font-semibold text-gray-900 dark:text-white">
			Completitud del Perfil
		</h3>
		<span class="text-2xl font-bold {getStatusColor(completitud)}">
			{completitud}%
		</span>
	</div>

	<div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-3 overflow-hidden">
		<div
			class="{getColorClass(completitud)} h-3 rounded-full transition-all duration-500 ease-out"
			style="width: {completitud}%"
		></div>
	</div>

	<p class="text-sm {getStatusColor(completitud)}">
		{getStatusMessage(completitud)}
	</p>

	{#if completitud === 100}
		<div class="mt-4 flex items-center space-x-2 text-green-600 dark:text-green-400">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="2"
				stroke="currentColor"
				class="w-5 h-5"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
				/>
			</svg>
			<span class="text-sm font-medium">Perfil verificado</span>
		</div>
	{/if}
</div>