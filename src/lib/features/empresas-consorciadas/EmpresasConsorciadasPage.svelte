<!-- src/lib/features/empresas-consorciadas/EmpresasConsorciadasPage.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { empresasConsorciadasStore } from '$lib/features/empresas-consorciadas/stores/empresas-consorciadas.svelte';
	import ListaEmpresas from '$lib/features/empresas-consorciadas/components/ListaEmpresas.svelte';
	import ResumenEmpresas from '$lib/features/empresas-consorciadas/components/ResumenEmpresas.svelte';
	import FormularioEmpresa from '$lib/features/empresas-consorciadas/components/FormularioEmpresa.svelte';
	import type { EmpresaConsorciadaFormData, EmpresaConsorciada } from '$lib/features/empresas-consorciadas/types';

	// Estado de la vista
	let mostrarFormulario = $state(false);
	let modoEdicion = $state(false);

	// Cargar empresas al montar el componente
	onMount(() => {
		empresasConsorciadasStore.fetchEmpresas();
	});

	// Handlers
	const handleAgregarNueva = () => {
		empresasConsorciadasStore.seleccionarEmpresa(null);
		empresasConsorciadasStore.limpiarErrores();
		modoEdicion = false;
		mostrarFormulario = true;
	};

	const handleEditar = (empresa: EmpresaConsorciada) => {
		empresasConsorciadasStore.seleccionarEmpresa(empresa);
		empresasConsorciadasStore.limpiarErrores();
		modoEdicion = true;
		mostrarFormulario = true;
	};

	const handleEliminar = async (id: number) => {
		if (confirm('¿Estás seguro de que deseas eliminar esta empresa? Esta acción la marcará como inactiva.')) {
			const success = await empresasConsorciadasStore.eliminarEmpresa(id);
			if (success) {
				// Opcional: Mostrar mensaje de éxito
			}
		}
	};

	const handleToggleActivo = async (id: number) => {
		await empresasConsorciadasStore.toggleEmpresaActiva(id);
	};

	const handleToggleFiltro = () => {
		empresasConsorciadasStore.setFiltroActivas(!empresasConsorciadasStore.filtroActivas);
	};

	const handleGuardar = async (data: EmpresaConsorciadaFormData) => {
		let success = false;

		if (modoEdicion && empresasConsorciadasStore.empresaSeleccionada) {
			success = await empresasConsorciadasStore.actualizarEmpresa(
				empresasConsorciadasStore.empresaSeleccionada.id,
				data
			);
		} else {
			success = await empresasConsorciadasStore.agregarEmpresa(data);
		}

		if (success) {
			mostrarFormulario = false;
			modoEdicion = false;
			empresasConsorciadasStore.seleccionarEmpresa(null);
		}
	};

	const handleCancelar = () => {
		mostrarFormulario = false;
		modoEdicion = false;
		empresasConsorciadasStore.seleccionarEmpresa(null);
		empresasConsorciadasStore.limpiarErrores();
	};
</script>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
	<div class="max-w-7xl mx-auto">
		<!-- Header -->
		<div class="mb-8">
			<div class="flex items-center justify-between">
				<div>
					<h1 class="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="2"
							stroke="currentColor"
							class="w-8 h-8 mr-3 text-blue-600 dark:text-blue-400"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
							/>
						</svg>
						Gestión de Empresas
					</h1>
					<p class="mt-2 text-gray-600 dark:text-gray-400">
						Administra las empresas disponibles para formar consorcios en licitaciones públicas
					</p>
				</div>

				{#if !mostrarFormulario}
					<button
						onclick={handleAgregarNueva}
						class="px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg font-medium transition-colors shadow-lg hover:shadow-xl flex items-center space-x-2"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="2"
							stroke="currentColor"
							class="w-5 h-5"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
						</svg>
						<span>Nueva Empresa</span>
					</button>
				{/if}
			</div>
		</div>

		<!-- Mensajes de Error Global -->
		{#if empresasConsorciadasStore.error}
			<div class="mb-6 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
				<div class="flex items-center">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="2"
						stroke="currentColor"
						class="w-5 h-5 text-red-600 dark:text-red-400 mr-2"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
						/>
					</svg>
					<p class="text-sm font-medium text-red-800 dark:text-red-300">
						{empresasConsorciadasStore.error}
					</p>
				</div>
			</div>
		{/if}

		<!-- Resumen de Empresas -->
		<div class="mb-8">
			<ResumenEmpresas 
				resumen={empresasConsorciadasStore.resumen}
				onToggleFiltro={handleToggleFiltro}
				mostrandoSoloActivas={empresasConsorciadasStore.filtroActivas}
			/>
		</div>

		<!-- Formulario -->
		{#if mostrarFormulario}
			<div class="mb-8">
				<FormularioEmpresa
					empresa={empresasConsorciadasStore.empresaSeleccionada}
					onGuardar={handleGuardar}
					onCancelar={handleCancelar}
					isSaving={empresasConsorciadasStore.isSaving}
					validationErrors={empresasConsorciadasStore.validationErrors}
				/>
			</div>
		{/if}

		<!-- Lista de Empresas -->
		<ListaEmpresas
			empresas={empresasConsorciadasStore.empresas}
			onEditar={handleEditar}
			onEliminar={handleEliminar}
			onToggleActivo={handleToggleActivo}
			isLoading={empresasConsorciadasStore.isLoading}
		/>

		<!-- Información Adicional -->
		{#if empresasConsorciadasStore.todasLasEmpresas.length > 0}
			<div class="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
				<div class="flex items-start">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="2"
						stroke="currentColor"
						class="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3 mt-0.5 flex-shrink-0"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
						/>
					</svg>
					<div>
						<h4 class="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">
							Información importante sobre el registro de empresas
						</h4>
						<ul class="text-sm text-blue-800 dark:text-blue-400 space-y-1 list-disc list-inside">
							<li>Registra aquí todas las empresas que podrían participar en consorcios</li>
							<li>Los porcentajes de participación se definirán al momento de generar los documentos para cada licitación</li>
							<li>Mantén actualizada la información del RNP (Registro Nacional de Proveedores)</li>
							<li>Las empresas marcadas como inactivas no aparecerán disponibles para formar consorcios</li>
							<li>Verifica que los datos del representante legal estén siempre actualizados</li>
						</ul>
					</div>
				</div>
			</div>
		{/if}

		<!-- Nota sobre el uso de las empresas -->
		<div class="mt-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
			<div class="flex items-start">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="2"
					stroke="currentColor"
					class="w-5 h-5 text-gray-500 dark:text-gray-400 mr-2 mt-0.5 flex-shrink-0"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
					/>
				</svg>
				<div class="text-sm text-gray-600 dark:text-gray-400">
					<p>
						<strong>¿Cómo se usan estas empresas?</strong> Al generar documentos para una licitación específica, 
						podrás seleccionar qué empresas formarán el consorcio, definir sus porcentajes de participación, 
						designar la empresa líder, y generar automáticamente todos los formatos necesarios con la información aquí registrada.
					</p>
				</div>
			</div>
		</div>
	</div>
</div>