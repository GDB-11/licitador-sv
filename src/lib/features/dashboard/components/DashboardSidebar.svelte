<!-- src/lib/features/dashboard/components/DashboardSidebar.svelte -->
<script lang="ts">
	interface DashboardSidebarProps {
		onGestionarPerfil?: () => void;
	}

	let { onGestionarPerfil }: DashboardSidebarProps = $props();
</script>

<div class="space-y-6">
	<!-- Acceso Rápido a Perfil -->
	<div class="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="2"
			stroke="currentColor"
			class="w-10 h-10 mb-3 opacity-90"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z"
			/>
		</svg>
		<h3 class="font-semibold mb-2">Perfil Empresarial</h3>
		<p class="text-sm opacity-90 mb-4">
			Mantén actualizada la información de tu empresa para generar documentos precisos.
		</p>
		<button
			onclick={onGestionarPerfil}
			class="w-full bg-white text-indigo-600 rounded-lg px-4 py-2 font-medium hover:bg-gray-100 transition-colors"
		>
			Gestionar Perfil
		</button>
	</div>

	<!-- Tips / Ayuda -->
	<div
		class="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800"
	>
		<div class="flex items-start space-x-3">
			<div class="flex-shrink-0">
				<div
					class="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center"
				>
					<span class="text-blue-600 dark:text-blue-400 font-bold text-sm">💡</span>
				</div>
			</div>
			<div>
				<h4 class="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-1">Tip del día</h4>
				<p class="text-xs text-blue-800 dark:text-blue-400">
					Completa tu perfil al 100% para habilitar la generación de todos los anexos
					administrativos.
				</p>
			</div>
		</div>
	</div>
</div>