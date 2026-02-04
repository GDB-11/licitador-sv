<!-- src/lib/features/dashboard/components/GenerarDocumentosSection.svelte -->
<script lang="ts">
	interface GenerarDocumentosProps {
		onIniciarProceso?: () => void;
		onGenerarAnexo1?: () => void;
		onGenerarAnexo2?: () => void;
		onGenerarAnexo3?: () => void;
	}

	let { onIniciarProceso, onGenerarAnexo1, onGenerarAnexo2, onGenerarAnexo3 }: GenerarDocumentosProps =
		$props();
</script>

<div>
	<!-- Botón principal: Iniciar Proceso Completo -->
	<div class="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-8 mb-6 text-white">
		<div class="flex flex-col md:flex-row items-center justify-between">
			<div class="mb-4 md:mb-0">
				<h2 class="text-2xl font-bold mb-2">Iniciar Proceso de Licitación</h2>
				<p class="text-indigo-100">Genera los 3 anexos administrativos en un solo flujo</p>
			</div>
			<button
				onclick={onIniciarProceso}
				class="bg-white text-indigo-600 px-8 py-4 rounded-lg font-semibold hover:bg-indigo-50 transition-all hover:scale-105 shadow-lg flex items-center space-x-2 cursor-pointer"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="2"
					stroke="currentColor"
					class="w-5 h-5"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
				</svg>
				<span>Iniciar Proceso</span>
			</button>
		</div>
	</div>
</div>