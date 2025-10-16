// src/lib/features/empresas-consorciadas/stores/empresas-consorciadas.svelte.ts
import type {
	EmpresaConsorciada,
	EmpresaConsorciadaFormData,
	EmpresasConsorciadasState,
	ValidationErrors,
	EmpresasResumen
} from '../types';

class EmpresasConsorciadasStore {
	private state = $state<EmpresasConsorciadasState>({
		empresas: [],
		empresaSeleccionada: null,
		isLoading: false,
		isSaving: false,
		error: null,
		validationErrors: {},
		filtroActivas: true
	});

	// Getters reactivos
	get empresas() {
		return this.state.filtroActivas 
			? this.state.empresas.filter(e => e.activo)
			: this.state.empresas;
	}

	get todasLasEmpresas() {
		return this.state.empresas;
	}

	get empresaSeleccionada() {
		return this.state.empresaSeleccionada;
	}

	get isLoading() {
		return this.state.isLoading;
	}

	get isSaving() {
		return this.state.isSaving;
	}

	get error() {
		return this.state.error;
	}

	get validationErrors() {
		return this.state.validationErrors;
	}

	get filtroActivas() {
		return this.state.filtroActivas;
	}

	get resumen(): EmpresasResumen {
		const totalEmpresas = this.state.empresas.length;
		const empresasActivas = this.state.empresas.filter(e => e.activo).length;
		const empresasInactivas = totalEmpresas - empresasActivas;
		const empresasConRNPVigente = this.state.empresas.filter(e => {
			if (!e.vigenciaRNPHasta) return false;
			return new Date(e.vigenciaRNPHasta) > new Date();
		}).length;
		
		return {
			totalEmpresas,
			empresasActivas,
			empresasInactivas,
			empresasConRNPVigente
		};
	}

	// Cambiar filtro de empresas activas
	setFiltroActivas(mostrarSoloActivas: boolean) {
		this.state.filtroActivas = mostrarSoloActivas;
	}

	// Cargar empresas desde API
	async fetchEmpresas() {
		this.state.isLoading = true;
		this.state.error = null;

		try {
			// TODO: Reemplazar con tu llamada real a la API
			// const response = await fetch('/api/empresas-consorciadas', {
			//   method: 'GET',
			//   headers: { 'Authorization': `Bearer ${token}` }
			// });
			// const data = await response.json();

			// Simulación de respuesta de API
			await new Promise((resolve) => setTimeout(resolve, 800));

			const empresasSimuladas: EmpresaConsorciada[] = [
				{
					id: 1,
					ruc: '20534233532',
					razonSocial: 'CONSTRUCTORA EL ARENAL S.A.C.',
					nombreComercial: 'El Arenal',
					domicilioFiscal: 'Av. Los Pinos 123, Lima, Lima, Perú',
					representanteLegal: {
						dni: '12345678',
						nombresCompletos: 'Juan Carlos Pérez García',
						cargo: 'Gerente General'
					},
					contacto: {
						telefono: '987654321',
						correoElectronico: 'contacto@elarenal.com'
					},
					actividadPrincipal: 'Construcción de edificios completos',
					registroRNP: 'A123456',
					vigenciaRNPHasta: '2025-12-31',
					fechaRegistro: '2025-01-15',
					activo: true
				},
				{
					id: 2,
					ruc: '20601234567',
					razonSocial: 'INGENIEROS ASOCIADOS S.A.',
					nombreComercial: 'Ingenieros Asociados',
					domicilioFiscal: 'Jr. Las Flores 456, Lima, Lima, Perú',
					representanteLegal: {
						dni: '87654321',
						nombresCompletos: 'María Elena Torres Vega',
						cargo: 'Gerente General'
					},
					contacto: {
						telefono: '912345678',
						correoElectronico: 'mtorres@ingenierosasociados.com'
					},
					actividadPrincipal: 'Servicios de ingeniería civil',
					registroRNP: 'B789012',
					vigenciaRNPHasta: '2026-03-15',
					fechaRegistro: '2025-01-15',
					activo: true
				},
				{
					id: 3,
					ruc: '20445566778',
					razonSocial: 'CONSULTORÍA TÉCNICA PERU S.R.L.',
					domicilioFiscal: 'Av. Arequipa 2450, Lima, Lima, Perú',
					representanteLegal: {
						dni: '44556677',
						nombresCompletos: 'Roberto Sánchez Mejía',
						cargo: 'Gerente General'
					},
					contacto: {
						telefono: '945678901',
						correoElectronico: 'info@consultecperu.com'
					},
					actividadPrincipal: 'Consultoría en proyectos de construcción',
					registroRNP: 'C345678',
					vigenciaRNPHasta: '2024-11-30', // Vencido
					fechaRegistro: '2024-06-10',
					activo: false
				}
			];

			this.state.empresas = empresasSimuladas;
		} catch (err) {
			this.state.error = err instanceof Error ? err.message : 'Error al cargar empresas';
		} finally {
			this.state.isLoading = false;
		}
	}

	// Agregar nueva empresa
	async agregarEmpresa(data: EmpresaConsorciadaFormData): Promise<boolean> {
		this.state.isSaving = true;
		this.state.error = null;
		this.state.validationErrors = {};

		try {
			// Validar datos
			const errors = this.validarEmpresa(data);
			if (Object.keys(errors).length > 0) {
				this.state.validationErrors = errors;
				this.state.isSaving = false;
				return false;
			}

			// TODO: Reemplazar con tu llamada real a la API
			await new Promise((resolve) => setTimeout(resolve, 1000));

			const nuevaEmpresa: EmpresaConsorciada = {
				id: Date.now(),
				...data,
				fechaRegistro: new Date().toISOString().split('T')[0],
				activo: true
			};

			this.state.empresas = [...this.state.empresas, nuevaEmpresa];
			return true;
		} catch (err) {
			this.state.error = err instanceof Error ? err.message : 'Error al agregar empresa';
			return false;
		} finally {
			this.state.isSaving = false;
		}
	}

	// Actualizar empresa existente
	async actualizarEmpresa(id: number, data: EmpresaConsorciadaFormData): Promise<boolean> {
		this.state.isSaving = true;
		this.state.error = null;
		this.state.validationErrors = {};

		try {
			// Validar datos
			const errors = this.validarEmpresa(data);
			if (Object.keys(errors).length > 0) {
				this.state.validationErrors = errors;
				this.state.isSaving = false;
				return false;
			}

			await new Promise((resolve) => setTimeout(resolve, 1000));

			this.state.empresas = this.state.empresas.map((empresa) =>
				empresa.id === id
					? { 
						...empresa, 
						...data,
						fechaActualizacion: new Date().toISOString().split('T')[0]
					}
					: empresa
			);

			return true;
		} catch (err) {
			this.state.error = err instanceof Error ? err.message : 'Error al actualizar empresa';
			return false;
		} finally {
			this.state.isSaving = false;
		}
	}

	// Eliminar empresa
	async eliminarEmpresa(id: number): Promise<boolean> {
		this.state.isSaving = true;
		this.state.error = null;

		try {
			await new Promise((resolve) => setTimeout(resolve, 800));
			
			// En lugar de eliminar físicamente, marcar como inactiva
			this.state.empresas = this.state.empresas.map((empresa) =>
				empresa.id === id
					? { ...empresa, activo: false }
					: empresa
			);

			return true;
		} catch (err) {
			this.state.error = err instanceof Error ? err.message : 'Error al eliminar empresa';
			return false;
		} finally {
			this.state.isSaving = false;
		}
	}

	// Activar/Desactivar empresa
	async toggleEmpresaActiva(id: number): Promise<boolean> {
		try {
			this.state.empresas = this.state.empresas.map((empresa) =>
				empresa.id === id
					? { ...empresa, activo: !empresa.activo }
					: empresa
			);
			return true;
		} catch (err) {
			this.state.error = err instanceof Error ? err.message : 'Error al cambiar estado de empresa';
			return false;
		}
	}

	// Seleccionar empresa para edición
	seleccionarEmpresa(empresa: EmpresaConsorciada | null) {
		this.state.empresaSeleccionada = empresa;
	}

	// Buscar empresa por RUC
	buscarPorRUC(ruc: string): EmpresaConsorciada | undefined {
		return this.state.empresas.find(e => e.ruc === ruc);
	}

	// Validaciones
	private validarEmpresa(data: EmpresaConsorciadaFormData): ValidationErrors {
		const errors: ValidationErrors = {};

		// Validar RUC
		if (!data.ruc || !/^\d{11}$/.test(data.ruc)) {
			errors['ruc'] = 'El RUC debe tener 11 dígitos';
		}

		// Verificar RUC duplicado
		const empresaExistente = this.state.empresas.find(
			e => e.ruc === data.ruc && e.id !== this.state.empresaSeleccionada?.id
		);
		if (empresaExistente) {
			errors['ruc'] = 'Ya existe una empresa con este RUC';
		}

		// Validar Razón Social
		if (!data.razonSocial || data.razonSocial.trim() === '') {
			errors['razonSocial'] = 'La razón social es obligatoria';
		}

		// Validar Domicilio Fiscal
		if (!data.domicilioFiscal || data.domicilioFiscal.trim() === '') {
			errors['domicilioFiscal'] = 'El domicilio fiscal es obligatorio';
		}

		// Validar DNI del representante
		if (!data.representanteLegal.dni || !/^\d{8}$/.test(data.representanteLegal.dni)) {
			errors['representanteLegal.dni'] = 'El DNI debe tener 8 dígitos';
		}

		// Validar Nombres del representante
		if (!data.representanteLegal.nombresCompletos || data.representanteLegal.nombresCompletos.trim() === '') {
			errors['representanteLegal.nombresCompletos'] = 'Los nombres completos son obligatorios';
		}

		// Validar Cargo
		if (!data.representanteLegal.cargo || data.representanteLegal.cargo.trim() === '') {
			errors['representanteLegal.cargo'] = 'El cargo es obligatorio';
		}

		// Validar Teléfono
		if (!data.contacto.telefono || !/^\d{9}$/.test(data.contacto.telefono)) {
			errors['contacto.telefono'] = 'El teléfono debe tener 9 dígitos';
		}

		// Validar Correo
		if (!data.contacto.correoElectronico || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contacto.correoElectronico)) {
			errors['contacto.correoElectronico'] = 'El correo electrónico no es válido';
		}

		// Validar fecha de vigencia RNP si existe
		if (data.vigenciaRNPHasta) {
			const fechaVigencia = new Date(data.vigenciaRNPHasta);
			if (isNaN(fechaVigencia.getTime())) {
				errors['vigenciaRNPHasta'] = 'La fecha de vigencia no es válida';
			}
		}

		return errors;
	}

	// Limpiar errores
	limpiarErrores() {
		this.state.error = null;
		this.state.validationErrors = {};
	}
}

// Exportar instancia única del store
export const empresasConsorciadasStore = new EmpresasConsorciadasStore();