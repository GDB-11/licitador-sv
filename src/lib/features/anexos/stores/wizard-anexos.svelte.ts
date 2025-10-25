// src/lib/features/anexos/stores/wizard-anexos.svelte.ts

import type {
	WizardAnexosState,
	EstadoWizard,
	ConfiguracionAnexos,
	Anexo1Data,
	Anexo2Data,
	Anexo3Data,
	DocumentoGenerado,
	EmpresaConsorcio
} from '../types';
import { API_BASE_URL, API_ENDPOINTS, STORAGE_KEYS } from '$lib/config/api.config';
import type { CompanyDetailsResponse } from '$lib/features/perfil-empresarial/types';
import { apiService } from '$lib/services/api.service';

class WizardAnexosStore {
	private state = $state<WizardAnexosState>({
		pasoActual: 'configuracion',
		configuracion: null,
		anexo1: null,
		anexo2: null,
		anexo3: null,
		isLoading: false,
		error: null,
		validationErrors: {}
	});

	// Company data for auto-population
	private companyData = $state<CompanyDetailsResponse | null>(null);

	// Getters reactivos
	get pasoActual() {
		return this.state.pasoActual;
	}

	get configuracion() {
		return this.state.configuracion;
	}

	get anexo1() {
		return this.state.anexo1;
	}

	get anexo2() {
		return this.state.anexo2;
	}

	get anexo3() {
		return this.state.anexo3;
	}

	get isLoading() {
		return this.state.isLoading;
	}

	get error() {
		return this.state.error;
	}

	get validationErrors() {
		return this.state.validationErrors;
	}

	get companyDetails() {
		return this.companyData;
	}

	get progresoTotal() {
		const pasos: EstadoWizard[] = ['configuracion', 'anexo1', 'anexo2', 'anexo3', 'resumen'];
		const indiceActual = pasos.indexOf(this.state.pasoActual);
		return ((indiceActual + 1) / pasos.length) * 100;
	}

	get puedeAvanzar() {
		switch (this.state.pasoActual) {
			case 'configuracion':
				return this.state.configuracion !== null;
			case 'anexo1':
				return this.state.anexo1 !== null;
			case 'anexo2':
				return this.state.anexo2 !== null;
			case 'anexo3':
				return this.state.anexo3 !== null;
			default:
				return false;
		}
	}

	// Navegación
	irAPaso(paso: EstadoWizard) {
		this.state.pasoActual = paso;
		this.state.error = null;
		this.state.validationErrors = {};
	}

	siguiente() {
		const pasos: EstadoWizard[] = ['configuracion', 'anexo1', 'anexo2', 'anexo3', 'resumen'];
		const indiceActual = pasos.indexOf(this.state.pasoActual);
		if (indiceActual < pasos.length - 1) {
			this.state.pasoActual = pasos[indiceActual + 1];
		}
	}

	anterior() {
		const pasos: EstadoWizard[] = ['configuracion', 'anexo1', 'anexo2', 'anexo3', 'resumen'];
		const indiceActual = pasos.indexOf(this.state.pasoActual);
		if (indiceActual > 0) {
			this.state.pasoActual = pasos[indiceActual - 1];
		}
	}

	// Fetch company data for auto-population
	async fetchCompanyData(): Promise<void> {
		if (this.companyData) return; // Already loaded

		this.state.isLoading = true;
		this.state.error = null;

		try {
			const token = localStorage.getItem(STORAGE_KEYS.accessToken);
			if (!token) {
				throw new Error('No se encontró el token de autenticación');
			}

			// Get company ID from token or fetch company first
			const companyResponse = await apiService.get<{ companyId: string; ruc: string; razonSocial: string }>(
				API_ENDPOINTS.company.myCompany
			);

			// Fetch full company details
			const companyDetails = await apiService.get<CompanyDetailsResponse>(
				API_ENDPOINTS.company.myCompanyDetails(companyResponse.companyId)
			);

			this.companyData = companyDetails;

			// Auto-populate Anexo 1, 2, and 3 with company data
			if (!this.state.anexo1) {
				this.state.anexo1 = {
					tipoParticipacion: 'individual',
					razonSocial: companyDetails.razonSocial,
					ruc: companyDetails.ruc,
					domicilioLegal: companyDetails.domicilioLegal,
					telefono: companyDetails.telefono || '',
					correoElectronico: companyDetails.email,
					representanteLegal: companyDetails.legalRepresentative?.fullName || '',
					dniRepresentante: companyDetails.legalRepresentative?.documentNumber || '',
					autorizaNotificacionesEmail: false,
					emailNotificaciones: ''
				};
			}

			if (!this.state.anexo2) {
				this.state.anexo2 = {
					nombreEmpresa: companyDetails.razonSocial,
					rucEmpresa: companyDetails.ruc,
					representanteLegal: companyDetails.legalRepresentative?.fullName || '',
					dniRepresentante: companyDetails.legalRepresentative?.documentNumber || '',
					cargoRepresentante: 'Representante Legal',
					fecha: new Date().toISOString().split('T')[0],
					aceptaCompromisos: true
				};
			}

			if (!this.state.anexo3) {
				this.state.anexo3 = {
					nombreEmpresa: companyDetails.razonSocial,
					rucEmpresa: companyDetails.ruc,
					representanteLegal: companyDetails.legalRepresentative?.fullName || '',
					dniRepresentante: companyDetails.legalRepresentative?.documentNumber || '',
					declaraciones: {
						noTieneImpedimentos: true,
						conoceSanciones: true,
						asumeResponsabilidad: true
					},
					fecha: new Date().toISOString().split('T')[0]
				};
			}
		} catch (err) {
			this.state.error = err instanceof Error ? err.message : 'Error al cargar datos de la empresa';
			console.error('Error fetching company data:', err);
		} finally {
			this.state.isLoading = false;
		}
	}

	// Guardar datos de cada paso
	guardarConfiguracion(config: ConfiguracionAnexos) {
		this.state.configuracion = config;
		this.state.validationErrors = {};
	}

	guardarAnexo1(data: Anexo1Data) {
		this.state.anexo1 = data;
		this.state.validationErrors = {};
	}

	guardarAnexo2(data: Anexo2Data) {
		this.state.anexo2 = data;
		this.state.validationErrors = {};
	}

	guardarAnexo3(data: Anexo3Data) {
		this.state.anexo3 = data;
		this.state.validationErrors = {};
	}

	// Obtener empresas disponibles para consorcio (API simulada)
	async obtenerEmpresasConsorcio(): Promise<EmpresaConsorcio[]> {
		this.state.isLoading = true;
		this.state.error = null;

		try {
			// TODO: Reemplazar con llamada real a la API
			// const response = await fetch('/api/empresas/consorcio');
			// const data = await response.json();

			// Simulación
			await new Promise((resolve) => setTimeout(resolve, 500));

			return [
				{
					id: 1,
					razonSocial: 'CONSTRUCTORA ANDINA S.A.C.',
					ruc: '20543212345',
					email: 'contacto@andina.pe',
					telefono: '01-4567890'
				},
				{
					id: 2,
					razonSocial: 'INGENIEROS UNIDOS S.R.L.',
					ruc: '20543298765',
					email: 'info@ingenierosunidos.pe',
					telefono: '01-9876543'
				},
				{
					id: 3,
					razonSocial: 'OBRAS CIVILES DEL SUR E.I.R.L.',
					ruc: '20543245678',
					email: 'ventas@obrasciviles.pe',
					telefono: '054-234567'
				}
			];
		} catch (err) {
			this.state.error = err instanceof Error ? err.message : 'Error al cargar empresas';
			return [];
		} finally {
			this.state.isLoading = false;
		}
	}

	// Generar documentos (API real)
	async generarDocumentos(): Promise<DocumentoGenerado[]> {
		this.state.isLoading = true;
		this.state.error = null;

		try {
			// Get token from storage
			const token = localStorage.getItem(STORAGE_KEYS.accessToken);
			if (!token) {
				throw new Error('No se encontró el token de autenticación');
			}

			// Build minimal payload
			const payload = {
				licitacionNumber: this.state.configuracion?.numeroProceso || '',
				entityName: this.state.configuracion?.entidad || '',
				purchaseObject: this.state.configuracion?.objeto || '',
				city: this.state.configuracion?.ciudad || '',
				autorizaNotificacionesEmail: this.state.anexo1?.autorizaNotificacionesEmail || false,
				emailNotificaciones: this.state.anexo1?.emailNotificaciones || null
			};

			// Call API
			const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.document.generateAnnexes}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`
				},
				body: JSON.stringify(payload)
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => null);
				throw new Error(errorData?.error || errorData?.message || `Error ${response.status}: No se pudo generar el documento`);
			}

			// Get filename from Content-Disposition header
			const contentDisposition = response.headers.get('Content-Disposition');
			const filenameMatch = contentDisposition?.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
			const filename = filenameMatch?.[1]?.replace(/['"]/g, '') || `Anexos_${payload.licitacionNumber}_${new Date().toISOString().split('T')[0]}.docx`;

			// Download file
			const blob = await response.blob();
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = filename;
			document.body.appendChild(a);
			a.click();
			
			// Cleanup
			setTimeout(() => {
				window.URL.revokeObjectURL(url);
				document.body.removeChild(a);
			}, 100);

			// Return document info for UI display
			const fechaActual = new Date().toISOString();
			return [
				{
					tipo: 'anexo1',
					titulo: `Anexos Consolidados - ${payload.licitacionNumber}`,
					url: url,
					fechaGeneracion: fechaActual
				}
			];
		} catch (err) {
			this.state.error = err instanceof Error ? err.message : 'Error al generar documentos';
			throw err;
		} finally {
			this.state.isLoading = false;
		}
	}

	// Validar datos antes de generar
	validarDatos(): boolean {
		const errores: Record<string, string> = {};

		if (!this.state.configuracion) {
			errores.configuracion = 'Debe completar la configuración inicial';
		}

		if (!this.state.anexo1) {
			errores.anexo1 = 'Debe completar el Anexo 1';
		}

		if (!this.state.anexo2) {
			errores.anexo2 = 'Debe completar el Anexo 2';
		}

		if (!this.state.anexo3) {
			errores.anexo3 = 'Debe completar el Anexo 3';
		}

		this.state.validationErrors = errores;
		return Object.keys(errores).length === 0;
	}

	// Reiniciar wizard
	reiniciar() {
		this.state = {
			pasoActual: 'configuracion',
			configuracion: null,
			anexo1: null,
			anexo2: null,
			anexo3: null,
			isLoading: false,
			error: null,
			validationErrors: {}
		};
	}
}

export const wizardAnexosStore = new WizardAnexosStore();