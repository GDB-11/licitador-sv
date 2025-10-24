// src/lib/features/perfil-empresarial/stores/perfil-empresarial.svelte.ts
import { apiService } from '$lib/services/api.service';
import { API_ENDPOINTS } from '$lib/config/api.config';
import { authStore } from '$lib/features/auth/stores/auth.svelte';
import { goto } from '$app/navigation';
import type {
	PerfilEmpresarial,
	PerfilEmpresarialState,
	ValidationErrors,
	DatosGenerales,
	RepresentanteLegal,
	DatosBancarios,
	CompanyDetailsResponse,
	UpdateCompanyDetailsRequest
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

	// Mapear respuesta de API a estructura del frontend
	// Maneja campos opcionales y datos incompletos
	private mapApiResponseToPerfilEmpresarial(response: CompanyDetailsResponse): PerfilEmpresarial {
		return {
			datosGenerales: {
				ruc: response.ruc || '',
				razonSocial: response.razonSocial || '',
				nombreComercial: response.razonSocial || '', // Si no tienes nombreComercial en el API, usar razonSocial
				domicilioLegal: response.domicilioLegal || '',
				telefono: response.telefono || '',
				correoElectronico: response.email || '',
				fechaConstitucion: response.fechaConstitucion || '',
				condicionMYPE: response.isMype ?? false
			},
			representanteLegal: {
				dni: response.legalRepresentative?.documentNumber || '',
				nombresCompletos: response.legalRepresentative?.fullName || '',
				copiaDNI: response.legalRepresentative?.nationalIdImage || undefined
			},
			datosBancarios: {
				cci: response.bankAccount?.cciCode || '',
				banco: response.bankAccount?.bankName || '',
				numeroCuenta: response.bankAccount?.accountNumber || ''
			}
		};
	}

	// Mapear estructura del frontend a request de API para actualización
	private mapPerfilEmpresarialToApiRequest(
		perfil: PerfilEmpresarial
	): UpdateCompanyDetailsRequest {
		const companyId = authStore.company?.companyId;
		
		if (!companyId) {
			throw new Error('No se encontró el ID de la empresa');
		}

		// Construir el request con los datos del formulario
		const request: UpdateCompanyDetailsRequest = {
			companyId,
			ruc: perfil.datosGenerales.ruc,
			razonSocial: perfil.datosGenerales.razonSocial,
			domicilioLegal: perfil.datosGenerales.domicilioLegal,
			telefono: perfil.datosGenerales.telefono || null,
			email: perfil.datosGenerales.correoElectronico,
			fechaConstitucion: perfil.datosGenerales.fechaConstitucion || null,
			isMype: perfil.datosGenerales.condicionMYPE
		};

		// Agregar representante legal si hay datos
		if (perfil.representanteLegal.dni || perfil.representanteLegal.nombresCompletos) {
			request.legalRepresentative = {
				fullName: perfil.representanteLegal.nombresCompletos,
				documentType: 'DNI', // Por defecto DNI para Perú
				documentNumber: perfil.representanteLegal.dni,
				// copiaDNI ya es un string Base64 (sin prefijo data:image)
				// viene del API o de uploadFile() que convierte File a Base64
				nationalIdImage: perfil.representanteLegal.copiaDNI || null
			};
		}

		// Agregar datos bancarios si hay datos
		if (perfil.datosBancarios.cci || perfil.datosBancarios.banco) {
			request.bankAccount = {
				bankName: perfil.datosBancarios.banco,
				accountNumber: perfil.datosBancarios.numeroCuenta,
				cciCode: perfil.datosBancarios.cci
			};
		}

		return request;
	}

	// Cargar perfil desde API
	async fetchPerfil() {
		this.state.isLoading = true;
		this.state.error = null;

		try {
			// Obtener el companyId desde el authStore
			const companyId = authStore.company?.companyId;
			
			if (!companyId) {
				// Si no hay companyId, intentar cargar la información de la empresa primero
				const companyLoaded = await authStore.fetchCompany();
				if (!companyLoaded || !authStore.company?.companyId) {
					throw new Error('No se encontró información de la empresa. Por favor, inicie sesión nuevamente.');
				}
			}

			// Llamar a la API real con el companyId actualizado
			const response = await apiService.get<CompanyDetailsResponse>(
				API_ENDPOINTS.company.myCompanyDetails(authStore.company!.companyId)
			);

			console.log('Respuesta del API de perfil:', response); // Para debugging

			// Mapear la respuesta al formato del frontend
			const perfilMapeado = this.mapApiResponseToPerfilEmpresarial(response);
			
			this.state.perfil = perfilMapeado;
			this.state.completitud = this.calcularCompletitud(perfilMapeado);
			
			console.log('Perfil mapeado:', perfilMapeado); // Para debugging
			console.log('Completitud:', this.state.completitud); // Para debugging
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Error al cargar el perfil';
			this.state.error = errorMessage;
			
			console.error('Error en fetchPerfil:', err); // Para debugging
			
			// Si es un error de autenticación (token expirado), redirigir al login
			if (errorMessage.includes('token') || 
			    errorMessage.includes('autenticación') || 
			    errorMessage.includes('sesión') ||
			    errorMessage.includes('Sesión expirada')) {
				await authStore.logout();
				if (typeof window !== 'undefined') {
					goto('/login');
				}
			}
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

			// Mapear el perfil a formato de API
			const request = this.mapPerfilEmpresarialToApiRequest(perfil);
			
			console.log('Enviando actualización al API:', request); // Para debugging

			// Llamar al API real para actualizar
			await apiService.put<void>(
				API_ENDPOINTS.company.updateCompanyDetails,
				request
			);

			// Si la actualización fue exitosa, actualizar el estado local
			this.state.perfil = perfil;
			this.state.completitud = this.calcularCompletitud(perfil);

			console.log('Perfil actualizado exitosamente'); // Para debugging

			return true;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Error al guardar el perfil';
			this.state.error = errorMessage;
			
			console.error('Error en savePerfil:', err); // Para debugging
			
			// Si es un error de autenticación, redirigir al login
			if (errorMessage.includes('token') || 
			    errorMessage.includes('autenticación') || 
			    errorMessage.includes('sesión') ||
			    errorMessage.includes('Sesión expirada')) {
				await authStore.logout();
				if (typeof window !== 'undefined') {
					goto('/login');
				}
			}
			
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
	// Convierte el archivo a Base64 para enviarlo al backend
	async uploadFile(file: File): Promise<string | null> {
		try {
			// Convertir archivo a Base64
			const base64String = await this.fileToBase64(file);
			
			// Retornar solo el Base64 sin el prefijo data:image/...
			// El backend espera solo el string Base64 puro
			const base64WithoutPrefix = base64String.split(',')[1] || base64String;
			
			console.log('Archivo convertido a Base64:', {
				fileName: file.name,
				fileSize: file.size,
				base64Length: base64WithoutPrefix.length
			});
			
			return base64WithoutPrefix;
		} catch (err) {
			this.state.error = 'Error al procesar el archivo';
			console.error('Error en uploadFile:', err);
			return null;
		}
	}

	// Convertir File a Base64
	private fileToBase64(file: File): Promise<string> {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			
			reader.onload = () => {
				if (typeof reader.result === 'string') {
					resolve(reader.result);
				} else {
					reject(new Error('Error al leer el archivo'));
				}
			};
			
			reader.onerror = () => {
				reject(new Error('Error al leer el archivo'));
			};
			
			reader.readAsDataURL(file);
		});
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