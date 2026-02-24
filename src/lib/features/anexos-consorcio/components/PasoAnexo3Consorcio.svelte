<!-- src/lib/features/anexos-consorcio/components/PasoAnexo3Consorcio.svelte -->
<script lang="ts">
	import type { Anexo3ConsorcioData, ConfiguracionConsorcio } from '../types';

	interface Props {
		onGuardar: (data: Anexo3ConsorcioData) => void;
		onRegresar: () => void;
		datosIniciales?: Anexo3ConsorcioData | null;
		configuracion: ConfiguracionConsorcio;
	}

	let { onGuardar, onRegresar, datosIniciales = null, configuracion }: Props = $props();

	let representanteLegal = $state(datosIniciales?.representanteLegal || '');
	let dniRepresentante = $state(datosIniciales?.dniRepresentante || '');
	let fecha = $state(datosIniciales?.fecha || new Date().toISOString().split('T')[0]);
	let noTieneImpedimentos = $state(datosIniciales?.declaraciones.noTieneImpedimentos ?? true);
	let conoceSanciones = $state(datosIniciales?.declaraciones.conoceSanciones ?? true);
	let asumeResponsabilidad = $state(datosIniciales?.declaraciones.asumeResponsabilidad ?? true);

	let errores = $state<Record<string, string>>({});

	function validar(): boolean {
		const e: Record<string, string> = {};
		if (!representanteLegal.trim()) e.representanteLegal = 'Nombre del representante legal es obligatorio';
		if (!dniRepresentante.trim()) e.dniRepresentante = 'DNI del representante es obligatorio';
		if (!noTieneImpedimentos) e.noTieneImpedimentos = 'Debe declarar que no tiene impedimentos para contratar';
		if (!conoceSanciones) e.conoceSanciones = 'Debe declarar que conoce las sanciones aplicables';
		if (!asumeResponsabilidad) e.asumeResponsabilidad = 'Debe asumir responsabilidad por la veracidad de la información';
		errores = e;
		return Object.keys(e).length === 0;
	}

	function handleSubmit(ev: Event) {
		ev.preventDefault();
		if (!validar()) return;
		onGuardar({
			representanteLegal,
			dniRepresentante,
			declaraciones: { noTieneImpedimentos, conoceSanciones, asumeResponsabilidad },
			fecha
		});
	}
</script>

<div class="space-y-6">
	<div>
		<h2 class="text-2xl font-bold text-gray-900 dark:text-white">Anexo N° 3</h2>
		<p class="mt-1 text-gray-600 dark:text-gray-300">
			Declaración Jurada de No Tener Impedimentos — <span class="font-medium text-blue-600 dark:text-blue-400">Consorcio {configuracion.nombreConsorcio}</span>
		</p>
	</div>

	<form onsubmit={handleSubmit} class="space-y-6">
		<div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
				<label for="fecha" class="block text-sm font-medium text-gray-900 dark:text-white mb-1.5">
					Fecha
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

		<!-- Declaraciones -->
		<div class="space-y-3">
			<p class="text-sm font-medium text-gray-900 dark:text-white">Declaraciones bajo juramento</p>

			{#each [
				{ id: 'noTieneImpedimentos', label: 'Declaro no tener impedimentos para contratar con el Estado conforme al Art. 50 de la Ley N° 32069.', errorKey: 'noTieneImpedimentos', checked: noTieneImpedimentos, toggle: (v: boolean) => (noTieneImpedimentos = v) },
				{ id: 'conoceSanciones', label: 'Conozco las sanciones que se aplican por falsedad en declaraciones juradas.', errorKey: 'conoceSanciones', checked: conoceSanciones, toggle: (v: boolean) => (conoceSanciones = v) },
				{ id: 'asumeResponsabilidad', label: 'Asumo plena responsabilidad por la veracidad de la información declarada.', errorKey: 'asumeResponsabilidad', checked: asumeResponsabilidad, toggle: (v: boolean) => (asumeResponsabilidad = v) }
			] as declaracion}
				<label class="flex items-start gap-3 cursor-pointer p-4 rounded-lg border transition-colors
					{declaracion.checked ? 'border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-950/30' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}">
					<input
						type="checkbox"
						id={declaracion.id}
						checked={declaracion.checked}
						onchange={(e) => declaracion.toggle((e.target as HTMLInputElement).checked)}
						class="mt-0.5 w-4 h-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
					/>
					<p class="text-sm text-gray-700 dark:text-gray-300">{declaracion.label}</p>
				</label>
				{#if errores[declaracion.errorKey]}
					<p class="text-xs text-red-500 -mt-1 ml-1">{errores[declaracion.errorKey]}</p>
				{/if}
			{/each}
		</div>

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