<!-- src/lib/features/dashboard/components/GenerarDocumentosSection.svelte -->
<script lang="ts">
	interface GenerarDocumentosProps {
		onIniciarProcesoIndividual?: () => void;
		onIniciarProcesoConsorcio?: () => void;
		// Legacy prop kept for backwards-compat (maps to individual)
		onIniciarProceso?: () => void;
	}

	let {
		onIniciarProcesoIndividual,
		onIniciarProcesoConsorcio,
		onIniciarProceso
	}: GenerarDocumentosProps = $props();

	const handleIndividual = () => {
		onIniciarProcesoIndividual?.() ?? onIniciarProceso?.();
	};
</script>

<div class="space-y-4">
	<!-- Título de sección -->
	<div>
		<h2 class="text-xl font-bold text-gray-900 dark:text-white">Generar Documentos</h2>
		<p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
			Seleccione la modalidad de participación para generar los 3 anexos requeridos por la Ley N° 32069
		</p>
	</div>

	<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">

		<!-- ── Modalidad Individual ──────────────────────────────────────────── -->
		<div class="group relative bg-gradient-to-br from-indigo-600 to-purple-700
			dark:from-indigo-700 dark:to-purple-800
			rounded-xl p-6 text-white shadow-lg shadow-indigo-500/20
			hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-200 hover:-translate-y-0.5">

			<div class="mb-4">
				<div class="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-3">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
						<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
					</svg>
				</div>
				<h3 class="text-lg font-bold">Postulación Individual</h3>
				<p class="text-sm text-indigo-200 mt-1">Solo mi empresa participa en el proceso</p>
			</div>

			<ul class="space-y-1.5 mb-5 text-xs text-indigo-100">
				<li class="flex items-center gap-2">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4 text-indigo-300 flex-shrink-0">
						<path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
					</svg>
					Datos auto-completados de tu perfil
				</li>
				<li class="flex items-center gap-2">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4 text-indigo-300 flex-shrink-0">
						<path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
					</svg>
					Anexos 1, 2 y 3 consolidados
				</li>
				<li class="flex items-center gap-2">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4 text-indigo-300 flex-shrink-0">
						<path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
					</svg>
					Listo en minutos
				</li>
			</ul>

			<button
				onclick={handleIndividual}
				class="w-full bg-white text-indigo-700 font-semibold py-2.5 px-4 rounded-lg
					hover:bg-indigo-50 transition-colors text-sm
					flex items-center justify-center gap-2 shadow-sm cursor-pointer"
			>
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
					<path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 010 1.972l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z" />
				</svg>
				Iniciar como Individual
			</button>
		</div>

		<!-- ── Modalidad Consorcio ───────────────────────────────────────────── -->
		<div class="group relative bg-gradient-to-br from-blue-600 to-cyan-600
			dark:from-blue-700 dark:to-cyan-700
			rounded-xl p-6 text-white shadow-lg shadow-blue-500/20
			hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-200 hover:-translate-y-0.5">

			<div class="mb-4">
				<div class="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-3">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
						<path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
					</svg>
				</div>
				<h3 class="text-lg font-bold">Postulación en Consorcio</h3>
				<p class="text-sm text-blue-200 mt-1">Participo junto a otras empresas aliadas</p>
			</div>

			<ul class="space-y-1.5 mb-5 text-xs text-blue-100">
				<li class="flex items-center gap-2">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4 text-blue-300 flex-shrink-0">
						<path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
					</svg>
					Hasta 3 empresas en total
				</li>
				<li class="flex items-center gap-2">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4 text-blue-300 flex-shrink-0">
						<path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
					</svg>
					Designación de líder y porcentajes
				</li>
				<li class="flex items-center gap-2">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4 text-blue-300 flex-shrink-0">
						<path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
					</svg>
					Requiere empresas consorciadas registradas
				</li>
			</ul>

			<button
				onclick={onIniciarProcesoConsorcio}
				class="w-full bg-white text-blue-700 font-semibold py-2.5 px-4 rounded-lg
					hover:bg-blue-50 transition-colors text-sm
					flex items-center justify-center gap-2 shadow-sm cursor-pointer"
			>
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
					<path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 010 1.972l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z" />
				</svg>
				Iniciar como Consorcio
			</button>
		</div>
	</div>
</div>