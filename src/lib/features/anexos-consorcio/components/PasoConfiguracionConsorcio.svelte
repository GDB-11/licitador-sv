<!-- src/lib/features/anexos-consorcio/components/PasoConfiguracionConsorcio.svelte -->
<script lang="ts">
	import type {
		ConfiguracionConsorcio,
		EmpresaConsorciadaSeleccionable,
		MiembroConsorcioSeleccionado
	} from '../types';

	interface Props {
		onGuardar: (config: ConfiguracionConsorcio) => void;
		datosIniciales?: ConfiguracionConsorcio | null;
		empresaPropia: { razonSocial: string; ruc: string } | null;
		empresasDisponibles: EmpresaConsorciadaSeleccionable[];
		isLoading?: boolean;
	}

	let {
		onGuardar,
		datosIniciales = null,
		empresaPropia,
		empresasDisponibles,
		isLoading = false
	}: Props = $props();

	// ─── Datos del proceso ────────────────────────────────────────────────────
	let numeroProceso = $state(datosIniciales?.numeroProceso || '');	let numeroFicha = $state(datosIniciales?.numeroFicha || '');
	let numeroAsiento = $state(datosIniciales?.numeroAsiento || '');	let entidad = $state(datosIniciales?.entidad || '');
	let objeto = $state(datosIniciales?.objeto || '');
	let ciudad = $state(datosIniciales?.ciudad || '');
	let nombreConsorcio = $state(datosIniciales?.nombreConsorcio || '');

	// ─── Empresas seleccionadas (IDs externos, max 2) ─────────────────────────
	let seleccionadas = $state<Set<string>>(
		new Set(
			datosIniciales?.miembros
				.filter((m) => !m.esEmpresaPropia)
				.map((m) => m.consortiumCompanyId) ?? []
		)
	);

	// ─── Líder: 'propia' o un consortiumCompanyId ─────────────────────────────
	const _liderInicial = (() => {
		const lider = datosIniciales?.miembros.find((m) => m.esLider);
		if (!lider) return 'propia';
		return lider.esEmpresaPropia ? 'propia' : lider.consortiumCompanyId;
	})();
	let liderSeleccionado = $state<string>(_liderInicial);

	// ─── Porcentajes: mapa consortiumCompanyId → porcentaje (entero) ──────────
	// 'propia' es la clave para la empresa del usuario
	const _porcentajesIniciales = (() => {
		const initial: Record<string, number> = { propia: 0 };
		if (datosIniciales) {
			for (const m of datosIniciales.miembros) {
				const key = m.esEmpresaPropia ? 'propia' : m.consortiumCompanyId;
				initial[key] = m.porcentajeParticipacion;
			}
		}
		return initial;
	})();
	let porcentajes = $state<Record<string, number>>(_porcentajesIniciales);

	let errores = $state<Record<string, string>>({});

	// ─── Computed ─────────────────────────────────────────────────────────────

	const puedeAgregarMas = $derived(seleccionadas.size < 2);

	/** Miembros en orden: empresa propia + seleccionadas en orden de selección */
	const miembrosActuales = $derived<MiembroConsorcioSeleccionado[]>([
		{
			consortiumCompanyId: 'propia',
			razonSocial: empresaPropia?.razonSocial ?? 'Mi Empresa',
			ruc: empresaPropia?.ruc ?? '',
			esLider: liderSeleccionado === 'propia',
			esEmpresaPropia: true,
			porcentajeParticipacion: porcentajes['propia'] ?? 0
		},
		...empresasDisponibles
			.filter((e) => seleccionadas.has(e.consortiumCompanyId))
			.map((e) => ({
				consortiumCompanyId: e.consortiumCompanyId,
				razonSocial: e.razonSocial,
				ruc: e.ruc,
				esLider: liderSeleccionado === e.consortiumCompanyId,
				esEmpresaPropia: false,
				porcentajeParticipacion: porcentajes[e.consortiumCompanyId] ?? 0
			}))
	]);

	const totalPorcentaje = $derived(
		miembrosActuales.reduce((sum, m) => sum + (porcentajes[m.consortiumCompanyId] ?? 0), 0)
	);

	const porcentajeRestante = $derived(100 - totalPorcentaje);

	// ─── Handlers ─────────────────────────────────────────────────────────────

	function toggleSeleccion(id: string) {
		const next = new Set(seleccionadas);
		if (next.has(id)) {
			next.delete(id);
			if (liderSeleccionado === id) liderSeleccionado = 'propia';
			// Limpiar porcentaje de empresa removida
			const newPct = { ...porcentajes };
			delete newPct[id];
			porcentajes = newPct;
		} else if (next.size < 2) {
			next.add(id);
			// Inicializar porcentaje en 0
			porcentajes = { ...porcentajes, [id]: 0 };
		}
		seleccionadas = next;
	}

	function setPorcentaje(id: string, raw: string) {
		const parsed = parseInt(raw, 10);
		const value = isNaN(parsed) ? 0 : Math.max(0, Math.min(100, parsed));
		porcentajes = { ...porcentajes, [id]: value };
	}

	function distribuirIgual() {
		const n = miembrosActuales.length;
		if (n === 0) return;
		const base = Math.floor(100 / n);
		const resto = 100 - base * n;
		const next: Record<string, number> = {};
		miembrosActuales.forEach((m, i) => {
			next[m.consortiumCompanyId] = base + (i === 0 ? resto : 0);
		});
		porcentajes = next;
	}

	// ─── Validación y envío ───────────────────────────────────────────────────

	function validar(): boolean {
		const e: Record<string, string> = {};

		if (!numeroProceso.trim()) e.numeroProceso = 'El número de proceso es obligatorio';
		if (!numeroFicha.trim()) e.numeroFicha = 'El número de ficha es obligatorio';
		if (!numeroAsiento.trim()) e.numeroAsiento = 'El número de asiento es obligatorio';
		if (!entidad.trim()) e.entidad = 'La entidad convocante es obligatoria';
		if (!objeto.trim()) e.objeto = 'El objeto de la contratación es obligatorio';
		if (!ciudad.trim()) e.ciudad = 'La ciudad es obligatoria';
		if (!nombreConsorcio.trim()) e.nombreConsorcio = 'El nombre del consorcio es obligatorio';
		if (seleccionadas.size === 0)
			e.empresas = 'Debe seleccionar al menos una empresa consorciada adicional';

		// Validar porcentajes
		for (const m of miembrosActuales) {
			const pct = porcentajes[m.consortiumCompanyId] ?? 0;
			if (!Number.isInteger(pct) || pct < 1) {
				e[`pct_${m.consortiumCompanyId}`] =
					`El porcentaje de "${m.razonSocial}" debe ser un número entero mayor a 0`;
			}
		}
		if (totalPorcentaje !== 100) {
			e.totalPorcentaje = `Los porcentajes deben sumar exactamente 100% (actualmente: ${totalPorcentaje}%)`;
		}

		if (!liderSeleccionado) e.lider = 'Debe designar un líder del consorcio';

		errores = e;
		return Object.keys(e).length === 0;
	}

	function handleSubmit(ev: Event) {
		ev.preventDefault();
		if (!validar()) return;

		onGuardar({
			numeroProceso,
			numeroFicha,
			numeroAsiento,
			entidad,
			objeto,
			ciudad,
			nombreConsorcio,
			miembros: miembrosActuales.map((m) => ({
				...m,
				porcentajeParticipacion: porcentajes[m.consortiumCompanyId] ?? 0
			}))
		});
	}
</script>

<div class="space-y-8">
	<div>
		<h2 class="text-2xl font-bold text-gray-900 dark:text-white">Configuración del Consorcio</h2>
		<p class="mt-2 text-gray-600 dark:text-gray-300">
			Configure los datos del proceso, los integrantes y sus porcentajes de participación
		</p>
	</div>

	<form onsubmit={handleSubmit} class="space-y-8">

		<!-- ══ SECCIÓN 1: DATOS DEL PROCESO ══════════════════════════════════════ -->
		<fieldset class="border border-gray-200 dark:border-gray-700 rounded-xl p-6 space-y-5">
			<legend class="px-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
				Datos del Proceso
			</legend>

			<div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
				<!-- Número de proceso -->
				<div class="sm:col-span-2">
					<label for="numeroProceso" class="block text-sm font-medium text-gray-900 dark:text-white mb-1.5">
						Número de Proceso <span class="text-red-500">*</span>
					</label>
					<input type="text" id="numeroProceso" bind:value={numeroProceso}
						placeholder="Ej: LP-001-2025-MINSA"
						class="w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-gray-800
							text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500
							focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors
							{errores.numeroProceso ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'}" />
					{#if errores.numeroProceso}
						<p class="mt-1 text-xs text-red-500">{errores.numeroProceso}</p>
					{/if}
				</div>

				<!-- Número de Ficha -->
				<div>
					<label for="numeroFicha" class="block text-sm font-medium text-gray-900 dark:text-white mb-1.5">
						Número de Ficha <span class="text-red-500">*</span>
					</label>
					<input type="text" id="numeroFicha" bind:value={numeroFicha}
						placeholder="Ej: F-2025-001"
						class="w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-gray-800
							text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500
							focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors
							{errores.numeroFicha ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'}" />
					{#if errores.numeroFicha}
						<p class="mt-1 text-xs text-red-500">{errores.numeroFicha}</p>
					{/if}
				</div>

				<!-- Número de Asiento -->
				<div>
					<label for="numeroAsiento" class="block text-sm font-medium text-gray-900 dark:text-white mb-1.5">
						Número de Asiento <span class="text-red-500">*</span>
					</label>
					<input type="text" id="numeroAsiento" bind:value={numeroAsiento}
						placeholder="Ej: A-2025-001"
						class="w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-gray-800
							text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500
							focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors
							{errores.numeroAsiento ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'}" />
					{#if errores.numeroAsiento}
						<p class="mt-1 text-xs text-red-500">{errores.numeroAsiento}</p>
					{/if}
				</div>

				<!-- Entidad -->
				<div class="sm:col-span-2">
					<label for="entidad" class="block text-sm font-medium text-gray-900 dark:text-white mb-1.5">
						Entidad Convocante <span class="text-red-500">*</span>
					</label>
					<input type="text" id="entidad" bind:value={entidad}
						placeholder="Ej: Ministerio de Salud"
						class="w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-gray-800
							text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500
							focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors
							{errores.entidad ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'}" />
					{#if errores.entidad}
						<p class="mt-1 text-xs text-red-500">{errores.entidad}</p>
					{/if}
				</div>

				<!-- Objeto -->
				<div class="sm:col-span-2">
					<label for="objeto" class="block text-sm font-medium text-gray-900 dark:text-white mb-1.5">
						Objeto de la Contratación <span class="text-red-500">*</span>
					</label>
					<textarea id="objeto" bind:value={objeto} rows="3"
						placeholder="Ej: Construcción del Hospital Regional de Lima Sur"
						class="w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-gray-800
							text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500
							focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none
							{errores.objeto ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'}"></textarea>
					{#if errores.objeto}
						<p class="mt-1 text-xs text-red-500">{errores.objeto}</p>
					{/if}
				</div>

				<!-- Ciudad -->
				<div>
					<label for="ciudad" class="block text-sm font-medium text-gray-900 dark:text-white mb-1.5">
						Ciudad <span class="text-red-500">*</span>
					</label>
					<input type="text" id="ciudad" bind:value={ciudad}
						placeholder="Ej: Lima"
						class="w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-gray-800
							text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500
							focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors
							{errores.ciudad ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'}" />
					{#if errores.ciudad}
						<p class="mt-1 text-xs text-red-500">{errores.ciudad}</p>
					{/if}
				</div>

				<!-- Nombre del consorcio -->
				<div>
					<label for="nombreConsorcio" class="block text-sm font-medium text-gray-900 dark:text-white mb-1.5">
						Nombre del Consorcio <span class="text-red-500">*</span>
					</label>
					<input type="text" id="nombreConsorcio" bind:value={nombreConsorcio}
						placeholder="Ej: Consorcio Lima Sur 2025"
						class="w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-gray-800
							text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500
							focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors
							{errores.nombreConsorcio ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'}" />
					{#if errores.nombreConsorcio}
						<p class="mt-1 text-xs text-red-500">{errores.nombreConsorcio}</p>
					{/if}
				</div>
			</div>
		</fieldset>

		<!-- ══ SECCIÓN 2: INTEGRANTES ══════════════════════════════════════════ -->
		<fieldset class="border border-blue-200 dark:border-blue-800 rounded-xl p-6 space-y-6">
			<legend class="px-2 text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
				Integrantes del Consorcio
			</legend>

			<p class="text-sm text-gray-600 dark:text-gray-400 -mt-2">
				Máximo 3 empresas en total. Seleccione hasta 2 empresas adicionales a la suya.
			</p>

			<!-- Empresa propia — siempre fija -->
			<div class="p-4 rounded-lg border-2 border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-950/40">
				<div class="flex items-center justify-between gap-4 flex-wrap">
					<div class="flex items-center gap-3 min-w-0">
						<div class="w-5 h-5 rounded bg-blue-600 dark:bg-blue-500 flex items-center justify-center flex-shrink-0">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3 h-3 text-white">
								<path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
							</svg>
						</div>
						<div class="min-w-0">
							<p class="font-semibold text-gray-900 dark:text-white text-sm truncate">
								{empresaPropia?.razonSocial ?? 'Mi Empresa'}
							</p>
							<p class="text-xs text-gray-500 dark:text-gray-400">
								RUC: {empresaPropia?.ruc ?? '—'} · <span class="text-blue-600 dark:text-blue-400 font-medium">Tu empresa</span>
							</p>
						</div>
					</div>
					<span class="text-xs text-blue-600 dark:text-blue-300 font-medium bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded-full flex-shrink-0">
						Siempre incluida
					</span>
				</div>
			</div>

			<!-- Empresas adicionales disponibles -->
			{#if isLoading}
				<div class="flex items-center gap-2 py-4 text-gray-500 dark:text-gray-400 text-sm">
					<svg class="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
						<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
					</svg>
					Cargando empresas consorciadas...
				</div>
			{:else if empresasDisponibles.length === 0}
				<div class="rounded-lg border border-amber-200 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/30 p-4">
					<div class="flex gap-3">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5">
							<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
						</svg>
						<div>
							<p class="text-sm font-medium text-amber-800 dark:text-amber-200">Sin empresas consorciadas registradas</p>
							<p class="text-xs text-amber-700 dark:text-amber-300 mt-1">
								Registre las empresas en <strong>Empresas Consorciadas</strong> antes de continuar.
							</p>
							<a href="/empresas-consorciadas" class="inline-flex items-center gap-1 mt-2 text-xs font-medium text-amber-800 dark:text-amber-200 underline hover:no-underline">
								Ir a Empresas Consorciadas
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3 h-3">
									<path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
								</svg>
							</a>
						</div>
					</div>
				</div>
			{:else}
				<div class="space-y-2">
					{#each empresasDisponibles as empresa (empresa.consortiumCompanyId)}
						{@const estaSeleccionada = seleccionadas.has(empresa.consortiumCompanyId)}
						{@const puedeSeleccionar = estaSeleccionada || puedeAgregarMas}
						<button
							type="button"
							onclick={() => toggleSeleccion(empresa.consortiumCompanyId)}
							disabled={!puedeSeleccionar}
							class="w-full p-4 rounded-lg border-2 text-left transition-all
								{estaSeleccionada
									? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-950/40'
									: puedeSeleccionar
									? 'border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600 bg-white dark:bg-gray-800/50'
									: 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/20 opacity-50 cursor-not-allowed'}"
						>
							<div class="flex items-center gap-3">
								<div class="flex-shrink-0 w-5 h-5 rounded border-2 transition-colors flex items-center justify-center
									{estaSeleccionada ? 'bg-blue-600 dark:bg-blue-500 border-blue-600 dark:border-blue-500' : 'border-gray-300 dark:border-gray-600'}">
									{#if estaSeleccionada}
										<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3 h-3 text-white">
											<path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
										</svg>
									{/if}
								</div>
								<div class="min-w-0 flex-1">
									<p class="font-medium text-gray-900 dark:text-white text-sm truncate">{empresa.razonSocial}</p>
									<p class="text-xs text-gray-500 dark:text-gray-400">
										RUC: {empresa.ruc}
										{#if empresa.representanteLegal.nombresCompletos}· Rep: {empresa.representanteLegal.nombresCompletos}{/if}
									</p>
								</div>
							</div>
						</button>
					{/each}
				</div>

				{#if !puedeAgregarMas}
					<p class="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3.5 h-3.5">
							<path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
						</svg>
						Máximo 2 empresas adicionales seleccionadas
					</p>
				{/if}
			{/if}

			{#if errores.empresas}
				<p class="text-xs text-red-500">{errores.empresas}</p>
			{/if}
		</fieldset>

		<!-- ══ SECCIÓN 3: PORCENTAJES + LÍDER ═══════════════════════════════════ -->
		{#if miembrosActuales.length >= 2}
			<fieldset class="border border-indigo-200 dark:border-indigo-800 rounded-xl p-6 space-y-5">
				<legend class="px-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
					Porcentajes de Participación y Líder
				</legend>

				<!-- Indicador de total -->
				<div class="flex items-center justify-between gap-4 flex-wrap">
					<div class="flex items-center gap-3">
						<div class="text-sm text-gray-600 dark:text-gray-400">
							Total asignado:
							<span class="font-bold ml-1
								{totalPorcentaje === 100
									? 'text-green-600 dark:text-green-400'
									: totalPorcentaje > 100
									? 'text-red-600 dark:text-red-400'
									: 'text-amber-600 dark:text-amber-400'}">
								{totalPorcentaje}%
							</span>
							<span class="text-gray-400 dark:text-gray-500"> / 100%</span>
						</div>
						{#if totalPorcentaje === 100}
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 text-green-500">
								<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
							</svg>
						{/if}
					</div>
					<button
						type="button"
						onclick={distribuirIgual}
						class="text-xs font-medium px-3 py-1.5 rounded-lg border border-indigo-300 dark:border-indigo-600
							text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors"
					>
						Distribuir equitativamente
					</button>
				</div>

				<!-- Barra de progreso del total -->
				<div class="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
					<div
						class="h-full rounded-full transition-all duration-300
							{totalPorcentaje === 100
								? 'bg-green-500 dark:bg-green-400'
								: totalPorcentaje > 100
								? 'bg-red-500 dark:bg-red-400'
								: 'bg-blue-500 dark:bg-blue-400'}"
						style="width: {Math.min(totalPorcentaje, 100)}%"
					></div>
				</div>

				{#if errores.totalPorcentaje}
					<p class="text-xs text-red-500 flex items-center gap-1">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3.5 h-3.5">
							<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
						</svg>
						{errores.totalPorcentaje}
					</p>
				{/if}

				<!-- Tabla de miembros: porcentaje + líder -->
				<div class="space-y-3">
					{#each miembrosActuales as miembro (miembro.consortiumCompanyId)}
						{@const pct = porcentajes[miembro.consortiumCompanyId] ?? 0}
						{@const pctError = errores[`pct_${miembro.consortiumCompanyId}`]}

						<div class="rounded-xl border bg-white dark:bg-gray-800/50
							{liderSeleccionado === miembro.consortiumCompanyId
								? 'border-yellow-300 dark:border-yellow-600'
								: 'border-gray-200 dark:border-gray-700'}
							p-4 transition-colors">

							<div class="flex flex-col sm:flex-row sm:items-center gap-3">

								<!-- Info empresa -->
								<div class="min-w-0 flex-1">
									<div class="flex items-center gap-2 flex-wrap">
										<p class="font-medium text-sm text-gray-900 dark:text-white truncate">
											{miembro.razonSocial}
										</p>
										{#if miembro.esEmpresaPropia}
											<span class="text-xs px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded font-medium">Tu empresa</span>
										{/if}
									</div>
									<p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">RUC: {miembro.ruc}</p>
								</div>

								<!-- Input de porcentaje -->
								<div class="flex items-center gap-2 flex-shrink-0">
									<div class="relative">
										<input
											type="number"
											min="1"
											max="99"
											step="1"
											value={pct}
											oninput={(e) => setPorcentaje(miembro.consortiumCompanyId, (e.target as HTMLInputElement).value)}
											class="w-20 px-3 py-2 pr-8 border rounded-lg text-center font-semibold text-sm
												bg-white dark:bg-gray-800 text-gray-900 dark:text-white
												focus:ring-2 focus:ring-blue-500 focus:border-transparent
												{pctError ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}
												[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
										/>
										<span class="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-500 dark:text-gray-400 pointer-events-none">
											%
										</span>
									</div>
								</div>

								<!-- Radio líder -->
								<label class="flex items-center gap-2 cursor-pointer flex-shrink-0 select-none">
									<input
										type="radio"
										name="lider"
										value={miembro.consortiumCompanyId}
										bind:group={liderSeleccionado}
										class="w-4 h-4 text-yellow-500 border-gray-300 dark:border-gray-600 focus:ring-yellow-400"
									/>
									<span class="text-xs font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">
										{liderSeleccionado === miembro.consortiumCompanyId ? '⭐ Líder' : 'Líder'}
									</span>
								</label>
							</div>

							{#if pctError}
								<p class="mt-1.5 text-xs text-red-500">{pctError}</p>
							{/if}

							<!-- Mini barra de porcentaje de esta empresa -->
							<div class="mt-3 h-1 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
								<div
									class="h-full rounded-full transition-all duration-300
										{liderSeleccionado === miembro.consortiumCompanyId
											? 'bg-yellow-400 dark:bg-yellow-500'
											: 'bg-blue-400 dark:bg-blue-500'}"
									style="width: {Math.min(pct, 100)}%"
								></div>
							</div>
						</div>
					{/each}
				</div>

				{#if errores.lider}
					<p class="text-xs text-red-500">{errores.lider}</p>
				{/if}

				<!-- Vista previa del consorcio -->
				{#if nombreConsorcio.trim() && totalPorcentaje === 100}
					<div class="mt-2 p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50
						dark:from-blue-950/30 dark:to-indigo-950/30
						border border-blue-100 dark:border-blue-800">
						<p class="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wide mb-2">
							Vista previa
						</p>
						<p class="text-base font-bold text-gray-900 dark:text-white mb-3">{nombreConsorcio}</p>
						<div class="space-y-1.5">
							{#each miembrosActuales as m (m.consortiumCompanyId)}
								<div class="flex items-center justify-between gap-2 text-xs text-gray-700 dark:text-gray-300">
									<div class="flex items-center gap-2 min-w-0">
										{#if m.esLider}
											<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3.5 h-3.5 text-yellow-500 flex-shrink-0">
												<path fill-rule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clip-rule="evenodd" />
											</svg>
										{:else}
											<div class="w-3.5 h-3.5 flex-shrink-0"></div>
										{/if}
										<span class="truncate">{m.razonSocial}</span>
									</div>
									<div class="flex items-center gap-2 flex-shrink-0">
										<span class="font-bold text-blue-700 dark:text-blue-300">
											{porcentajes[m.consortiumCompanyId] ?? 0}%
										</span>
										{#if m.esLider}
											<span class="text-yellow-600 dark:text-yellow-400">· Líder</span>
										{/if}
									</div>
								</div>
							{/each}
						</div>
					</div>
				{/if}
			</fieldset>
		{/if}

		<!-- Botón continuar -->
		<div class="flex justify-end">
			<button
				type="submit"
				disabled={isLoading}
				class="px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg font-medium
					hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors
					focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900
					disabled:opacity-50 disabled:cursor-not-allowed"
			>
				Continuar
			</button>
		</div>
	</form>
</div>