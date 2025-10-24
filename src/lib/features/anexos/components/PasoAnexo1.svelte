<!-- src/lib/features/anexos/components/PasoAnexo1.svelte -->
<script lang="ts">
	import type { Anexo1Data, MiembroConsorcio, TipoParticipacion, EmpresaConsorcio } from '../types';

	interface Props {
		onGuardar: (data: Anexo1Data) => void;
		onRegresar: () => void;
		tipoParticipacion: TipoParticipacion;
		datosIniciales?: Anexo1Data | null;
		empresasDisponibles: EmpresaConsorcio[];
	}

	let { onGuardar, onRegresar, tipoParticipacion, datosIniciales = null, empresasDisponibles }: Props = $props();

	// Datos para participación individual
	let razonSocial = $state(datosIniciales?.razonSocial || '');
	let ruc = $state(datosIniciales?.ruc || '20534233532');
	let domicilioLegal = $state(datosIniciales?.domicilioLegal || '');
	let telefono = $state(datosIniciales?.telefono || '');
	let correoElectronico = $state(datosIniciales?.correoElectronico || '');
	let representanteLegal = $state(datosIniciales?.representanteLegal || '');
	let dniRepresentante = $state(datosIniciales?.dniRepresentante || '');

	// Datos para consorcio
	let nombreConsorcio = $state(datosIniciales?.nombreConsorcio || '');
	let miembros = $state<MiembroConsorcio[]>(datosIniciales?.miembros || []);

	// Autorización de notificaciones
	let autorizaNotificacionesEmail = $state(datosIniciales?.autorizaNotificacionesEmail || false);
	let emailNotificaciones = $state(datosIniciales?.emailNotificaciones || correoElectronico);

	let errores = $state<Record<string, string>>({});
	let mostrarModalAgregarMiembro = $state(false);

	// Estados para agregar miembro
	let empresaSeleccionadaId = $state<number | null>(null);
	let esLider = $state(false);
	let porcentaje = $state(0);

	const totalPorcentaje = $derived(
		miembros.reduce((sum, m) => sum + m.porcentajeParticipacion, 0)
	);

	function validar(): boolean {
		const nuevosErrores: Record<string, string> = {};

		if (tipoParticipacion === 'individual') {
			if (!razonSocial.trim()) nuevosErrores.razonSocial = 'Razón social es obligatoria';
			if (!ruc.trim()) nuevosErrores.ruc = 'RUC es obligatorio';
			if (!domicilioLegal.trim()) nuevosErrores.domicilioLegal = 'Domicilio legal es obligatorio';
			if (!telefono.trim()) nuevosErrores.telefono = 'Teléfono es obligatorio';
			if (!correoElectronico.trim()) nuevosErrores.correoElectronico = 'Correo electrónico es obligatorio';
			if (!representanteLegal.trim()) nuevosErrores.representanteLegal = 'Representante legal es obligatorio';
			if (!dniRepresentante.trim()) nuevosErrores.dniRepresentante = 'DNI es obligatorio';
		} else {
			if (!nombreConsorcio.trim()) nuevosErrores.nombreConsorcio = 'Nombre del consorcio es obligatorio';
			if (miembros.length < 2) nuevosErrores.miembros = 'Un consorcio debe tener al menos 2 miembros';
			if (totalPorcentaje !== 100) nuevosErrores.porcentajes = 'Los porcentajes deben sumar 100%';
			const lideres = miembros.filter(m => m.esLider);
			if (lideres.length !== 1) nuevosErrores.lider = 'Debe haber exactamente un líder del consorcio';
		}

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
			tipoParticipacion,
			autorizaNotificacionesEmail,
			emailNotificaciones
		};

		if (tipoParticipacion === 'individual') {
			data.razonSocial = razonSocial;
			data.ruc = ruc;
			data.domicilioLegal = domicilioLegal;
			data.telefono = telefono;
			data.correoElectronico = correoElectronico;
			data.representanteLegal = representanteLegal;
			data.dniRepresentante = dniRepresentante;
		} else {
			data.nombreConsorcio = nombreConsorcio;
			data.miembros = miembros;
		}

		onGuardar(data);
	}

	function agregarMiembro() {
		if (!empresaSeleccionadaId || porcentaje <= 0) return;

		const empresa = empresasDisponibles.find(e => e.id === empresaSeleccionadaId);
		if (!empresa) return;

		// Si se marca como líder, quitar líder a los demás
		const nuevosMiembros = esLider 
			? miembros.map(m => ({ ...m, esLider: false }))
			: miembros;

		miembros = [
			...nuevosMiembros,
			{
				empresaId: empresa.id,
				nombreEmpresa: empresa.razonSocial,
				ruc: empresa.ruc,
				esLider,
				porcentajeParticipacion: porcentaje
			}
		];

		// Resetear formulario
		empresaSeleccionadaId = null;
		esLider = false;
		porcentaje = 0;
		mostrarModalAgregarMiembro = false;
	}

	function eliminarMiembro(index: number) {
		miembros = miembros.filter((_, i) => i !== index);
	}

	function cambiarLider(index: number) {
		miembros = miembros.map((m, i) => ({
			...m,
			esLider: i === index
		}));
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
		{#if tipoParticipacion === 'individual'}
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
						class="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 
							border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white
							focus:ring-2 focus:ring-blue-500 {errores.razonSocial ? 'border-red-500' : ''}"
					/>
					{#if errores.razonSocial}
						<p class="mt-1 text-sm text-red-500">{errores.razonSocial}</p>
					{/if}
				</div>

				<div>
					<label for="ruc" class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
						RUC <span class="text-red-500">*</span>
					</label>
					<input
						type="text"
						id="ruc"
						bind:value={ruc}
						maxlength="11"
						class="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 
							border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white
							focus:ring-2 focus:ring-blue-500 {errores.ruc ? 'border-red-500' : ''}"
					/>
					{#if errores.ruc}
						<p class="mt-1 text-sm text-red-500">{errores.ruc}</p>
					{/if}
				</div>

				<div>
					<label for="telefono" class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
						Teléfono <span class="text-red-500">*</span>
					</label>
					<input
						type="tel"
						id="telefono"
						bind:value={telefono}
						class="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 
							border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white
							focus:ring-2 focus:ring-blue-500 {errores.telefono ? 'border-red-500' : ''}"
					/>
					{#if errores.telefono}
						<p class="mt-1 text-sm text-red-500">{errores.telefono}</p>
					{/if}
				</div>

				<div class="md:col-span-2">
					<label for="domicilio" class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
						Domicilio Legal <span class="text-red-500">*</span>
					</label>
					<input
						type="text"
						id="domicilio"
						bind:value={domicilioLegal}
						class="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 
							border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white
							focus:ring-2 focus:ring-blue-500 {errores.domicilioLegal ? 'border-red-500' : ''}"
					/>
					{#if errores.domicilioLegal}
						<p class="mt-1 text-sm text-red-500">{errores.domicilioLegal}</p>
					{/if}
				</div>

				<div class="md:col-span-2">
					<label for="correo" class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
						Correo Electrónico <span class="text-red-500">*</span>
					</label>
					<input
						type="email"
						id="correo"
						bind:value={correoElectronico}
						class="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 
							border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white
							focus:ring-2 focus:ring-blue-500 {errores.correoElectronico ? 'border-red-500' : ''}"
					/>
					{#if errores.correoElectronico}
						<p class="mt-1 text-sm text-red-500">{errores.correoElectronico}</p>
					{/if}
				</div>

				<div>
					<label for="representante" class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
						Representante Legal <span class="text-red-500">*</span>
					</label>
					<input
						type="text"
						id="representante"
						bind:value={representanteLegal}
						class="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 
							border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white
							focus:ring-2 focus:ring-blue-500 {errores.representanteLegal ? 'border-red-500' : ''}"
					/>
					{#if errores.representanteLegal}
						<p class="mt-1 text-sm text-red-500">{errores.representanteLegal}</p>
					{/if}
				</div>

				<div>
					<label for="dni" class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
						DNI Representante <span class="text-red-500">*</span>
					</label>
					<input
						type="text"
						id="dni"
						bind:value={dniRepresentante}
						maxlength="8"
						class="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 
							border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white
							focus:ring-2 focus:ring-blue-500 {errores.dniRepresentante ? 'border-red-500' : ''}"
					/>
					{#if errores.dniRepresentante}
						<p class="mt-1 text-sm text-red-500">{errores.dniRepresentante}</p>
					{/if}
				</div>
			</div>
		{:else}
			<!-- Formulario para consorcio -->
			<div class="space-y-6">
				<div>
					<label for="nombreConsorcio" class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
						Nombre del Consorcio <span class="text-red-500">*</span>
					</label>
					<input
						type="text"
						id="nombreConsorcio"
						bind:value={nombreConsorcio}
						placeholder="Ej: Consorcio Constructores Unidos"
						class="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 
							border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white
							focus:ring-2 focus:ring-blue-500 {errores.nombreConsorcio ? 'border-red-500' : ''}"
					/>
					{#if errores.nombreConsorcio}
						<p class="mt-1 text-sm text-red-500">{errores.nombreConsorcio}</p>
					{/if}
				</div>

				<!-- Lista de miembros -->
				<div>
					<div class="flex items-center justify-between mb-3">
						<label class="block text-sm font-medium text-gray-900 dark:text-white">
							Miembros del Consorcio <span class="text-red-500">*</span>
						</label>
						<button
							type="button"
							onclick={() => mostrarModalAgregarMiembro = true}
							class="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white text-sm rounded-lg
								hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
						>
							Agregar Miembro
						</button>
					</div>

					{#if miembros.length > 0}
						<div class="space-y-3">
							{#each miembros as miembro, index}
								<div class="p-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
									<div class="flex items-start justify-between">
										<div class="flex-1">
											<div class="flex items-center space-x-2">
												<h4 class="font-semibold text-gray-900 dark:text-white">{miembro.nombreEmpresa}</h4>
												{#if miembro.esLider}
													<span class="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium rounded">
														LÍDER
													</span>
												{/if}
											</div>
											<p class="text-sm text-gray-600 dark:text-gray-400 mt-1">RUC: {miembro.ruc}</p>
											<p class="text-sm font-medium text-gray-900 dark:text-white mt-2">
												Participación: {miembro.porcentajeParticipacion}%
											</p>
										</div>
										<div class="flex items-center space-x-2">
											{#if !miembro.esLider}
												<button
													type="button"
													onclick={() => cambiarLider(index)}
													class="px-3 py-1 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 rounded transition-colors"
												>
													Hacer Líder
												</button>
											{/if}
											<button
												type="button"
												onclick={() => eliminarMiembro(index)}
												class="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 rounded transition-colors"
											>
												<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
													<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
												</svg>
											</button>
										</div>
									</div>
								</div>
							{/each}
						</div>

						<!-- Resumen de porcentajes -->
						<div class="mt-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
							<div class="flex items-center justify-between">
								<span class="font-medium text-gray-900 dark:text-white">Total de Participación:</span>
								<span class="text-lg font-bold {totalPorcentaje === 100 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}">
									{totalPorcentaje}%
								</span>
							</div>
							{#if totalPorcentaje !== 100}
								<p class="text-sm text-red-600 dark:text-red-400 mt-2">
									El total debe sumar 100%
								</p>
							{/if}
						</div>
					{:else}
						<div class="p-8 text-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
							<p class="text-gray-500 dark:text-gray-400">No hay miembros agregados</p>
							<p class="text-sm text-gray-400 dark:text-gray-500 mt-1">
								Agregue al menos 2 empresas para conformar el consorcio
							</p>
						</div>
					{/if}

					{#if errores.miembros}
						<p class="mt-2 text-sm text-red-500">{errores.miembros}</p>
					{/if}
					{#if errores.porcentajes}
						<p class="mt-2 text-sm text-red-500">{errores.porcentajes}</p>
					{/if}
					{#if errores.lider}
						<p class="mt-2 text-sm text-red-500">{errores.lider}</p>
					{/if}
				</div>
			</div>
		{/if}

		<!-- Autorización de notificaciones (común para ambos) -->
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

<!-- Modal agregar miembro -->
{#if mostrarModalAgregarMiembro}
	<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
		<div class="bg-white dark:bg-gray-900 rounded-lg max-w-md w-full p-6 space-y-4">
			<h3 class="text-xl font-bold text-gray-900 dark:text-white">Agregar Miembro al Consorcio</h3>

			<div>
				<label for="empresaSelect" class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
					Seleccionar Empresa
				</label>
				<select
					id="empresaSelect"
					bind:value={empresaSeleccionadaId}
					class="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 
						border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white
						focus:ring-2 focus:ring-blue-500"
				>
					<option value={null}>-- Seleccione una empresa --</option>
					{#each empresasDisponibles as empresa}
						<option value={empresa.id}>{empresa.razonSocial} - {empresa.ruc}</option>
					{/each}
				</select>
			</div>

			<div>
				<label for="porcentajeInput" class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
					Porcentaje de Participación
				</label>
				<div class="relative">
					<input
						type="number"
						id="porcentajeInput"
						bind:value={porcentaje}
						min="0"
						max="100"
						class="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 
							border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white
							focus:ring-2 focus:ring-blue-500"
					/>
					<span class="absolute right-3 top-2.5 text-gray-500 dark:text-gray-400">%</span>
				</div>
				<p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
					Disponible: {100 - totalPorcentaje}%
				</p>
			</div>

			<div class="flex items-center space-x-2">
				<input
					type="checkbox"
					id="esLiderCheck"
					bind:checked={esLider}
					class="w-4 h-4 text-blue-600 border-gray-300 dark:border-gray-700 rounded 
						focus:ring-2 focus:ring-blue-500"
				/>
				<label for="esLiderCheck" class="text-sm text-gray-900 dark:text-white">
					Esta empresa es el líder del consorcio
				</label>
			</div>

			<div class="flex space-x-3 pt-4">
				<button
					type="button"
					onclick={() => mostrarModalAgregarMiembro = false}
					class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 
						rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
				>
					Cancelar
				</button>
				<button
					type="button"
					onclick={agregarMiembro}
					disabled={!empresaSeleccionadaId || porcentaje <= 0}
					class="flex-1 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg
						hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors
						disabled:opacity-50 disabled:cursor-not-allowed"
				>
					Agregar
				</button>
			</div>
		</div>
	</div>
{/if}