<!-- src/lib/features/anexos/components/PasoAnexo1.svelte -->
<script lang="ts">
	import type { Anexo1Data } from '../types';

	interface Props {
		onGuardar: (data: Anexo1Data) => void;
		onRegresar: () => void;
		datosIniciales?: Anexo1Data | null;
	}

	let { onGuardar, onRegresar, datosIniciales = null }: Props = $props();

	// Datos para participación individual
	let razonSocial = $state(datosIniciales?.razonSocial || '');
	let ruc = $state(datosIniciales?.ruc || '20534233532');
	let domicilioLegal = $state(datosIniciales?.domicilioLegal || '');
	let telefono = $state(datosIniciales?.telefono || '');
	let correoElectronico = $state(datosIniciales?.correoElectronico || '');
	let representanteLegal = $state(datosIniciales?.representanteLegal || '');
	let dniRepresentante = $state(datosIniciales?.dniRepresentante || '');

	// Autorización de notificaciones
	let autorizaNotificacionesEmail = $state(datosIniciales?.autorizaNotificacionesEmail || false);
	let emailNotificaciones = $state(datosIniciales?.emailNotificaciones || '');

	let errores = $state<Record<string, string>>({});

	function validar(): boolean {
		const nuevosErrores: Record<string, string> = {};

		if (!razonSocial.trim()) nuevosErrores.razonSocial = 'Razón social es obligatoria';
		if (!ruc.trim()) nuevosErrores.ruc = 'RUC es obligatorio';
		if (!domicilioLegal.trim()) nuevosErrores.domicilioLegal = 'Domicilio legal es obligatorio';
		if (!telefono.trim()) nuevosErrores.telefono = 'Teléfono es obligatorio';
		if (!correoElectronico.trim()) nuevosErrores.correoElectronico = 'Correo electrónico es obligatorio';
		if (!representanteLegal.trim()) nuevosErrores.representanteLegal = 'Representante legal es obligatorio';
		if (!dniRepresentante.trim()) nuevosErrores.dniRepresentante = 'DNI es obligatorio';

		if (autorizaNotificacionesEmail && !emailNotificaciones.trim()) {
			nuevosErrores.emailNotificaciones = 'Email de notificaciones es obligatorio';
		}

		errores = nuevosErrores;
		return Object.keys(nuevosErrores).length === 0;
	}

	function handleSubmit(e: Event) {
		e.preventDefault();

		if (!validar()) return;

		const data: Anexo1Data = {
			razonSocial,
			ruc,
			domicilioLegal,
			telefono,
			correoElectronico,
			representanteLegal,
			dniRepresentante,
			autorizaNotificacionesEmail,
			emailNotificaciones
		};

		onGuardar(data);
	}
</script>

<div class="space-y-6">
	<div>
		<h2 class="text-2xl font-bold text-gray-900 dark:text-white">
			Anexo N° 1 - Declaración Jurada de Datos del Postor
		</h2>
		<p class="mt-2 text-gray-600 dark:text-gray-300">
			Complete la información del postor según la Ley N° 32069
		</p>
	</div>

	<form onsubmit={handleSubmit} class="space-y-6">
		<!-- Formulario para participación individual -->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div class="md:col-span-2">
					<label for="razonSocial" class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
						Razón Social <span class="text-red-500">*</span>
					</label>
					<input
						type="text"
						id="razonSocial"
						bind:value={razonSocial}
						readonly
						class="w-full px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-900 
							border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-400
							cursor-not-allowed"
						title="Este campo se completa automáticamente desde su perfil empresarial"
					/>
					<p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Desde perfil empresarial</p>
				</div>

				<div>
					<label for="ruc" class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
						RUC <span class="text-red-500">*</span>
					</label>
					<input
						type="text"
						id="ruc"
						bind:value={ruc}
						readonly
						maxlength="11"
						class="w-full px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-900 
							border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-400
							cursor-not-allowed"
						title="Este campo se completa automáticamente desde su perfil empresarial"
					/>
					<p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Desde perfil empresarial</p>
				</div>

				<div>
					<label for="telefono" class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
						Teléfono <span class="text-red-500">*</span>
					</label>
					<input
						type="tel"
						id="telefono"
						bind:value={telefono}
						readonly
						class="w-full px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-900 
							border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-400
							cursor-not-allowed"
						title="Este campo se completa automáticamente desde su perfil empresarial"
					/>
					<p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Desde perfil empresarial</p>
				</div>

				<div class="md:col-span-2">
					<label for="domicilio" class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
						Domicilio Legal <span class="text-red-500">*</span>
					</label>
					<input
						type="text"
						id="domicilio"
						bind:value={domicilioLegal}
						readonly
						class="w-full px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-900 
							border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-400
							cursor-not-allowed"
						title="Este campo se completa automáticamente desde su perfil empresarial"
					/>
					<p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Desde perfil empresarial</p>
				</div>

				<div class="md:col-span-2">
					<label for="correo" class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
						Correo Electrónico <span class="text-red-500">*</span>
					</label>
					<input
						type="email"
						id="correo"
						bind:value={correoElectronico}
						readonly
						class="w-full px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-900 
							border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-400
							cursor-not-allowed"
						title="Este campo se completa automáticamente desde su perfil empresarial"
					/>
					<p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Desde perfil empresarial</p>
				</div>

				<div>
					<label for="representante" class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
						Representante Legal <span class="text-red-500">*</span>
					</label>
					<input
						type="text"
						id="representante"
						bind:value={representanteLegal}
						readonly
						class="w-full px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-900 
							border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-400
							cursor-not-allowed"
						title="Este campo se completa automáticamente desde su perfil empresarial"
					/>
					<p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Desde perfil empresarial</p>
				</div>

				<div>
					<label for="dni" class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
						DNI Representante <span class="text-red-500">*</span>
					</label>
					<input
						type="text"
						id="dni"
						bind:value={dniRepresentante}
						readonly
						maxlength="8"
						class="w-full px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-900 
							border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-400
							cursor-not-allowed"
						title="Este campo se completa automáticamente desde su perfil empresarial"
					/>
					<p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Desde perfil empresarial</p>
				</div>
			</div>

		<!-- Autorización de notificaciones -->
		<div class="border-t border-gray-200 dark:border-gray-700 pt-6">
			<div class="space-y-4">
				<div class="flex items-start space-x-3">
					<input
						type="checkbox"
						id="autorizaEmail"
						bind:checked={autorizaNotificacionesEmail}
						class="mt-1 w-4 h-4 text-blue-600 border-gray-300 dark:border-gray-700 rounded 
							focus:ring-2 focus:ring-blue-500"
					/>
					<label for="autorizaEmail" class="text-sm text-gray-900 dark:text-white">
						Autorizo a ser notificado por correo electrónico para todos los actos del presente 
						procedimiento de selección, de conformidad con lo establecido en la Ley N° 32069
					</label>
				</div>

				{#if autorizaNotificacionesEmail}
					<div>
						<label for="emailNot" class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
							Email para Notificaciones <span class="text-red-500">*</span>
						</label>
						<input
							type="email"
							id="emailNot"
							bind:value={emailNotificaciones}
							class="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 
								border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white
								focus:ring-2 focus:ring-blue-500 {errores.emailNotificaciones ? 'border-red-500' : ''}"
						/>
						{#if errores.emailNotificaciones}
							<p class="mt-1 text-sm text-red-500">{errores.emailNotificaciones}</p>
						{/if}
					</div>
				{/if}
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
				Continuar
			</button>
		</div>
	</form>
</div>