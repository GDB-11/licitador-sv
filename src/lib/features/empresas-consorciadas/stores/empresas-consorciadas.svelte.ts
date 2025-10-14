// src/lib/features/empresas-consorciadas/stores/empresas-consorciadas.svelte.ts
import type {
	EmpresaConsorciada,
	EmpresaConsorciadaFormData,
	EmpresasConsorciadasState,
	ValidationErrors,
	ConsorcioResumen
} from '../types';

class EmpresasConsorciadasStore {
	private state = $state<EmpresasConsorciadasState>({
		empresas: [],
		empresaSeleccionada: null,
		isLoading: false,
		isSaving: false,
		error: null,
		validationErrors: {},
		porcentajeTotal: 0
	});

	// Getters reactivos
	get empresas() {
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

	get porcentajeTotal() {
		return this.state.porcentajeTotal;
	}

	get resumen(): ConsorcioResumen {
		const empresaLider = this.state.empresas.find((e) => e.esLider) || null;
		const porcentajeTotal = this.calcularPorcentajeTotal();
		
		return {
			totalEmpresas: this.state.empresas.length,
			porcentajeTotal,
			empresaLider,
			esValido: porcentajeTotal === 100 && empresaLider !== null
		};
	}

	// Calcular porcentaje total
	private calcularPorcentajeTotal(): number {
		return this.state.empresas.reduce((total, empresa) => total + empresa.porcentajeParticipacion, 0);
	}

	// Cargar empresas consorciadas desde API
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
					porcentajeParticipacion: 60,
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
					esLider: true,
					fechaRegistro: '2025-01-15'
				},
				{
					id: 2,
					ruc: '20601234567',
					razonSocial: 'INGENIEROS ASOCIADOS S.A.',
					nombreComercial: 'Ingenieros Asociados',
					porcentajeParticipacion: 40,
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
					esLider: false,
					fechaRegistro: '2025-01-15'
				}
			];

			this.state.empresas = empresasSimuladas;
			this.state.porcentajeTotal = this.calcularPorcentajeTotal();
		} catch (err) {
			this.state.error = err instanceof Error ? err.message : 'Error al cargar empresas consorciadas';
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
			// const response = await fetch('/api/empresas-consorciadas', {
			//   method: 'POST',
			//   headers: {
			//     'Authorization': `Bearer ${token}`,
			//     'Content-Type': 'application/json'
			//   },
			//   body: JSON.stringify(data)
			// });

			// Simulación de guardado
			await new Promise((resolve) => setTimeout(resolve, 1000));

			const nuevaEmpresa: EmpresaConsorciada = {
				id: Date.now(), // En producción, esto vendría del backend
				...data,
				fechaRegistro: new Date().toISOString().split('T')[0]
			};

			this.state.empresas = [...this.state.empresas, nuevaEmpresa];
			this.state.porcentajeTotal = this.calcularPorcentajeTotal();

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

			// TODO: Reemplazar con tu llamada real a la API
			// const response = await fetch(`/api/empresas-consorciadas/${id}`, {
			//   method: 'PUT',
			//   headers: {
			//     'Authorization': `Bearer ${token}`,
			//     'Content-Type': 'application/json'
			//   },
			//   body: JSON.stringify(data)
			// });

			// Simulación de actualización
			await new Promise((resolve) => setTimeout(resolve, 1000));

			this.state.empresas = this.state.empresas.map((empresa) =>
				empresa.id === id
					? { ...empresa, ...data }
					: empresa
			);
			this.state.porcentajeTotal = this.calcularPorcentajeTotal();

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
			// TODO: Reemplazar con tu llamada real a la API
			// const response = await fetch(`/api/empresas-consorciadas/${id}`, {
			//   method: 'DELETE',
			//   headers: { 'Authorization': `Bearer ${token}` }
			// });

			// Simulación de eliminación
			await new Promise((resolve) => setTimeout(resolve, 800));

			this.state.empresas = this.state.empresas.filter((empresa) => empresa.id !== id);
			this.state.porcentajeTotal = this.calcularPorcentajeTotal();

			return true;
		} catch (err) {
			this.state.error = err instanceof Error ? err.message : 'Error al eliminar empresa';
			return false;
		} finally {
			this.state.isSaving = false;
		}
	}

	// Seleccionar empresa para edición
	seleccionarEmpresa(empresa: EmpresaConsorciada | null) {
		this.state.empresaSeleccionada = empresa;
	}

	// Validaciones
	private validarEmpresa(data: EmpresaConsorciadaFormData): ValidationErrors {
		const errors: ValidationErrors = {};

		// Validar RUC
		if (!data.ruc || !/^\d{11}$/.test(data.ruc)) {
			errors['ruc'] = 'El RUC debe tener 11 dígitos';
		}

		// Validar Razón Social
		if (!data.razonSocial || data.razonSocial.trim() === '') {
			errors['razonSocial'] = 'La razón social es obligatoria';
		}

		// Validar Porcentaje
		if (data.porcentajeParticipacion <= 0 || data.porcentajeParticipacion > 100) {
			errors['porcentajeParticipacion'] = 'El porcentaje debe estar entre 1 y 100';
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