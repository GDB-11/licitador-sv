<!-- src/lib/features/dashboard/components/AlertaPerfilIncompleto.svelte -->
<script lang="ts">
	interface AlertaPerfilProps {
		perfilCompleto: number;
		onCompletar?: () => void;
	}

	let { perfilCompleto, onCompletar }: AlertaPerfilProps = $props();
</script>

<div
	class="mb-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 flex items-start space-x-3"
>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		stroke-width="1.5"
		stroke="currentColor"
		class="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5"
	>
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
		/>
	</svg>

	<div class="flex-1">
		<h3 class="text-sm font-medium text-amber-800 dark:text-amber-300">
			Completa tu perfil empresarial
		</h3>
		<p class="text-sm text-amber-700 dark:text-amber-400 mt-1">
			Tu perfil está {perfilCompleto}% completo. Complétalo para generar documentos sin errores.
		</p>
		{#if onCompletar}
			<button
				onclick={onCompletar}
				class="mt-2 text-sm font-medium text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 transition-colors"
			>
				Completar ahora →
			</button>
		{/if}
	</div>
</div>