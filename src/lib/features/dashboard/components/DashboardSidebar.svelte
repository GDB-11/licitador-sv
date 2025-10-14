<!-- src/lib/features/dashboard/components/DashboardSidebar.svelte -->
<script lang="ts">
	import Button from '$lib/components/form/Button.svelte';

	interface Props {
		onGestionarPerfil?: () => void;
		onGestionarConsorciadas?: () => void;
	}

	let { onGestionarPerfil, onGestionarConsorciadas }: Props = $props();
</script>

<div class="space-y-6">
	<!-- Acceso Rápido -->
	<div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
		<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="2"
				stroke="currentColor"
				class="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
				/>
			</svg>
			Acceso Rápido
		</h3>

		<div class="space-y-3">
			<!-- Gestionar Perfil -->
			<button
				onclick={onGestionarPerfil}
				class="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
			>
				<div class="flex items-center space-x-3">
					<div class="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="2"
							stroke="currentColor"
							class="w-5 h-5 text-purple-600 dark:text-purple-400"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z"
							/>
						</svg>
					</div>
					<div class="text-left">
						<p class="text-sm font-medium text-gray-900 dark:text-white">Perfil Empresarial</p>
						<p class="text-xs text-gray-500 dark:text-gray-400">Gestionar datos de tu empresa</p>
					</div>
				</div>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="2"
					stroke="currentColor"
					class="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
				</svg>
			</button>

			<!-- NUEVO: Gestionar Empresas Consorciadas -->
			<button
				onclick={onGestionarConsorciadas}
				class="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
			>
				<div class="flex items-center space-x-3">
					<div class="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="2"
							stroke="currentColor"
							class="w-5 h-5 text-emerald-600 dark:text-emerald-400"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
							/>
						</svg>
					</div>
					<div class="text-left">
						<p class="text-sm font-medium text-gray-900 dark:text-white">Empresas Consorciadas</p>
						<p class="text-xs text-gray-500 dark:text-gray-400">Administrar alianzas estratégicas</p>
					</div>
				</div>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="2"
					stroke="currentColor"
					class="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
				</svg>
			</button>
		</div>
	</div>

	<!-- Tips y Recursos -->
	<div class="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-indigo-100 dark:border-indigo-800">
		<div class="flex items-start space-x-3">
			<div class="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-800 flex items-center justify-center flex-shrink-0">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="2"
					stroke="currentColor"
					class="w-5 h-5 text-indigo-600 dark:text-indigo-400"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
					/>
				</svg>
			</div>
			<div>
				<h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-2">
					💡 Consejo del día
				</h4>
				<p class="text-xs text-gray-600 dark:text-gray-300 mb-3">
					Mantén actualizada la información de tus empresas consorciadas para agilizar la generación de documentos.
				</p>
				<Button variant="ghost" size="sm" className="text-xs">
					Ver más consejos
				</Button>
			</div>
		</div>
	</div>
</div>