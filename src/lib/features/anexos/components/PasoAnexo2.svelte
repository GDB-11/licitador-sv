<!-- src/lib/features/anexos/components/PasoAnexo2.svelte -->
<script lang="ts">
	import type { Anexo2Data } from '../types';

	interface Props {
		onGuardar: (data: Anexo2Data) => void;
		onRegresar: () => void;
		datosIniciales?: Anexo2Data | null;
	}

	let { onGuardar, onRegresar, datosIniciales = null }: Props = $props();

	let nombreEmpresa = $state(datosIniciales?.nombreEmpresa || 'CONSTRUCTORA EL ARENAL S.A.C.');
	let rucEmpresa = $state(datosIniciales?.rucEmpresa || '20534233532');
	let representanteLegal = $state(datosIniciales?.representanteLegal || 'Juan Pérez García');
	let dniRepresentante = $state(datosIniciales?.dniRepresentante || '12345678');
	let cargoRepresentante = $state(datosIniciales?.cargoRepresentante || 'Gerente General');
	let fecha = $state(datosIniciales?.fecha || new Date().toISOString().split('T')[0]);
	let aceptaCompromisos = $state(datosIniciales?.aceptaCompromisos || false);

	let errores = $state<Record<string, string>>({});

	const compromisos = [
		'No ofrecer ni conceder sobornos, dádivas o cualquier beneficio indebido a funcionarios públicos o terceros relacionados con el procedimiento de selección.',
		'No coordinar con otros postores para alterar la competencia o establecer acuerdos colusorios.',
		'Abstenerse de realizar actos de corrupción o fraude durante todo el proceso de contratación.',
		'Declarar la existencia de conflictos de intereses que pudieran afectar su participación.',
		'Actuar con transparencia, veracidad y buena fe en todas las etapas del procedimiento.',
		'Informar a la Entidad sobre cualquier acto que contravenga lo dispuesto en el presente Pacto de Integridad.'
	];

	function validar(): boolean {
		const nuevosErrores: Record<string, string> = {};

		if (!nombreEmpresa.trim()) nuevosErrores.nombreEmpresa = 'Nombre de empresa es obligatorio';
		if (!rucEmpresa.trim()) nuevosErrores.rucEmpresa = 'RUC es obligatorio';
		if (!representanteLegal.trim()) nuevosErrores.representanteLegal = 'Representante legal es obligatorio';
		if (!dniRepresentante.trim()) nuevosErrores.dniRepresentante = 'DNI es obligatorio';
		if (!cargoRepresentante.trim()) nuevosErrores.cargoRepresentante = 'Cargo es obligatorio';
		if (!fecha) nuevosErrores.fecha = 'Fecha es obligatoria';
		if (!aceptaCompromisos) nuevosErrores.aceptaCompromisos = 'Debe aceptar los compromisos';

		errores = nuevosErrores;
		return Object.keys(nuevosErrores).length === 0;
	}

	function handleSubmit(e: Event) {
		e.preventDefault();

		if (!validar()) return;

		onGuardar({
			nombreEmpresa,
			rucEmpresa,
			representanteLegal,
			dniRepresentante,
			cargoRepresentante,
			fecha,
			aceptaCompromisos
		});
	}
</script>

<div class="space-y-6">
	<div>
		<h2 class="text-2xl font-bold text-gray-900 dark:text-white">
			Anexo N° 2 - Pacto de Integridad
		</h2>
		<p class="mt-2 text-gray-600 dark:text-gray-300">
			Compromiso ético para la participación en el procedimiento de selección
		</p>
	</div>

	<form onsubmit={handleSubmit} class="space-y-6">
		<!-- Datos del firmante -->
		<div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 space-y-4">
			<h3 class="font-semibold text-gray-900 dark:text-white">Datos del Firmante</h3>
			
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div class="md:col-span-2">
					<label for="nombreEmpresa" class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
						Nombre de la Empresa / Consorcio <span class="text-red-500">*</span>
					</label>
					<input
						type="text"
						id="nombreEmpresa"
						bind:value={nombreEmpresa}
						class="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-900 
							border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white
							focus:ring-2 focus:ring-blue-500 {errores.nombreEmpresa ? 'border-red-500' : ''}"
					/>
					{#if errores.nombreEmpresa}
						<p class="mt-1 text-sm text-red-500">{errores.nombreEmpresa}</p>
					{/if}
				</div>

				<div>
					<label for="rucEmpresa" class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
						RUC <span class="text-red-500">*</span>
					</label>
					<input
						type="text"
						id="rucEmpresa"
						bind:value={rucEmpresa}
						maxlength="11"
						class="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-900 
							border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white
							focus:ring-2 focus:ring-blue-500 {errores.rucEmpresa ? 'border-red-500' : ''}"
					/>
					{#if errores.rucEmpresa}
						<p class="mt-1 text-sm text-red-500">{errores.rucEmpresa}</p>
					{/if}
				</div>

				<div>
					<label for="dniRepresentante" class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
						DNI del Representante <span class="text-red-500">*</span>
					</label>
					<input
						type="text"
						id="dniRepresentante"
						bind:value={dniRepresentante}
						maxlength="8"
						class="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-900 
							border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white
							focus:ring-2 focus:ring-blue-500 {errores.dniRepresentante ? 'border-red-500' : ''}"
					/>
					{#if errores.dniRepresentante}
						<p class="mt-1 text-sm text-red-500">{errores.dniRepresentante}</p>
					{/if}
				</div>

				<div class="md:col-span-2">
					<label for="representanteLegal" class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
						Nombre del Representante Legal <span class="text-red-500">*</span>
					</label>
					<input
						type="text"
						id="representanteLegal"
						bind:value={representanteLegal}
						class="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-900 
							border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white
							focus:ring-2 focus:ring-blue-500 {errores.representanteLegal ? 'border-red-500' : ''}"
					/>
					{#if errores.representanteLegal}
						<p class="mt-1 text-sm text-red-500">{errores.representanteLegal}</p>
					{/if}
				</div>

				<div>
					<label for="cargoRepresentante" class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
						Cargo <span class="text-red-500">*</span>
					</label>
					<input
						type="text"
						id="cargoRepresentante"
						bind:value={cargoRepresentante}
						class="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-900 
							border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white
							focus:ring-2 focus:ring-blue-500 {errores.cargoRepresentante ? 'border-red-500' : ''}"
					/>
					{#if errores.cargoRepresentante}
						<p class="mt-1 text-sm text-red-500">{errores.cargoRepresentante}</p>
					{/if}
				</div>

				<div>
					<label for="fecha" class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
						Fecha <span class="text-red-500">*</span>
					</label>
					<input
						type="date"
						id="fecha"
						bind:value={fecha}
						class="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-900 
							border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white
							focus:ring-2 focus:ring-blue-500 {errores.fecha ? 'border-red-500' : ''}"
					/>
					{#if errores.fecha}
						<p class="mt-1 text-sm text-red-500">{errores.fecha}</p>
					{/if}
				</div>
			</div>
		</div>

		<!-- Compromisos -->
		<div class="border border-gray-300 dark:border-gray-700 rounded-lg p-6 space-y-4">
			<h3 class="font-semibold text-gray-900 dark:text-white">
				Compromisos del Pacto de Integridad
			</h3>
			<p class="text-sm text-gray-600 dark:text-gray-400">
				En mi calidad de representante legal, me comprometo a:
			</p>

			<div class="space-y-3">
				{#each compromisos as compromiso, index}
					<div class="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
						<div class="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 
							rounded-full flex items-center justify-center text-sm font-semibold mt-0.5">
							{index + 1}
						</div>
						<p class="text-sm text-gray-700 dark:text-gray-300 flex-1">
							{compromiso}
						</p>
					</div>
				{/each}
			</div>
		</div>

		<!-- Aceptación -->
		<div class="bg-blue-50 dark:bg-blue-950 border-l-4 border-blue-600 dark:border-blue-500 p-4">
			<div class="flex items-start space-x-3">
				<input
					type="checkbox"
					id="aceptaCompromisos"
					bind:checked={aceptaCompromisos}
					class="mt-1 w-5 h-5 text-blue-600 border-gray-300 dark:border-gray-700 rounded 
						focus:ring-2 focus:ring-blue-500"
				/>
				<div class="flex-1">
					<label for="aceptaCompromisos" class="text-sm font-medium text-gray-900 dark:text-white cursor-pointer">
						He leído y acepto todos los compromisos establecidos en el Pacto de Integridad
						<span class="text-red-500">*</span>
					</label>
					<p class="text-xs text-gray-600 dark:text-gray-400 mt-1">
						Declaro que la información proporcionada es verídica y me comprometo a cumplir con todos 
						los términos establecidos, bajo pena de las sanciones administrativas, civiles y penales 
						que correspondan.
					</p>
				</div>
			</div>
			{#if errores.aceptaCompromisos}
				<p class="mt-2 text-sm text-red-500">{errores.aceptaCompromisos}</p>
			{/if}
		</div>

		<!-- Botones de navegación -->
		<div class="flex justify-between">
			<button
				type="button"
				onclick={onRegresar}
				class="px-6 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 
					rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 font-medium transition-colors"
			>
				Regresar
			</button>
			<button
				type="submit"
				class="px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg
					hover:bg-blue-700 dark:hover:bg-blue-600 font-medium transition-colors"
			>
				Continuar
			</button>
		</div>
	</form>
</div>