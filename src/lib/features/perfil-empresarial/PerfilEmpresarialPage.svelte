<!-- src/lib/features/perfil-empresarial/PerfilEmpresarialPage.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { perfilEmpresarialStore } from './stores/perfil-empresarial.svelte';
	import DatosGeneralesForm from './components/DatosGeneralesForm.svelte';
	import RepresentanteLegalForm from './components/RepresentanteLegalForm.svelte';
	import DatosBancariosForm from './components/DatosBancariosForm.svelte';
	import PerfilProgress from './components/PerfilProgress.svelte';
	import Button from '$lib/components/form/Button.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';
	import type { PerfilEmpresarial } from './types';
	import { goto } from '$app/navigation';

	let seccionActiva = $state<'general' | 'representante' | 'bancarios'>('general');
	let showSuccessMessage = $state(false);

	// Crear copia local del perfil para editar
	let perfilLocal = $state<PerfilEmpresarial | null>(null);

	// Cargar perfil al montar
	onMount(async () => {
		await perfilEmpresarialStore.fetchPerfil();
		if (perfilEmpresarialStore.perfil) {
			perfilLocal = JSON.parse(JSON.stringify(perfilEmpresarialStore.perfil));
		}
	});

	// Sincronizar con el store cuando cambie
	$effect(() => {
		if (perfilEmpresarialStore.perfil && !perfilLocal) {
			perfilLocal = JSON.parse(JSON.stringify(perfilEmpresarialStore.perfil));
		}
	});

	async function handleGuardar() {
		if (!perfilLocal) return;

		const success = await perfilEmpresarialStore.savePerfil(perfilLocal);

		if (success) {
			showSuccessMessage = true;
			setTimeout(() => {
				showSuccessMessage = false;
			}, 3000);
		}
	}

	async function handleUploadDNI(file: File) {
		const url = await perfilEmpresarialStore.uploadFile(file);
		if (url && perfilLocal) {
			perfilLocal.representanteLegal.copiaDNI = url;
		}
	}

	function handleRemoveDNI() {
		if (perfilLocal) {
			perfilLocal.representanteLegal.copiaDNI = '';
		}
	}

	function handleCancelar() {
		// Recargar datos del store
		if (perfilEmpresarialStore.perfil) {
			perfilLocal = JSON.parse(JSON.stringify(perfilEmpresarialStore.perfil));
		}
		perfilEmpresarialStore.clearErrors();

        goto('/dashboard');
	}

    function handleAnterior() {
		const currentIndex = secciones.findIndex((s) => s.id === seccionActiva);
		if (currentIndex > 0) {
			seccionActiva = secciones[currentIndex - 1].id;
		}
	}

	function handleSiguiente() {
		const currentIndex = secciones.findIndex((s) => s.id === seccionActiva);
		if (currentIndex < secciones.length - 1) {
			seccionActiva = secciones[currentIndex + 1].id;
		}
	}	

	const secciones = [
		{ id: 'general', label: 'Datos Generales', icon: 'building' },
		{ id: 'representante', label: 'Representante Legal', icon: 'user' },
		{ id: 'bancarios', label: 'Datos Bancarios', icon: 'credit-card' }
	] as const;

    const puedeIrAnterior = $derived(
		secciones.findIndex((s) => s.id === seccionActiva) > 0
	);

	const puedeIrSiguiente = $derived(
		secciones.findIndex((s) => s.id === seccionActiva) < secciones.length - 1
	);
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
	<!-- Header -->
	<div class="mb-8">
		<h1 class="text-3xl font-bold text-gray-900 dark:text-white">Perfil Empresarial</h1>
		<p class="text-gray-600 dark:text-gray-400 mt-2">
			Gestiona la información de tu empresa para la generación de documentos
		</p>
	</div>

	{#if perfilEmpresarialStore.isLoading}
		<div class="flex justify-center items-center py-12">
			<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
		</div>
	{:else if perfilLocal}
		<div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
			<!-- Sidebar con navegación -->
            <div class="lg:col-span-1 space-y-4">
                <!-- Progreso -->
                <PerfilProgress completitud={perfilEmpresarialStore.completitud} />
                
                <!-- Navegación de tabs: horizontal en mobile, vertical en desktop -->
                <nav class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-1">
                    <!-- Mobile/Tablet: Horizontal con scroll -->
                    <div class="flex lg:hidden space-x-1 overflow-x-auto justify-center">
                        {#each secciones as seccion}
                            <button
                                onclick={() => (seccionActiva = seccion.id)}
                                class="flex-shrink-0 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-all duration-200
                                {seccionActiva === seccion.id
                                    ? 'bg-indigo-600 dark:bg-indigo-500 text-white shadow-sm'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke-width="2"
                                    stroke="currentColor"
                                    class="w-5 h-5"
                                >
                                    {#if seccion.icon === 'building'}
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z"
                                        />
                                    {:else if seccion.icon === 'user'}
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                                        />
                                    {:else}
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
                                        />
                                    {/if}
                                </svg>
                                <span class="hidden sm:inline text-sm font-medium whitespace-nowrap">{seccion.label}</span>
                            </button>
                        {/each}
                    </div>

                    <!-- Desktop: Vertical (apilado) -->
                    <div class="hidden lg:flex lg:flex-col lg:space-y-1">
                        {#each secciones as seccion}
                            <button
                                onclick={() => (seccionActiva = seccion.id)}
                                class="flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-left w-full
                                {seccionActiva === seccion.id
                                    ? 'bg-indigo-600 dark:bg-indigo-500 text-white shadow-sm'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke-width="2"
                                    stroke="currentColor"
                                    class="w-5 h-5 flex-shrink-0"
                                >
                                    {#if seccion.icon === 'building'}
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z"
                                        />
                                    {:else if seccion.icon === 'user'}
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                                        />
                                    {:else}
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
                                        />
                                    {/if}
                                </svg>
                                <span class="text-sm font-medium">{seccion.label}</span>
                            </button>
                        {/each}
                    </div>
                </nav>
            </div>

			<!-- Formularios -->
			<div class="lg:col-span-3">
				<div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
					<!-- Mensajes -->
					{#if showSuccessMessage}
						<div class="mb-6">
							<Alert type="success">Perfil guardado correctamente</Alert>
						</div>
					{/if}

					{#if perfilEmpresarialStore.error}
						<div class="mb-6">
							<Alert type="error">{perfilEmpresarialStore.error}</Alert>
						</div>
					{/if}

					<!-- Formulario según sección activa -->
					{#if seccionActiva === 'general'}
						<DatosGeneralesForm
							bind:datos={perfilLocal.datosGenerales}
							errors={perfilEmpresarialStore.validationErrors}
							disabled={perfilEmpresarialStore.isSaving}
						/>
					{:else if seccionActiva === 'representante'}
						<RepresentanteLegalForm
							bind:datos={perfilLocal.representanteLegal}
							errors={perfilEmpresarialStore.validationErrors}
							disabled={perfilEmpresarialStore.isSaving}
							onUploadDNI={handleUploadDNI}
							onRemoveDNI={handleRemoveDNI}
						/>
					{:else if seccionActiva === 'bancarios'}
						<DatosBancariosForm
							bind:datos={perfilLocal.datosBancarios}
							errors={perfilEmpresarialStore.validationErrors}
							disabled={perfilEmpresarialStore.isSaving}
						/>
					{/if}

					<!-- Botones de acción -->
                    <div class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <!-- Layout responsive: stack en móvil, distribuido en desktop -->
                        <div class="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4">
                            
                            <!-- Navegación entre secciones - Secundaria -->
                            <div class="flex items-center justify-center sm:justify-start gap-2">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onclick={handleAnterior}
                                    disabled={!puedeIrAnterior || perfilEmpresarialStore.isSaving}
                                    className="group"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke-width="2"
                                        stroke="currentColor"
                                        class="w-4 h-4 mr-1.5 transition-transform group-hover:-translate-x-0.5"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            d="M15.75 19.5L8.25 12l7.5-7.5"
                                        />
                                    </svg>
                                    Anterior
                                </Button>

                                <!-- Indicador de progreso de sección -->
                                <div class="hidden sm:flex items-center gap-1.5 px-3">
                                    {#each secciones as seccion, index}
                                        <div
                                            class="w-2 h-2 rounded-full transition-all duration-200 {seccionActiva === seccion.id
                                                ? 'bg-indigo-600 dark:bg-indigo-400 w-6'
                                                : 'bg-gray-300 dark:bg-gray-600'}"
                                            title={seccion.label}
                                        ></div>
                                    {/each}
                                </div>

                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onclick={handleSiguiente}
                                    disabled={!puedeIrSiguiente || perfilEmpresarialStore.isSaving}
                                    className="group"
                                >
                                    Siguiente
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke-width="2"
                                        stroke="currentColor"
                                        class="w-4 h-4 ml-1.5 transition-transform group-hover:translate-x-0.5"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            d="M8.25 4.5l7.5 7.5-7.5 7.5"
                                        />
                                    </svg>
                                </Button>
                            </div>

                            <!-- Acciones principales - Primarias -->
                            <div class="flex items-center justify-stretch sm:justify-end gap-3 w-full sm:w-auto">
                                <Button
                                    type="button"
                                    
                                    onclick={handleCancelar}
                                    disabled={perfilEmpresarialStore.isSaving}
                                    className="flex-1 sm:flex-initial"
                                >
                                    Cancelar
                                </Button>
                                
                                <Button
                                    type="button"
                                    variant="primary"
                                    onclick={handleGuardar}
                                    loading={perfilEmpresarialStore.isSaving}
                                    className="flex-1 sm:flex-initial min-w-[140px]"
                                >
                                    {#if perfilEmpresarialStore.isSaving}
                                        Guardando...
                                    {:else}
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke-width="2"
                                            stroke="currentColor"
                                            class="w-4 h-4 mr-2"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                d="M4.5 12.75l6 6 9-13.5"
                                            />
                                        </svg>
                                        Guardar Cambios
                                    {/if}
                                </Button>
                            </div>
                        </div>

                        <!-- Indicador de cambios no guardados (opcional) -->
                        {#if perfilLocal && JSON.stringify(perfilLocal) !== JSON.stringify(perfilEmpresarialStore.perfil)}
                            <div class="mt-4 flex items-center justify-center sm:justify-end">
                                <p class="text-sm text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke-width="2"
                                        stroke="currentColor"
                                        class="w-4 h-4"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                                        />
                                    </svg>
                                    Hay cambios sin guardar
                                </p>
                            </div>
                        {/if}
                    </div>
				</div>
			</div>
		</div>
	{:else}
		<div class="text-center py-12">
			<div class="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 max-w-md mx-auto">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="w-16 h-16 mx-auto text-gray-400 dark:text-gray-500 mb-4"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
					/>
				</svg>
				<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
					No se pudo cargar el perfil empresarial
				</h3>
				{#if perfilEmpresarialStore.error}
					<p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
						{perfilEmpresarialStore.error}
					</p>
				{/if}
				<div class="flex flex-col sm:flex-row gap-3 justify-center">
					<Button
						type="button"
						variant="primary"
						onclick={() => perfilEmpresarialStore.fetchPerfil()}
					>
						Reintentar
					</Button>
					<Button
						type="button"
						onclick={() => goto('/dashboard')}
					>
						Volver al Dashboard
					</Button>
				</div>
			</div>
		</div>
	{/if}
</div>