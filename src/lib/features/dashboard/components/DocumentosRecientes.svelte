<!-- src/lib/features/dashboard/components/DocumentosRecientes.svelte -->
<script lang="ts">
	import type { DocumentoReciente } from '../stores/dashboard.svelte';

	interface DocumentosRecientesProps {
		documentos: DocumentoReciente[];
		onVer?: (id: number) => void;
		onDescargar?: (id: number) => void;
		onVerTodos?: () => void;
	}

	let { documentos, onVer, onDescargar, onVerTodos }: DocumentosRecientesProps = $props();
</script>

<div>
	<h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Documentos Recientes</h2>
	<div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
		<div class="overflow-x-auto">
			<table class="w-full">
				<thead class="bg-gray-50 dark:bg-gray-700/50">
					<tr>
						<th
							class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
						>
							Documento
						</th>
						<th
							class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
						>
							Concurso
						</th>
						<th
							class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
						>
							Fecha
						</th>
						<th
							class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
						>
							Acciones
						</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-200 dark:divide-gray-700">
					{#each documentos as doc}
						<tr class="hover:bg-gray-50 dark:hover:bg-gray-700/50">
							<td class="px-6 py-4">
								<div class="flex items-center">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke-width="2"
										stroke="currentColor"
										class="w-5 h-5 text-gray-400 dark:text-gray-500 mr-3"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
										/>
									</svg>
									<span class="text-sm text-gray-900 dark:text-gray-100">{doc.nombre}</span>
								</div>
							</td>
							<td class="px-6 py-4">
								<span class="text-sm text-gray-600 dark:text-gray-400">{doc.concurso}</span>
							</td>
							<td class="px-6 py-4">
								<span class="text-sm text-gray-600 dark:text-gray-400">{doc.fecha}</span>
							</td>
							<td class="px-6 py-4 text-right">
								<div class="flex items-center justify-end space-x-2">
									{#if onVer}
										<button
											onclick={() => onVer(doc.id)}
											class="p-1 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
											title="Ver documento"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												stroke-width="2"
												stroke="currentColor"
												class="w-4 h-4"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
												/>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
												/>
											</svg>
										</button>
									{/if}
									{#if onDescargar}
										<button
											onclick={() => onDescargar(doc.id)}
											class="p-1 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
											title="Descargar documento"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												stroke-width="2"
												stroke="currentColor"
												class="w-4 h-4"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
												/>
											</svg>
										</button>
									{/if}
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
		{#if onVerTodos}
			<div
				class="px-6 py-3 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700"
			>
				<button
					onclick={onVerTodos}
					class="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium transition-colors"
				>
					Ver todos los documentos →
				</button>
			</div>
		{/if}
	</div>
</div>