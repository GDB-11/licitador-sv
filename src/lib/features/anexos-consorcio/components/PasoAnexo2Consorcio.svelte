<!-- src/lib/features/anexos-consorcio/components/PasoAnexo2Consorcio.svelte -->
<script lang="ts">
	import type { Anexo2ConsorcioData, ConfiguracionConsorcio } from '../types';

	interface Props {
		onGuardar: (data: Anexo2ConsorcioData) => void;
		onRegresar: () => void;
		datosIniciales?: Anexo2ConsorcioData | null;
		configuracion: ConfiguracionConsorcio;
	}

	let { onGuardar, onRegresar, datosIniciales = null, configuracion }: Props = $props();

	let representanteLegal = $state(datosIniciales?.representanteLegal || '');
	let dniRepresentante = $state(datosIniciales?.dniRepresentante || '');
	let cargoRepresentante = $state(datosIniciales?.cargoRepresentante || 'Representante Legal');
	let fecha = $state(datosIniciales?.fecha || new Date().toISOString().split('T')[0]);
	let aceptaCompromisos = $state(datosIniciales?.aceptaCompromisos ?? true);

	let errores = $state<Record<string, string>>({});

	function validar(): boolean {
		const e: Record<string, string> = {};
		if (!representanteLegal.trim()) e.representanteLegal = 'Nombre del representante legal es obligatorio';
		if (!dniRepresentante.trim()) e.dniRepresentante = 'DNI del representante es obligatorio';
		if (!cargoRepresentante.trim()) e.cargoRepresentante = 'Cargo es obligatorio';
		if (!aceptaCompromisos) e.aceptaCompromisos = 'Debe aceptar los compromisos del Pacto de Integridad';
		errores = e;
		return Object.keys(e).length === 0;
	}

	function handleSubmit(ev: Event) {
		ev.preventDefault();
		if (!validar()) return;
		onGuardar({ representanteLegal, dniRepresentante, cargoRepresentante, fecha, aceptaCompromisos });
	}
</script>

<div class="space-y-6">
	<div>
		<h2 class="text-2xl font-bold text-gray-900 dark:text-white">Anexo N° 2</h2>
		<p class="mt-1 text-gray-600 dark:text-gray-300">
			Pacto de Integridad — <span class="font-medium text-blue-600 dark:text-blue-400">Consorcio {configuracion.nombreConsorcio}</span>
		</p>
	</div>

	<!-- Texto del pacto -->
	<div class="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-5">
		<h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">Pacto de Integridad</h3>
		<div class="text-xs text-gray-600 dark:text-gray-400 space-y-2 leading-relaxed">
			<p>Mediante el presente documento, el postor, sus accionistas, socios o integrantes, según corresponda, el personal a su cargo, y sus subcontratistas o consorciados, se comprometen a:</p>
			<ul class="list-disc list-inside space-y-1 ml-2">
				<li>No ofrecer, negociar o efectuar cualquier pago, o dar a terceros dádivas en general, o cualquier beneficio o incentivo ilegal.</li>
				<li>Abstenerse de realizar conductas que puedan afectar la libre concurrencia de proveedores o el proceso de selección.</li>
				<li>Conocer, respetar y cumplir fielmente el Código de Ética de la entidad contratante.</li>
				<li>Aceptar que la suscripción del presente documento implica la renuncia a cualquier tipo de beneficio que pudiera obtenerse de manera ilegal.</li>
			</ul>
			<p class="mt-3">El incumplimiento de estos compromisos genera las responsabilidades administrativas, civiles y penales previstas en la normatividad vigente.</p>
		</div>
	</div>

	<form onsubmit={handleSubmit} class="space-y-5">
		<div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
			<!-- Representante legal -->
			<div class="sm:col-span-2">
				<label for="representanteLegal" class="block text-sm font-medium text-gray-900 dark:text-white mb-1.5">
					Representante Legal <span class="text-red-500">*</span>
				</label>
				<input
					type="text"
					id="representanteLegal"
					bind:value={representanteLegal}
					class="w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-gray-800
						text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent
						{errores.representanteLegal ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'}"
				/>
				{#if errores.representanteLegal}<p class="mt-1 text-xs text-red-500">{errores.representanteLegal}</p>{/if}
			</div>

			<div>
				<label for="dniRepresentante" class="block text-sm font-medium text-gray-900 dark:text-white mb-1.5">
					DNI <span class="text-red-500">*</span>
				</label>
				<input
					type="text"
					id="dniRepresentante"
					bind:value={dniRepresentante}
					maxlength="8"
					class="w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-gray-800
						text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent
						{errores.dniRepresentante ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'}"
				/>
				{#if errores.dniRepresentante}<p class="mt-1 text-xs text-red-500">{errores.dniRepresentante}</p>{/if}
			</div>

			<div>
				<label for="cargo" class="block text-sm font-medium text-gray-900 dark:text-white mb-1.5">
					Cargo <span class="text-red-500">*</span>
				</label>
				<input
					type="text"
					id="cargo"
					bind:value={cargoRepresentante}
					class="w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-gray-800
						text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent
						{errores.cargoRepresentante ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'}"
				/>
				{#if errores.cargoRepresentante}<p class="mt-1 text-xs text-red-500">{errores.cargoRepresentante}</p>{/if}
			</div>

			<div>
				<label for="fecha" class="block text-sm font-medium text-gray-900 dark:text-white mb-1.5">
					Fecha de Firma
				</label>
				<input
					type="date"
					id="fecha"
					bind:value={fecha}
					class="w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-gray-800
						text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent
						border-gray-300 dark:border-gray-700"
				/>
			</div>
		</div>

		<!-- Aceptar compromisos -->
		<label class="flex items-start gap-3 cursor-pointer p-4 rounded-lg border
			{aceptaCompromisos ? 'border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-950/30' : 'border-gray-200 dark:border-gray-700'}">
			<input
				type="checkbox"
				bind:checked={aceptaCompromisos}
				class="mt-0.5 w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
			/>
			<div>
				<p class="text-sm font-medium text-gray-900 dark:text-white">
					Acepto y me comprometo a cumplir el Pacto de Integridad
				</p>
				<p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
					En nombre de mi empresa y del Consorcio {configuracion.nombreConsorcio}, declaro conocer y aceptar todos los términos.
				</p>
			</div>
		</label>
		{#if errores.aceptaCompromisos}
			<p class="text-xs text-red-500">{errores.aceptaCompromisos}</p>
		{/if}

		<div class="flex justify-between">
			<button type="button" onclick={onRegresar}
				class="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600
					rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
				Regresar
			</button>
			<button type="submit"
				class="px-6 py-2.5 bg-blue-600 dark:bg-blue-500 text-white rounded-lg font-medium
					hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900">
				Continuar
			</button>
		</div>
	</form>
</div>