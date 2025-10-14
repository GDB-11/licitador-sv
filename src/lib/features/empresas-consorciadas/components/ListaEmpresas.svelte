<!-- src/lib/features/empresas-consorciadas/components/ListaEmpresas.svelte -->
<script lang="ts">
	import type { EmpresaConsorciada } from '../types';

	interface ListaEmpresasProps {
		empresas: EmpresaConsorciada[];
		onEditar: (empresa: EmpresaConsorciada) => void;
		onEliminar: (id: number) => void;
		isLoading?: boolean;
	}

	let { empresas, onEditar, onEliminar, isLoading = false }: ListaEmpresasProps = $props();
</script>

<div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
	<!-- Header -->
	<div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
		<h3 class="text-lg font-semibold text-gray-900 dark:text-white">
			Empresas Consorciadas
		</h3>
		<p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
			Listado de empresas que forman parte del consorcio
		</p>
	</div>

	<!-- Contenido -->
	<div class="overflow-x-auto">
		{#if isLoading}
			<div class="p-8 flex items-center justify-center">
				<div class="text-center">
					<div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent dark:border-blue-500"></div>
					<p class="mt-3 text-sm text-gray-500 dark:text-gray-400">Cargando empresas...</p>
				</div>
			</div>
		{:else if empresas.length === 0}
			<div class="p-8 text-center">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="w-12 h-12 mx-auto text-gray-400 dark:text-gray-600"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z"
					/>
				</svg>
				<p class="mt-4 text-gray-600 dark:text-gray-400 font-medium">
					No hay empresas consorciadas registradas
				</p>
				<p class="text-sm text-gray-500 dark:text-gray-500 mt-1">
					Agrega la primera empresa para formar el consorcio
				</p>
			</div>
		{:else}
			<table class="w-full">
				<thead class="bg-gray-50 dark:bg-gray-700/50">
					<tr>
						<th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
							Empresa
						</th>
						<th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
							RUC
						</th>
						<th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
							Participación
						</th>
						<th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
							Representante
						</th>
						<th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
							Estado
						</th>
						<th class="px-6 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
							Acciones
						</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-200 dark:divide-gray-700">
					{#each empresas as empresa (empresa.id)}
						<tr class="hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors">
							<td class="px-6 py-4">
								<div class="flex items-center">
									<div>
										<div class="font-medium text-gray-900 dark:text-white">
											{empresa.razonSocial}
										</div>
										{#if empresa.nombreComercial}
											<div class="text-sm text-gray-500 dark:text-gray-400">
												{empresa.nombreComercial}
											</div>
										{/if}
									</div>
								</div>
							</td>
							<td class="px-6 py-4">
								<span class="text-sm text-gray-900 dark:text-gray-100 font-mono">
									{empresa.ruc}
								</span>
							</td>
							<td class="px-6 py-4">
								<div class="flex items-center space-x-2">
									<span class="text-sm font-semibold text-gray-900 dark:text-white">
										{empresa.porcentajeParticipacion}%
									</span>
									<div class="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
										<div
											class="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all"
											style="width: {empresa.porcentajeParticipacion}%"
										></div>
									</div>
								</div>
							</td>
							<td class="px-6 py-4">
								<div class="text-sm text-gray-900 dark:text-white">
									{empresa.representanteLegal.nombresCompletos}
								</div>
								<div class="text-xs text-gray-500 dark:text-gray-400">
									{empresa.representanteLegal.cargo}
								</div>
							</td>
							<td class="px-6 py-4">
								{#if empresa.esLider}
									<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
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
										Líder
									</span>
								{:else}
									<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
										Miembro
									</span>
								{/if}
							</td>
							<td class="px-6 py-4 text-right">
								<div class="flex items-center justify-end space-x-2">
									<button
										onclick={() => onEditar(empresa)}
										class="p-1.5 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
										title="Editar empresa"
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
												d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
											/>
										</svg>
									</button>
									<button
										onclick={() => onEliminar(empresa.id)}
										class="p-1.5 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 rounded-lg transition-colors"
										title="Eliminar empresa"
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
												d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
											/>
										</svg>
									</button>
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		{/if}
	</div>
</div>