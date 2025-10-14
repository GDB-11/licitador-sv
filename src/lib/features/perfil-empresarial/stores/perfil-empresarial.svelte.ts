// src/lib/features/perfil-empresarial/stores/perfil-empresarial.svelte.ts
import type {
	PerfilEmpresarial,
	PerfilEmpresarialState,
	ValidationErrors,
	DatosGenerales,
	RepresentanteLegal,
	DatosBancarios
} from '../types';

class PerfilEmpresarialStore {
	private state = $state<PerfilEmpresarialState>({
		perfil: null,
		isLoading: false,
		isSaving: false,
		error: null,
		validationErrors: {},
		completitud: 0
	});

	// Getters reactivos
	get perfil() {
		return this.state.perfil;
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

	get completitud() {
		return this.state.completitud;
	}

	// Calcular completitud del perfil (0-100%)
	private calcularCompletitud(perfil: PerfilEmpresarial): number {
		const campos = [
			perfil.datosGenerales.ruc,
			perfil.datosGenerales.razonSocial,
			perfil.datosGenerales.nombreComercial,
			perfil.datosGenerales.domicilioLegal,
			perfil.datosGenerales.telefono,
			perfil.datosGenerales.correoElectronico,
			perfil.datosGenerales.fechaConstitucion,
			perfil.representanteLegal.dni,
			perfil.representanteLegal.nombresCompletos,
			perfil.representanteLegal.copiaDNI,
			perfil.datosBancarios.cci,
			perfil.datosBancarios.banco,
			perfil.datosBancarios.numeroCuenta
		];

		const completados = campos.filter((campo) => campo && campo.toString().trim() !== '').length;
		return Math.round((completados / campos.length) * 100);
	}

	// Cargar perfil desde API
	async fetchPerfil() {
		this.state.isLoading = true;
		this.state.error = null;

		try {
			// TODO: Reemplazar con tu llamada real a la API
			// const response = await fetch('/api/perfil-empresarial', {
			//   method: 'GET',
			//   headers: { 'Authorization': `Bearer ${token}` }
			// });
			// const data = await response.json();

			// Simulación de respuesta de API
			await new Promise((resolve) => setTimeout(resolve, 800));

			const perfilSimulado: PerfilEmpresarial = {
				datosGenerales: {
					ruc: '20601234567',
					razonSocial: 'CONSTRUCTORA EL ARENAL S.A.C.',
					nombreComercial: 'El Arenal',
					domicilioLegal: 'Av. Los Pinos 123, Lima, Lima, Perú',
					telefono: '987654321',
					correoElectronico: 'contacto@elarenal.com',
					fechaConstitucion: '2020-03-15',
					condicionMYPE: true
				},
				representanteLegal: {
					dni: '12345678',
					nombresCompletos: 'Juan Carlos Pérez García',
					copiaDNI: '' // URL de archivo subido
				},
				datosBancarios: {
					cci: '00220013312345678901',
					banco: 'Banco de Crédito del Perú',
					numeroCuenta: '193-1234567-8-90'
				}
			};

			this.state.perfil = perfilSimulado;
			this.state.completitud = this.calcularCompletitud(perfilSimulado);
		} catch (err) {
			this.state.error = err instanceof Error ? err.message : 'Error al cargar el perfil';
		} finally {
			this.state.isLoading = false;
		}
	}

	// Guardar perfil completo
	async savePerfil(perfil: PerfilEmpresarial): Promise<boolean> {
		this.state.isSaving = true;
		this.state.error = null;
		this.state.validationErrors = {};

		try {
			// Validar antes de enviar
			const errors = this.validatePerfil(perfil);
			if (Object.keys(errors).length > 0) {
				this.state.validationErrors = errors;
				this.state.isSaving = false;
				return false;
			}

			// TODO: Reemplazar con tu llamada real a la API
			// const response = await fetch('/api/perfil-empresarial', {
			//   method: 'PUT',
			//   headers: {
			//     'Authorization': `Bearer ${token}`,
			//     'Content-Type': 'application/json'
			//   },
			//   body: JSON.stringify(perfil)
			// });

			// Simulación de guardado
			await new Promise((resolve) => setTimeout(resolve, 1000));

			this.state.perfil = perfil;
			this.state.completitud = this.calcularCompletitud(perfil);

			return true;
		} catch (err) {
			this.state.error = err instanceof Error ? err.message : 'Error al guardar el perfil';
			return false;
		} finally {
			this.state.isSaving = false;
		}
	}

	// Actualizar sección específica
	async updateSeccion(
		seccion: 'datosGenerales' | 'representanteLegal' | 'datosBancarios',
		datos: DatosGenerales | RepresentanteLegal | DatosBancarios
	): Promise<boolean> {
		if (!this.state.perfil) return false;

		const perfilActualizado = {
			...this.state.perfil,
			[seccion]: datos
		};

		return await this.savePerfil(perfilActualizado);
	}

	// Validaciones
	private validatePerfil(perfil: PerfilEmpresarial): ValidationErrors {
		const errors: ValidationErrors = {};

		// Validar Datos Generales
		if (!perfil.datosGenerales.ruc || !/^\d{11}$/.test(perfil.datosGenerales.ruc)) {
			errors['ruc'] = 'El RUC debe tener 11 dígitos';
		}

		if (!perfil.datosGenerales.razonSocial || perfil.datosGenerales.razonSocial.trim() === '') {
			errors['razonSocial'] = 'La razón social es obligatoria';
		}

		if (
			!perfil.datosGenerales.correoElectronico ||
			!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(perfil.datosGenerales.correoElectronico)
		) {
			errors['correoElectronico'] = 'Correo electrónico inválido';
		}

		if (
			!perfil.datosGenerales.telefono ||
			!/^\d{9}$/.test(perfil.datosGenerales.telefono.replace(/\s/g, ''))
		) {
			errors['telefono'] = 'El teléfono debe tener 9 dígitos';
		}

		// Validar Representante Legal
		if (!perfil.representanteLegal.dni || !/^\d{8}$/.test(perfil.representanteLegal.dni)) {
			errors['dni'] = 'El DNI debe tener 8 dígitos';
		}

		if (
			!perfil.representanteLegal.nombresCompletos ||
			perfil.representanteLegal.nombresCompletos.trim() === ''
		) {
			errors['nombresCompletos'] = 'Los nombres completos son obligatorios';
		}

		// Validar Datos Bancarios
		if (!perfil.datosBancarios.cci || !/^\d{20}$/.test(perfil.datosBancarios.cci)) {
			errors['cci'] = 'El CCI debe tener 20 dígitos';
		}

		if (!perfil.datosBancarios.banco || perfil.datosBancarios.banco.trim() === '') {
			errors['banco'] = 'El banco es obligatorio';
		}

		if (
			!perfil.datosBancarios.numeroCuenta ||
			perfil.datosBancarios.numeroCuenta.trim() === ''
		) {
			errors['numeroCuenta'] = 'El número de cuenta es obligatorio';
		}

		return errors;
	}

	// Subir archivo (copia de DNI)
	async uploadFile(file: File): Promise<string | null> {
		try {
			// TODO: Reemplazar con tu llamada real a la API
			// const formData = new FormData();
			// formData.append('file', file);
			// const response = await fetch('/api/perfil-empresarial/upload', {
			//   method: 'POST',
			//   headers: { 'Authorization': `Bearer ${token}` },
			//   body: formData
			// });
			// const data = await response.json();
			// return data.url;

			// Simulación
			await new Promise((resolve) => setTimeout(resolve, 1500));
			return `https://storage.example.com/dni/${file.name}`;
		} catch (err) {
			this.state.error = 'Error al subir el archivo';
			return null;
		}
	}

	// Limpiar errores
	clearErrors() {
		this.state.error = null;
		this.state.validationErrors = {};
	}

	// Resetear store
	reset() {
		this.state = {
			perfil: null,
			isLoading: false,
			isSaving: false,
			error: null,
			validationErrors: {},
			completitud: 0
		};
	}
}

export const perfilEmpresarialStore = new PerfilEmpresarialStore();