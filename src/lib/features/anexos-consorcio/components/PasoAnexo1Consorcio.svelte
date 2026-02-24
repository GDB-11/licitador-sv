<!-- src/lib/features/anexos-consorcio/components/PasoAnexo1Consorcio.svelte -->
<script lang="ts">
	import type { Anexo1ConsorcioData, ConfiguracionConsorcio } from '../types';

	interface Props {
		onGuardar: (data: Anexo1ConsorcioData) => void;
		onRegresar: () => void;
		datosIniciales?: Anexo1ConsorcioData | null;
		configuracion: ConfiguracionConsorcio;
	}

	let { onGuardar, onRegresar, datosIniciales = null, configuracion }: Props = $props();

	let razonSocial = $state(datosIniciales?.razonSocial || '');
	let ruc = $state(datosIniciales?.ruc || '');
	let domicilioLegal = $state(datosIniciales?.domicilioLegal || '');
	let telefono = $state(datosIniciales?.telefono || '');
	let correoElectronico = $state(datosIniciales?.correoElectronico || '');
	let representanteLegal = $state(datosIniciales?.representanteLegal || '');
	let dniRepresentante = $state(datosIniciales?.dniRepresentante || '');
	let autorizaNotificacionesEmail = $state(datosIniciales?.autorizaNotificacionesEmail || false);
	let emailNotificaciones = $state(datosIniciales?.emailNotificaciones || '');

	let errores = $state<Record<string, string>>({});

	function validar(): boolean {
		const e: Record<string, string> = {};
		if (!razonSocial.trim()) e.razonSocial = 'Razón social es obligatoria';
		if (!ruc.trim()) e.ruc = 'RUC es obligatorio';
		if (!domicilioLegal.trim()) e.domicilioLegal = 'Domicilio legal es obligatorio';
		if (!telefono.trim()) e.telefono = 'Teléfono es obligatorio';
		if (!correoElectronico.trim()) e.correoElectronico = 'Correo electrónico es obligatorio';
		if (!representanteLegal.trim()) e.representanteLegal = 'Representante legal es obligatorio';
		if (!dniRepresentante.trim()) e.dniRepresentante = 'DNI del representante es obligatorio';
		if (autorizaNotificacionesEmail && !emailNotificaciones.trim()) {
			e.emailNotificaciones = 'Ingrese el correo para notificaciones';
		}
		errores = e;
		return Object.keys(e).length === 0;
	}

	function handleSubmit(ev: Event) {
		ev.preventDefault();
		if (!validar()) return;
		onGuardar({
			razonSocial,
			ruc,
			domicilioLegal,
			telefono,
			correoElectronico,
			representanteLegal,
			dniRepresentante,
			autorizaNotificacionesEmail,
			emailNotificaciones
		});
	}
</script>

<div class="space-y-6">
	<div>
		<h2 class="text-2xl font-bold text-gray-900 dark:text-white">Anexo N° 1</h2>
		<p class="mt-1 text-gray-600 dark:text-gray-300">
			Declaración Jurada de Datos del Postor — <span class="font-medium text-blue-600 dark:text-blue-400">Consorcio {configuracion.nombreConsorcio}</span>
		</p>
		<p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
			Complete los datos de <strong>su empresa</strong>. Los datos del resto de integrantes se toman de sus perfiles registrados.
		</p>
	</div>

	<!-- Info de miembros del consorcio (sólo lectura) -->
	<div class="rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30 p-4">
		<p class="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wide mb-2">
			Integrantes del consorcio
		</p>
		<div class="space-y-1">
			{#each configuracion.miembros as m (m.consortiumCompanyId)}
				<div class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
					{#if m.esLider}
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4 text-yellow-500 flex-shrink-0">
							<path fill-rule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clip-rule="evenodd" />
						</svg>
					{:else}
						<div class="w-4 h-4 flex-shrink-0"></div>
					{/if}
					<span class="truncate">{m.razonSocial}</span>
					{#if m.esLider}<span class="text-xs text-yellow-600 dark:text-yellow-400">· Líder</span>{/if}
					{#if m.esEmpresaPropia}<span class="text-xs text-blue-600 dark:text-blue-400">· Tu empresa</span>{/if}
				</div>
			{/each}
		</div>
	</div>

	<form onsubmit={handleSubmit} class="space-y-5">
		<!-- Grid de campos -->
		<div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
			<!-- Razón social -->
			<div class="sm:col-span-2">
				<label for="razonSocial" class="block text-sm font-medium text-gray-900 dark:text-white mb-1.5">
					Razón Social <span class="text-red-500">*</span>
				</label>
				<input
					type="text"
					id="razonSocial"
					bind:value={razonSocial}
					class="w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-gray-800
						text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent
						{errores.razonSocial ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'}"
				/>
				{#if errores.razonSocial}<p class="mt-1 text-xs text-red-500">{errores.razonSocial}</p>{/if}
			</div>

			<!-- RUC -->
			<div>
				<label for="ruc" class="block text-sm font-medium text-gray-900 dark:text-white mb-1.5">
					RUC <span class="text-red-500">*</span>
				</label>
				<input
					type="text"
					id="ruc"
					bind:value={ruc}
					maxlength="11"
					class="w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-gray-800
						text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent
						{errores.ruc ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'}"
				/>
				{#if errores.ruc}<p class="mt-1 text-xs text-red-500">{errores.ruc}</p>{/if}
			</div>

			<!-- Teléfono -->
			<div>
				<label for="telefono" class="block text-sm font-medium text-gray-900 dark:text-white mb-1.5">
					Teléfono <span class="text-red-500">*</span>
				</label>
				<input
					type="text"
					id="telefono"
					bind:value={telefono}
					class="w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-gray-800
						text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent
						{errores.telefono ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'}"
				/>
				{#if errores.telefono}<p class="mt-1 text-xs text-red-500">{errores.telefono}</p>{/if}
			</div>

			<!-- Domicilio legal -->
			<div class="sm:col-span-2">
				<label for="domicilioLegal" class="block text-sm font-medium text-gray-900 dark:text-white mb-1.5">
					Domicilio Legal <span class="text-red-500">*</span>
				</label>
				<input
					type="text"
					id="domicilioLegal"
					bind:value={domicilioLegal}
					class="w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-gray-800
						text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent
						{errores.domicilioLegal ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'}"
				/>
				{#if errores.domicilioLegal}<p class="mt-1 text-xs text-red-500">{errores.domicilioLegal}</p>{/if}
			</div>

			<!-- Correo -->
			<div class="sm:col-span-2">
				<label for="correoElectronico" class="block text-sm font-medium text-gray-900 dark:text-white mb-1.5">
					Correo Electrónico <span class="text-red-500">*</span>
				</label>
				<input
					type="email"
					id="correoElectronico"
					bind:value={correoElectronico}
					class="w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-gray-800
						text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent
						{errores.correoElectronico ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'}"
				/>
				{#if errores.correoElectronico}<p class="mt-1 text-xs text-red-500">{errores.correoElectronico}</p>{/if}
			</div>

			<!-- Representante legal -->
			<div>
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

			<!-- DNI representante -->
			<div>
				<label for="dniRepresentante" class="block text-sm font-medium text-gray-900 dark:text-white mb-1.5">
					DNI Representante <span class="text-red-500">*</span>
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
		</div>

		<!-- Notificaciones por correo -->
		<div class="rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-3">
			<label class="flex items-start gap-3 cursor-pointer">
				<input
					type="checkbox"
					bind:checked={autorizaNotificacionesEmail}
					class="mt-0.5 w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
				/>
				<div>
					<p class="text-sm font-medium text-gray-900 dark:text-white">
						Autorizar notificaciones por correo electrónico
					</p>
					<p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
						Marque si desea recibir notificaciones del proceso al correo indicado.
					</p>
				</div>
			</label>
			{#if autorizaNotificacionesEmail}
				<div>
					<label for="emailNotificaciones" class="block text-sm font-medium text-gray-900 dark:text-white mb-1.5">
						Correo para notificaciones <span class="text-red-500">*</span>
					</label>
					<input
						type="email"
						id="emailNotificaciones"
						bind:value={emailNotificaciones}
						placeholder="notificaciones@empresa.pe"
						class="w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-gray-800
							text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent
							{errores.emailNotificaciones ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'}"
					/>
					{#if errores.emailNotificaciones}<p class="mt-1 text-xs text-red-500">{errores.emailNotificaciones}</p>{/if}
				</div>
			{/if}
		</div>

		<!-- Botones -->
		<div class="flex justify-between">
			<button
				type="button"
				onclick={onRegresar}
				class="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600
					rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
			>
				Regresar
			</button>
			<button
				type="submit"
				class="px-6 py-2.5 bg-blue-600 dark:bg-blue-500 text-white rounded-lg font-medium
					hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors
					focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900"
			>
				Continuar
			</button>
		</div>
	</form>
</div>