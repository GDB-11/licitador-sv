<!-- src/lib/features/anexos/components/PasoConfiguracion.svelte -->
 <script lang="ts">
	import type { ConfiguracionAnexos, TipoParticipacion } from '../types';

	interface Props {
		onGuardar: (config: ConfiguracionAnexos) => void;
		datosIniciales?: ConfiguracionAnexos | null;
	}

	let { onGuardar, datosIniciales = null }: Props = $props();

	let tipoParticipacion = $state<TipoParticipacion>(datosIniciales?.tipoParticipacion || 'individual');
	let numeroProceso = $state(datosIniciales?.numeroProceso || '');
	let entidad = $state(datosIniciales?.entidad || '');
	let objeto = $state(datosIniciales?.objeto || '');
	let ciudad = $state(datosIniciales?.ciudad || '');

	let errores = $state<Record<string, string>>({});

	function validar(): boolean {
		const nuevosErrores: Record<string, string> = {};

		if (!numeroProceso.trim()) {
			nuevosErrores.numeroProceso = 'El número de proceso es obligatorio';
		}

		if (!entidad.trim()) {
			nuevosErrores.entidad = 'La entidad convocante es obligatoria';
		}

		if (!objeto.trim()) {
			nuevosErrores.objeto = 'El objeto de la contratación es obligatorio';
		}

		if (!ciudad.trim()) {
			nuevosErrores.ciudad = 'La ciudad es obligatoria';
		}

		errores = nuevosErrores;
		return Object.keys(nuevosErrores).length === 0;
	}

	function handleSubmit(e: Event) {
		e.preventDefault();

		if (!validar()) {
			return;
		}

		onGuardar({
			tipoParticipacion,
			numeroProceso,
			entidad,
			objeto,
			ciudad
		});
	}
</script>

<div class="space-y-6">
	<div>
		<h2 class="text-2xl font-bold text-gray-900 dark:text-white">Configuración del Proceso</h2>
		<p class="mt-2 text-gray-600 dark:text-gray-300">
			Complete los datos básicos del proceso de contratación
		</p>
	</div>

	<form onsubmit={handleSubmit} class="space-y-6">
		<!-- Tipo de participación -->
		<div>
			<label class="block text-sm font-medium text-gray-900 dark:text-white mb-3">
				Tipo de Participación
			</label>
			<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<button
					type="button"
					onclick={() => (tipoParticipacion = 'individual')}
					class="p-4 border-2 rounded-lg text-left transition-all
						{tipoParticipacion === 'individual'
							? 'border-blue-600 dark:border-blue-500 bg-blue-50 dark:bg-blue-950'
							: 'border-gray-300 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600'}"
				>
					<div class="flex items-start space-x-3">
						<div
							class="flex-shrink-0 w-5 h-5 rounded-full border-2 mt-0.5
							{tipoParticipacion === 'individual'
								? 'border-blue-600 dark:border-blue-500 bg-blue-600 dark:bg-blue-500'
								: 'border-gray-300 dark:border-gray-700'}"
						>
							{#if tipoParticipacion === 'individual'}
								<div class="w-full h-full flex items-center justify-center">
									<div class="w-2 h-2 bg-white rounded-full"></div>
								</div>
							{/if}
						</div>
						<div>
							<h3 class="font-semibold text-gray-900 dark:text-white">Individual</h3>
							<p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
								Participa solo mi empresa
							</p>
						</div>
					</div>
				</button>

				<button
					type="button"
					onclick={() => (tipoParticipacion = 'consorcio')}
					class="p-4 border-2 rounded-lg text-left transition-all
						{tipoParticipacion === 'consorcio'
							? 'border-blue-600 dark:border-blue-500 bg-blue-50 dark:bg-blue-950'
							: 'border-gray-300 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600'}"
				>
					<div class="flex items-start space-x-3">
						<div
							class="flex-shrink-0 w-5 h-5 rounded-full border-2 mt-0.5
							{tipoParticipacion === 'consorcio'
								? 'border-blue-600 dark:border-blue-500 bg-blue-600 dark:bg-blue-500'
								: 'border-gray-300 dark:border-gray-700'}"
						>
							{#if tipoParticipacion === 'consorcio'}
								<div class="w-full h-full flex items-center justify-center">
									<div class="w-2 h-2 bg-white rounded-full"></div>
								</div>
							{/if}
						</div>
						<div>
							<h3 class="font-semibold text-gray-900 dark:text-white">Consorcio</h3>
							<p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
								Participo junto con otras empresas
							</p>
						</div>
					</div>
				</button>
			</div>
		</div>

		<!-- Número de proceso -->
		<div>
			<label for="numeroProceso" class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
				Número de Proceso <span class="text-red-500">*</span>
			</label>
			<input
				type="text"
				id="numeroProceso"
				bind:value={numeroProceso}
				placeholder="Ej: LP-001-2025-MINSA"
				class="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 
					border-gray-300 dark:border-gray-700 
					text-gray-900 dark:text-white
					placeholder-gray-500 dark:placeholder-gray-400
					focus:ring-2 focus:ring-blue-500 focus:border-transparent
					{errores.numeroProceso ? 'border-red-500' : ''}"
			/>
			{#if errores.numeroProceso}
				<p class="mt-1 text-sm text-red-500">{errores.numeroProceso}</p>
			{/if}
		</div>

		<!-- Entidad convocante -->
		<div>
			<label for="entidad" class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
				Entidad Convocante <span class="text-red-500">*</span>
			</label>
			<input
				type="text"
				id="entidad"
				bind:value={entidad}
				placeholder="Ej: Ministerio de Salud"
				class="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 
					border-gray-300 dark:border-gray-700 
					text-gray-900 dark:text-white
					placeholder-gray-500 dark:placeholder-gray-400
					focus:ring-2 focus:ring-blue-500 focus:border-transparent
					{errores.entidad ? 'border-red-500' : ''}"
			/>
			{#if errores.entidad}
				<p class="mt-1 text-sm text-red-500">{errores.entidad}</p>
			{/if}
		</div>

		<!-- Objeto de la contratación -->
		<div>
			<label for="objeto" class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
				Objeto de la Contratación <span class="text-red-500">*</span>
			</label>
			<textarea
				id="objeto"
				bind:value={objeto}
				rows="4"
				placeholder="Ej: Construcción del Hospital Regional de Lima Sur"
				class="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 
					border-gray-300 dark:border-gray-700 
					text-gray-900 dark:text-white
					placeholder-gray-500 dark:placeholder-gray-400
					focus:ring-2 focus:ring-blue-500 focus:border-transparent
					{errores.objeto ? 'border-red-500' : ''}"
			></textarea>
			{#if errores.objeto}
				<p class="mt-1 text-sm text-red-500">{errores.objeto}</p>
			{/if}
		</div>

		<!-- Ciudad -->
		<div>
			<label for="ciudad" class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
				Ciudad donde se participa <span class="text-red-500">*</span>
			</label>
			<input
				type="text"
				id="ciudad"
				bind:value={ciudad}
				placeholder="Ej: Lima, San Salvador, La Unión"
				class="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 
					border-gray-300 dark:border-gray-700 
					text-gray-900 dark:text-white
					placeholder-gray-500 dark:placeholder-gray-400
					focus:ring-2 focus:ring-blue-500 focus:border-transparent
					{errores.ciudad ? 'border-red-500' : ''}"
			/>
			{#if errores.ciudad}
				<p class="mt-1 text-sm text-red-500">{errores.ciudad}</p>
			{/if}
		</div>

		<!-- Botón de continuar -->
		<div class="flex justify-end">
			<button
				type="submit"
				class="px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg
					hover:bg-blue-700 dark:hover:bg-blue-600 font-medium transition-colors
					focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900"
			>
				Continuar
			</button>
		</div>
	</form>
</div>