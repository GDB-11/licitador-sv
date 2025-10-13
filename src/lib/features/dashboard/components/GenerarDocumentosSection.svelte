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
				class="bg-white text-indigo-600 px-8 py-4 rounded-lg font-semibold hover:bg-indigo-50 transition-all hover:scale-105 shadow-lg flex items-center space-x-2"
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

	<h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
		O genera documentos individuales
	</h2>
	<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
		<!-- Anexo 1 -->
		<button
			onclick={onGenerarAnexo1}
			class="bg-white dark:bg-gray-800 border-2 border-indigo-600 dark:border-indigo-500 rounded-xl p-6 hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors group"
		>
			<div class="flex flex-col items-center text-center">
				<div
					class="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center mb-3 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-800 transition-colors"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="2"
						stroke="currentColor"
						class="w-6 h-6 text-indigo-600 dark:text-indigo-400"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
						/>
					</svg>
				</div>
				<h3 class="font-semibold text-gray-900 dark:text-white mb-1">Anexo N° 1</h3>
				<p class="text-xs text-gray-600 dark:text-gray-400">
					Declaración Jurada de Datos del Postor
				</p>
			</div>
		</button>

		<!-- Anexo 2 -->
		<button
			onclick={onGenerarAnexo2}
			class="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:border-indigo-600 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors group"
		>
			<div class="flex flex-col items-center text-center">
				<div
					class="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-3 group-hover:bg-green-200 dark:group-hover:bg-green-800 transition-colors"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="2"
						stroke="currentColor"
						class="w-6 h-6 text-green-600 dark:text-green-400"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
				</div>
				<h3 class="font-semibold text-gray-900 dark:text-white mb-1">Anexo N° 2</h3>
				<p class="text-xs text-gray-600 dark:text-gray-400">Pacto de Integridad</p>
			</div>
		</button>

		<!-- Anexo 3 -->
		<button
			onclick={onGenerarAnexo3}
			class="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:border-indigo-600 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors group"
		>
			<div class="flex flex-col items-center text-center">
				<div
					class="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-3 group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors"
				>
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
							d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
						/>
					</svg>
				</div>
				<h3 class="font-semibold text-gray-900 dark:text-white mb-1">Anexo N° 3</h3>
				<p class="text-xs text-gray-600 dark:text-gray-400">Declaración de Impedimentos</p>
			</div>
		</button>
	</div>
</div>