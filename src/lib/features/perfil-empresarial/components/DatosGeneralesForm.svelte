<!-- src/lib/features/perfil-empresarial/components/DatosGeneralesForm.svelte -->
<script lang="ts">
	import Input from '$lib/components/form/Input.svelte';
	import Checkbox from '$lib/components/form/Checkbox.svelte';
	import type { DatosGenerales, ValidationErrors } from '../types';

	interface DatosGeneralesFormProps {
		datos: DatosGenerales;
		errors?: ValidationErrors;
		disabled?: boolean;
	}

	let { datos = $bindable(), errors = {}, disabled = false }: DatosGeneralesFormProps = $props();
</script>

<div class="space-y-6">
	<div class="border-b border-gray-200 dark:border-gray-700 pb-4">
		<h3 class="text-lg font-semibold text-gray-900 dark:text-white">Datos Generales</h3>
		<p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
			Información básica de la empresa para licitaciones públicas
		</p>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
		<!-- RUC -->
		<Input
			type="text"
			name="ruc"
			label="RUC"
			placeholder="20123456789"
			bind:value={datos.ruc}
			error={errors['ruc']}
			required
			{disabled}
			oninput={(e) => {
				const target = e.target as HTMLInputElement;
				target.value = target.value.replace(/\D/g, '').slice(0, 11);
			}}
		/>

		<!-- Razón Social -->
		<Input
			type="text"
			name="razonSocial"
			label="Razón Social"
			placeholder="CONSTRUCTORA EL ARENAL S.A.C."
			bind:value={datos.razonSocial}
			error={errors['razonSocial']}
			required
			{disabled}
		/>

		<!-- Nombre Comercial -->
		<Input
			type="text"
			name="nombreComercial"
			label="Nombre Comercial"
			placeholder="El Arenal"
			bind:value={datos.nombreComercial}
			error={errors['nombreComercial']}
			{disabled}
		/>

		<!-- Fecha de Constitución -->
		<Input
			type="text"
			name="fechaConstitucion"
			label="Fecha de Constitución"
			placeholder="2020-03-15"
			bind:value={datos.fechaConstitucion}
			error={errors['fechaConstitucion']}
			{disabled}
			oninput={(e) => {
				const target = e.target as HTMLInputElement;
				let value = target.value.replace(/\D/g, '');
				if (value.length >= 4) {
					value = value.slice(0, 4) + '-' + value.slice(4);
				}
				if (value.length >= 7) {
					value = value.slice(0, 7) + '-' + value.slice(7);
				}
				target.value = value.slice(0, 10);
			}}
		/>
	</div>

	<!-- Domicilio Legal -->
	<Input
		type="text"
		name="domicilioLegal"
		label="Domicilio Legal Completo"
		placeholder="Av. Los Pinos 123, Lima, Lima, Perú"
		bind:value={datos.domicilioLegal}
		error={errors['domicilioLegal']}
		required
		{disabled}
	/>

	<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
		<!-- Teléfono -->
		<Input
			type="tel"
			name="telefono"
			label="Teléfono"
			placeholder="987654321"
			bind:value={datos.telefono}
			error={errors['telefono']}
			required
			{disabled}
			oninput={(e) => {
				const target = e.target as HTMLInputElement;
				target.value = target.value.replace(/\D/g, '').slice(0, 9);
			}}
		/>

		<!-- Correo Electrónico -->
		<Input
			type="email"
			name="correoElectronico"
			label="Correo Electrónico"
			placeholder="contacto@empresa.com"
			bind:value={datos.correoElectronico}
			error={errors['correoElectronico']}
			required
			{disabled}
		/>
	</div>

	<!-- Condición MYPE -->
	<div class="pt-4">
		<Checkbox bind:checked={datos.condicionMYPE} disabled={disabled}>
			La empresa tiene condición de Micro y Pequeña Empresa (MYPE)
		</Checkbox>
		<p class="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-6">
			Esta información puede otorgar beneficios en licitaciones públicas
		</p>
	</div>
</div>