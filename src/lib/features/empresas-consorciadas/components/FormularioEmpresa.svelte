<!-- src/lib/features/empresas-consorciadas/components/FormularioEmpresa.svelte -->
<script lang="ts">
	import type { EmpresaConsorciada, EmpresaConsorciadaFormData, ValidationErrors } from '../types';

	interface FormularioEmpresaProps {
		empresa?: EmpresaConsorciada | null;
		onGuardar: (data: EmpresaConsorciadaFormData) => Promise<void>;
		onCancelar: () => void;
		isSaving: boolean;
		validationErrors: ValidationErrors;
	}

	let { empresa = null, onGuardar, onCancelar, isSaving, validationErrors }: FormularioEmpresaProps = $props();

	// Estado del formulario
	let formData = $state<EmpresaConsorciadaFormData>({
		ruc: empresa?.ruc || '',
		razonSocial: empresa?.razonSocial || '',
		nombreComercial: empresa?.nombreComercial || '',
		porcentajeParticipacion: empresa?.porcentajeParticipacion || 0,
		domicilioFiscal: empresa?.domicilioFiscal || '',
		representanteLegal: {
			dni: empresa?.representanteLegal.dni || '',
			nombresCompletos: empresa?.representanteLegal.nombresCompletos || '',
			cargo: empresa?.representanteLegal.cargo || ''
		},
		contacto: {
			telefono: empresa?.contacto.telefono || '',
			correoElectronico: empresa?.contacto.correoElectronico || ''
		},
		esLider: empresa?.esLider || false
	});

	const handleSubmit = async (e: Event) => {
		e.preventDefault();
		await onGuardar(formData);
	};

	const getErrorMessage = (field: string): string | undefined => {
		return validationErrors[field];
	};
</script>

<div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
	<!-- Header -->
	<div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
		<h3 class="text-lg font-semibold text-gray-900 dark:text-white">
			{empresa ? 'Editar Empresa Consorciada' : 'Nueva Empresa Consorciada'}
		</h3>
		<p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
			{empresa ? 'Actualiza los datos de la empresa' : 'Completa los datos de la empresa que forma parte del consorcio'}
		</p>
	</div>

	<!-- Formulario -->
	<form onsubmit={handleSubmit} class="p-6 space-y-6">
		<!-- Datos Generales -->
		<div>
			<h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="2"
					stroke="currentColor"
					class="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z"
					/>
				</svg>
				Datos Generales
			</h4>
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<!-- RUC -->
				<div>
					<label for="ruc" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
						RUC <span class="text-red-600">*</span>
					</label>
					<input
						type="text"
						id="ruc"
						bind:value={formData.ruc}
						maxlength="11"
						placeholder="20XXXXXXXXX"
						class="w-full px-4 py-2 border {getErrorMessage('ruc')
							? 'border-red-500 dark:border-red-500'
							: 'border-gray-300 dark:border-gray-600'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
					/>
					{#if getErrorMessage('ruc')}
						<p class="mt-1 text-sm text-red-600 dark:text-red-400">{getErrorMessage('ruc')}</p>
					{/if}
				</div>

				<!-- Porcentaje de Participación -->
				<div>
					<label for="porcentaje" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
						Porcentaje de Participación (%) <span class="text-red-600">*</span>
					</label>
					<input
						type="number"
						id="porcentaje"
						bind:value={formData.porcentajeParticipacion}
						min="0"
						max="100"
						step="0.01"
						placeholder="50"
						class="w-full px-4 py-2 border {getErrorMessage('porcentajeParticipacion')
							? 'border-red-500 dark:border-red-500'
							: 'border-gray-300 dark:border-gray-600'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
					/>
					{#if getErrorMessage('porcentajeParticipacion')}
						<p class="mt-1 text-sm text-red-600 dark:text-red-400">{getErrorMessage('porcentajeParticipacion')}</p>
					{/if}
				</div>

				<!-- Razón Social -->
				<div class="md:col-span-2">
					<label for="razonSocial" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
						Razón Social <span class="text-red-600">*</span>
					</label>
					<input
						type="text"
						id="razonSocial"
						bind:value={formData.razonSocial}
						placeholder="CONSTRUCTORA EJEMPLO S.A.C."
						class="w-full px-4 py-2 border {getErrorMessage('razonSocial')
							? 'border-red-500 dark:border-red-500'
							: 'border-gray-300 dark:border-gray-600'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
					/>
					{#if getErrorMessage('razonSocial')}
						<p class="mt-1 text-sm text-red-600 dark:text-red-400">{getErrorMessage('razonSocial')}</p>
					{/if}
				</div>

				<!-- Nombre Comercial -->
				<div class="md:col-span-2">
					<label for="nombreComercial" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
						Nombre Comercial (Opcional)
					</label>
					<input
						type="text"
						id="nombreComercial"
						bind:value={formData.nombreComercial}
						placeholder="Nombre comercial de la empresa"
						class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
					/>
				</div>

				<!-- Domicilio Fiscal -->
				<div class="md:col-span-2">
					<label for="domicilioFiscal" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
						Domicilio Fiscal <span class="text-red-600">*</span>
					</label>
					<textarea
						id="domicilioFiscal"
						bind:value={formData.domicilioFiscal}
						rows="2"
						placeholder="Av. Los Pinos 123, Lima, Lima, Perú"
						class="w-full px-4 py-2 border {getErrorMessage('domicilioFiscal')
							? 'border-red-500 dark:border-red-500'
							: 'border-gray-300 dark:border-gray-600'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
					></textarea>
					{#if getErrorMessage('domicilioFiscal')}
						<p class="mt-1 text-sm text-red-600 dark:text-red-400">{getErrorMessage('domicilioFiscal')}</p>
					{/if}
				</div>

				<!-- Es Líder -->
				<div class="md:col-span-2">
					<label class="flex items-center space-x-2 cursor-pointer">
						<input
							type="checkbox"
							bind:checked={formData.esLider}
							class="w-4 h-4 text-blue-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500"
						/>
						<span class="text-sm font-medium text-gray-700 dark:text-gray-300">
							¿Es la empresa líder del consorcio?
						</span>
					</label>
				</div>
			</div>
		</div>

		<!-- Representante Legal -->
		<div>
			<h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="2"
					stroke="currentColor"
					class="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
					/>
				</svg>
				Representante Legal
			</h4>
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<!-- DNI -->
				<div>
					<label for="dni" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
						DNI <span class="text-red-600">*</span>
					</label>
					<input
						type="text"
						id="dni"
						bind:value={formData.representanteLegal.dni}
						maxlength="8"
						placeholder="12345678"
						class="w-full px-4 py-2 border {getErrorMessage('representanteLegal.dni')
							? 'border-red-500 dark:border-red-500'
							: 'border-gray-300 dark:border-gray-600'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
					/>
					{#if getErrorMessage('representanteLegal.dni')}
						<p class="mt-1 text-sm text-red-600 dark:text-red-400">{getErrorMessage('representanteLegal.dni')}</p>
					{/if}
				</div>

				<!-- Cargo -->
				<div>
					<label for="cargo" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
						Cargo <span class="text-red-600">*</span>
					</label>
					<input
						type="text"
						id="cargo"
						bind:value={formData.representanteLegal.cargo}
						placeholder="Gerente General"
						class="w-full px-4 py-2 border {getErrorMessage('representanteLegal.cargo')
							? 'border-red-500 dark:border-red-500'
							: 'border-gray-300 dark:border-gray-600'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
					/>
					{#if getErrorMessage('representanteLegal.cargo')}
						<p class="mt-1 text-sm text-red-600 dark:text-red-400">{getErrorMessage('representanteLegal.cargo')}</p>
					{/if}
				</div>

				<!-- Nombres Completos -->
				<div class="md:col-span-2">
					<label for="nombresCompletos" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
						Nombres Completos <span class="text-red-600">*</span>
					</label>
					<input
						type="text"
						id="nombresCompletos"
						bind:value={formData.representanteLegal.nombresCompletos}
						placeholder="Juan Carlos Pérez García"
						class="w-full px-4 py-2 border {getErrorMessage('representanteLegal.nombresCompletos')
							? 'border-red-500 dark:border-red-500'
							: 'border-gray-300 dark:border-gray-600'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
					/>
					{#if getErrorMessage('representanteLegal.nombresCompletos')}
						<p class="mt-1 text-sm text-red-600 dark:text-red-400">{getErrorMessage('representanteLegal.nombresCompletos')}</p>
					{/if}
				</div>
			</div>
		</div>

		<!-- Datos de Contacto -->
		<div>
			<h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="2"
					stroke="currentColor"
					class="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
					/>
				</svg>
				Datos de Contacto
			</h4>
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<!-- Teléfono -->
				<div>
					<label for="telefono" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
						Teléfono <span class="text-red-600">*</span>
					</label>
					<input
						type="tel"
						id="telefono"
						bind:value={formData.contacto.telefono}
						maxlength="9"
						placeholder="987654321"
						class="w-full px-4 py-2 border {getErrorMessage('contacto.telefono')
							? 'border-red-500 dark:border-red-500'
							: 'border-gray-300 dark:border-gray-600'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
					/>
					{#if getErrorMessage('contacto.telefono')}
						<p class="mt-1 text-sm text-red-600 dark:text-red-400">{getErrorMessage('contacto.telefono')}</p>
					{/if}
				</div>

				<!-- Correo Electrónico -->
				<div>
					<label for="correoElectronico" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
						Correo Electrónico <span class="text-red-600">*</span>
					</label>
					<input
						type="email"
						id="correoElectronico"
						bind:value={formData.contacto.correoElectronico}
						placeholder="contacto@empresa.com"
						class="w-full px-4 py-2 border {getErrorMessage('contacto.correoElectronico')
							? 'border-red-500 dark:border-red-500'
							: 'border-gray-300 dark:border-gray-600'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
					/>
					{#if getErrorMessage('contacto.correoElectronico')}
						<p class="mt-1 text-sm text-red-600 dark:text-red-400">{getErrorMessage('contacto.correoElectronico')}</p>
					{/if}
				</div>
			</div>
		</div>

		<!-- Botones de Acción -->
		<div class="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
			<button
				type="button"
				onclick={onCancelar}
				disabled={isSaving}
				class="px-6 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
			>
				Cancelar
			</button>
			<button
				type="submit"
				disabled={isSaving}
				class="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
			>
				{#if isSaving}
					<svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
						<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
					</svg>
					Guardando...
				{:else}
					{empresa ? 'Actualizar Empresa' : 'Agregar Empresa'}
				{/if}
			</button>
		</div>
	</form>
</div>