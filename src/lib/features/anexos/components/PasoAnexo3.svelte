<!-- src/lib/features/anexos/components/PasoAnexo3.svelte -->
<script lang="ts">
	import type { Anexo3Data } from '../types';

	interface Props {
		onGuardar: (data: Anexo3Data) => void;
		onRegresar: () => void;
		datosIniciales?: Anexo3Data | null;
	}

	let { onGuardar, onRegresar, datosIniciales = null }: Props = $props();

	let nombreEmpresa = $state(datosIniciales?.nombreEmpresa || 'CONSTRUCTORA EL ARENAL S.A.C.');
	let rucEmpresa = $state(datosIniciales?.rucEmpresa || '20534233532');
	let representanteLegal = $state(datosIniciales?.representanteLegal || 'Juan Pérez García');
	let dniRepresentante = $state(datosIniciales?.dniRepresentante || '12345678');
	let fecha = $state(datosIniciales?.fecha || new Date().toISOString().split('T')[0]);
	
	let declaraciones = $state({
		noTieneImpedimentos: datosIniciales?.declaraciones?.noTieneImpedimentos || false,
		conoceSanciones: datosIniciales?.declaraciones?.conoceSanciones || false,
		asumeResponsabilidad: datosIniciales?.declaraciones?.asumeResponsabilidad || false
	});

	let errores = $state<Record<string, string>>({});

	const impedimentos = [
		{
			titulo: 'Impedimentos por inhabilitación temporal o permanente',
			descripcion: 'No estar inhabilitado administrativa o judicialmente para contratar con el Estado.'
		},
		{
			titulo: 'Impedimentos por condena penal',
			descripcion: 'No haber sido condenado por delito de colusión, peculado, corrupción de funcionarios, enriquecimiento ilícito, u otros delitos contra la Administración Pública.'
		},
		{
			titulo: 'Impedimentos por vínculo laboral',
			descripcion: 'No tener personal directivo o personal clave que desempeñe función pública en la Entidad convocante o en el órgano encargado de las contrataciones.'
		},
		{
			titulo: 'Impedimentos por conflicto de intereses',
			descripcion: 'No encontrarse en situación de conflicto de interés que afecte la imparcialidad del proceso.'
		},
		{
			titulo: 'Impedimentos por deudas tributarias',
			descripcion: 'No tener deudas tributarias en cobranza coactiva, excepto cuando exista aplazamiento o fraccionamiento.'
		}
	];

	function validar(): boolean {
		const nuevosErrores: Record<string, string> = {};

		if (!nombreEmpresa.trim()) nuevosErrores.nombreEmpresa = 'Nombre de empresa es obligatorio';
		if (!rucEmpresa.trim()) nuevosErrores.rucEmpresa = 'RUC es obligatorio';
		if (!representanteLegal.trim()) nuevosErrores.representanteLegal = 'Representante legal es obligatorio';
		if (!dniRepresentante.trim()) nuevosErrores.dniRepresentante = 'DNI es obligatorio';
		if (!fecha) nuevosErrores.fecha = 'Fecha es obligatoria';
		
		if (!declaraciones.noTieneImpedimentos) {
			nuevosErrores.noTieneImpedimentos = 'Debe declarar que no tiene impedimentos';
		}
		if (!declaraciones.conoceSanciones) {
			nuevosErrores.conoceSanciones = 'Debe declarar que conoce las sanciones';
		}
		if (!declaraciones.asumeResponsabilidad) {
			nuevosErrores.asumeResponsabilidad = 'Debe asumir la responsabilidad';
		}

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
			declaraciones,
			fecha
		});
	}
</script>

<div class="space-y-6">
	<div>
		<h2 class="text-2xl font-bold text-gray-900 dark:text-white">
			Anexo N° 3 - Declaración Jurada de Impedimentos
		</h2>
		<p class="mt-2 text-gray-600 dark:text-gray-300">
			Declaración sobre la ausencia de impedimentos para contratar con el Estado
		</p>
	</div>

	<form onsubmit={handleSubmit} class="space-y-6">
		<!-- Datos del declarante -->
		<div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 space-y-4">
			<h3 class="font-semibold text-gray-900 dark:text-white">Datos del Declarante</h3>
			
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

		<!-- Lista de impedimentos -->
		<div class="border border-gray-300 dark:border-gray-700 rounded-lg p-6 space-y-4">
			<h3 class="font-semibold text-gray-900 dark:text-white">
				Impedimentos para Contratar con el Estado
			</h3>
			<p class="text-sm text-gray-600 dark:text-gray-400">
				De acuerdo con la Ley N° 32069, declaro bajo juramento que no me encuentro en ninguno de los siguientes impedimentos:
			</p>

			<div class="space-y-3">
				{#each impedimentos as impedimento, index}
					<div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border-l-4 border-gray-300 dark:border-gray-700">
						<h4 class="font-medium text-gray-900 dark:text-white text-sm">
							{index + 1}. {impedimento.titulo}
						</h4>
						<p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
							{impedimento.descripcion}
						</p>
					</div>
				{/each}
			</div>
		</div>

		<!-- Declaraciones juradas -->
		<div class="space-y-4">
			<h3 class="font-semibold text-gray-900 dark:text-white">Declaraciones Juradas</h3>

			<!-- Declaración 1 -->
			<div class="bg-blue-50 dark:bg-blue-950 border-l-4 border-blue-600 dark:border-blue-500 p-4">
				<div class="flex items-start space-x-3">
					<input
						type="checkbox"
						id="noTieneImpedimentos"
						bind:checked={declaraciones.noTieneImpedimentos}
						class="mt-1 w-5 h-5 text-blue-600 border-gray-300 dark:border-gray-700 rounded 
							focus:ring-2 focus:ring-blue-500"
					/>
					<div class="flex-1">
						<label for="noTieneImpedimentos" class="text-sm font-medium text-gray-900 dark:text-white cursor-pointer">
							Declaro bajo juramento que no tengo impedimentos para contratar con el Estado
							<span class="text-red-500">*</span>
						</label>
						<p class="text-xs text-gray-600 dark:text-gray-400 mt-1">
							Confirmo que no me encuentro incurso en ninguno de los impedimentos mencionados anteriormente.
						</p>
					</div>
				</div>
				{#if errores.noTieneImpedimentos}
					<p class="mt-2 text-sm text-red-500">{errores.noTieneImpedimentos}</p>
				{/if}
			</div>

			<!-- Declaración 2 -->
			<div class="bg-yellow-50 dark:bg-yellow-950 border-l-4 border-yellow-600 dark:border-yellow-500 p-4">
				<div class="flex items-start space-x-3">
					<input
						type="checkbox"
						id="conoceSanciones"
						bind:checked={declaraciones.conoceSanciones}
						class="mt-1 w-5 h-5 text-yellow-600 border-gray-300 dark:border-gray-700 rounded 
							focus:ring-2 focus:ring-yellow-500"
					/>
					<div class="flex-1">
						<label for="conoceSanciones" class="text-sm font-medium text-gray-900 dark:text-white cursor-pointer">
							Conozco las sanciones aplicables en caso de falsedad
							<span class="text-red-500">*</span>
						</label>
						<p class="text-xs text-gray-600 dark:text-gray-400 mt-1">
							Soy consciente de que la presentación de información falsa puede resultar en inhabilitación temporal o 
							permanente, así como sanciones civiles y penales según corresponda.
						</p>
					</div>
				</div>
				{#if errores.conoceSanciones}
					<p class="mt-2 text-sm text-red-500">{errores.conoceSanciones}</p>
				{/if}
			</div>

			<!-- Declaración 3 -->
			<div class="bg-red-50 dark:bg-red-950 border-l-4 border-red-600 dark:border-red-500 p-4">
				<div class="flex items-start space-x-3">
					<input
						type="checkbox"
						id="asumeResponsabilidad"
						bind:checked={declaraciones.asumeResponsabilidad}
						class="mt-1 w-5 h-5 text-red-600 border-gray-300 dark:border-gray-700 rounded 
							focus:ring-2 focus:ring-red-500"
					/>
					<div class="flex-1">
						<label for="asumeResponsabilidad" class="text-sm font-medium text-gray-900 dark:text-white cursor-pointer">
							Asumo plena responsabilidad sobre la veracidad de esta declaración
							<span class="text-red-500">*</span>
						</label>
						<p class="text-xs text-gray-600 dark:text-gray-400 mt-1">
							Me comprometo a notificar inmediatamente a la Entidad si surgiera algún impedimento durante 
							el desarrollo del procedimiento de selección o durante la ejecución contractual.
						</p>
					</div>
				</div>
				{#if errores.asumeResponsabilidad}
					<p class="mt-2 text-sm text-red-500">{errores.asumeResponsabilidad}</p>
				{/if}
			</div>
		</div>

		<!-- Advertencia legal -->
		<div class="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-4">
			<div class="flex items-start space-x-3">
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" 
					class="w-6 h-6 text-gray-600 dark:text-gray-400 flex-shrink-0">
					<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
				</svg>
				<div class="text-xs text-gray-700 dark:text-gray-300">
					<p class="font-semibold mb-1">Advertencia Legal</p>
					<p>
						La presentación de declaración jurada falsa acarrea las responsabilidades administrativas, civiles y 
						penales establecidas en la normativa vigente. La Entidad verificará la veracidad de la información 
						declarada y podrá solicitar documentación sustentatoria en cualquier momento.
					</p>
				</div>
			</div>
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
				Continuar al Resumen
			</button>
		</div>
	</form>
</div>