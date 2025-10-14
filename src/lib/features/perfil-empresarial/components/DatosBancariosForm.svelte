<!-- src/lib/features/perfil-empresarial/components/DatosBancariosForm.svelte -->
<script lang="ts">
	import Input from '$lib/components/form/Input.svelte';
	import type { DatosBancarios, ValidationErrors } from '../types';

	interface DatosBancariosFormProps {
		datos: DatosBancarios;
		errors?: ValidationErrors;
		disabled?: boolean;
	}

	let { datos = $bindable(), errors = {}, disabled = false }: DatosBancariosFormProps = $props();

	// Lista de bancos en Perú
	const bancosPeru = [
		'Banco de Crédito del Perú',
		'BBVA',
		'Scotiabank',
		'Interbank',
		'Banco de la Nación',
		'Banco Pichincha',
		'Banco GNB',
		'Banco Falabella',
		'Banco Ripley',
		'Banbif',
		'Citibank',
		'Mibanco',
		'Otro'
	];
</script>

<div class="space-y-6">
	<div class="border-b border-gray-200 dark:border-gray-700 pb-4">
		<h3 class="text-lg font-semibold text-gray-900 dark:text-white">Datos Bancarios</h3>
		<p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
			Información para transferencias y pagos de contratos
		</p>
	</div>

	<!-- CCI -->
	<div>
		<Input
			type="text"
			name="cci"
			label="CCI (Código de Cuenta Interbancaria)"
			placeholder="00220013312345678901"
			bind:value={datos.cci}
			error={errors['cci']}
			required
			{disabled}
			oninput={(e) => {
				const target = e.target as HTMLInputElement;
				target.value = target.value.replace(/\D/g, '').slice(0, 20);
			}}
		/>
		<p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
			El CCI debe tener exactamente 20 dígitos
		</p>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
		<!-- Banco -->
		<div>
			<label
				for="banco"
				class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
			>
				Banco
				<span class="text-red-600 dark:text-red-400">*</span>
			</label>
			<select
				id="banco"
				name="banco"
				bind:value={datos.banco}
				{disabled}
				class="w-full px-4 py-2.5 border-2 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-700 
               placeholder-gray-400 dark:placeholder-gray-500
               transition-colors duration-200
               focus:outline-none focus:ring-2 focus:ring-offset-2
               {errors['banco']
					? 'border-red-500 focus:border-red-500 focus:ring-red-600'
					: 'border-gray-300 dark:border-gray-600 focus:border-blue-600 focus:ring-blue-600'}
               {disabled ? 'opacity-50 cursor-not-allowed' : ''}"
			>
				<option value="">Seleccionar banco</option>
				{#each bancosPeru as banco}
					<option value={banco}>{banco}</option>
				{/each}
			</select>
			{#if errors['banco']}
				<p class="mt-1 text-sm text-red-600 dark:text-red-400">
					{errors['banco']}
				</p>
			{/if}
		</div>

		<!-- Número de Cuenta -->
		<Input
			type="text"
			name="numeroCuenta"
			label="Número de Cuenta"
			placeholder="193-1234567-8-90"
			bind:value={datos.numeroCuenta}
			error={errors['numeroCuenta']}
			required
			{disabled}
		/>
	</div>

	<div
		class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4"
	>
		<div class="flex items-start space-x-3">
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
			<div class="text-sm text-amber-800 dark:text-amber-300">
				<p class="font-medium mb-1">Importante</p>
				<p class="text-xs">
					El CCI es obligatorio para recibir pagos de contratos públicos. Asegúrate de que la cuenta
					esté a nombre de la empresa.
				</p>
			</div>
		</div>
	</div>
</div>