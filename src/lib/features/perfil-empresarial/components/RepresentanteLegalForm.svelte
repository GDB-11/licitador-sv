<!-- src/lib/features/perfil-empresarial/components/RepresentanteLegalForm.svelte -->
<script lang="ts">
	import Input from '$lib/components/form/Input.svelte';
	import FileUpload from '$lib/components/form/FileUpload.svelte';
	import type { RepresentanteLegal, ValidationErrors } from '../types';

	interface RepresentanteLegalFormProps {
		datos: RepresentanteLegal;
		errors?: ValidationErrors;
		disabled?: boolean;
		onUploadDNI: (file: File) => Promise<void>;
		onRemoveDNI?: () => void;
	}

	let {
		datos = $bindable(),
		errors = {},
		disabled = false,
		onUploadDNI,
		onRemoveDNI
	}: RepresentanteLegalFormProps = $props();
</script>

<div class="space-y-6">
	<div class="border-b border-gray-200 dark:border-gray-700 pb-4">
		<h3 class="text-lg font-semibold text-gray-900 dark:text-white">Representante Legal</h3>
		<p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
			Datos de la persona autorizada para firmar documentos
		</p>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
		<!-- DNI -->
		<Input
			type="text"
			name="dni"
			label="DNI"
			placeholder="12345678"
			bind:value={datos.dni}
			error={errors['dni']}
			required
			{disabled}
			oninput={(e) => {
				const target = e.target as HTMLInputElement;
				target.value = target.value.replace(/\D/g, '').slice(0, 8);
			}}
		/>

		<!-- Nombres Completos -->
		<Input
			type="text"
			name="nombresCompletos"
			label="Nombres Completos"
			placeholder="Juan Carlos Pérez García"
			bind:value={datos.nombresCompletos}
			error={errors['nombresCompletos']}
			required
			{disabled}
		/>
	</div>

	<!-- Copia de DNI -->
	<FileUpload
		label="Copia del DNI"
		accept="image/*,.pdf"
		maxSize={5}
		bind:currentFile={datos.copiaDNI}
		error={errors['copiaDNI']}
		{disabled}
		required
		onUpload={onUploadDNI}
		onRemove={onRemoveDNI}
	/>

	<div
		class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4"
	>
		<div class="flex items-start space-x-3">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
				/>
			</svg>
			<div class="text-sm text-blue-800 dark:text-blue-300">
				<p class="font-medium mb-1">Requisitos del documento</p>
				<ul class="list-disc list-inside space-y-1 text-xs">
					<li>La copia del DNI debe ser legible y en formato PDF o imagen</li>
					<li>Debe mostrar ambos lados del documento (anverso y reverso)</li>
					<li>El tamaño máximo es de 5MB</li>
				</ul>
			</div>
		</div>
	</div>
</div>