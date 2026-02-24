// src/lib/features/anexos-consorcio/stores/wizard-anexos-consorcio.svelte.ts

import type {
	WizardConsorcioState,
	EstadoWizardConsorcio,
	ConfiguracionConsorcio,
	Anexo1ConsorcioData,
	Anexo2ConsorcioData,
	Anexo3ConsorcioData,
	DocumentoConsorcioGenerado,
	EmpresaConsorciadaSeleccionable,
	GenerateAnnexesConsortiumRequest
} from '../types';
import { API_BASE_URL, API_ENDPOINTS, STORAGE_KEYS } from '$lib/config/api.config';
import type { CompanyDetailsResponse } from '$lib/features/perfil-empresarial/types';
import { apiService } from '$lib/services/api.service';

const PASOS: EstadoWizardConsorcio[] = ['configuracion', 'anexo1', 'anexo2', 'anexo3', 'resumen'];

class WizardAnexosConsorcioStore {
	private state = $state<WizardConsorcioState>({
		pasoActual: 'configuracion',
		configuracion: null,
		anexo1: null,
		anexo2: null,
		anexo3: null,
		isLoading: false,
		error: null,
		validationErrors: {}
	});

	private companyData = $state<CompanyDetailsResponse | null>(null);
	private empresasConsorciadas = $state<EmpresaConsorciadaSeleccionable[]>([]);

	// ─── Getters ───────────────────────────────────────────────────────────────

	get pasoActual() { return this.state.pasoActual; }
	get configuracion() { return this.state.configuracion; }
	get anexo1() { return this.state.anexo1; }
	get anexo2() { return this.state.anexo2; }
	get anexo3() { return this.state.anexo3; }
	get isLoading() { return this.state.isLoading; }
	get error() { return this.state.error; }
	get validationErrors() { return this.state.validationErrors; }
	get companyDetails() { return this.companyData; }
	get empresasDisponibles() { return this.empresasConsorciadas; }

	get progresoTotal() {
		const idx = PASOS.indexOf(this.state.pasoActual);
		return ((idx + 1) / PASOS.length) * 100;
	}

	get puedeAvanzar() {
		switch (this.state.pasoActual) {
			case 'configuracion': return this.state.configuracion !== null;
			case 'anexo1': return this.state.anexo1 !== null;
			case 'anexo2': return this.state.anexo2 !== null;
			case 'anexo3': return this.state.anexo3 !== null;
			default: return false;
		}
	}

	// ─── Navegación ────────────────────────────────────────────────────────────

	irAPaso(paso: EstadoWizardConsorcio) {
		this.state.pasoActual = paso;
		this.state.error = null;
		this.state.validationErrors = {};
	}

	siguiente() {
		const idx = PASOS.indexOf(this.state.pasoActual);
		if (idx < PASOS.length - 1) this.state.pasoActual = PASOS[idx + 1];
	}

	anterior() {
		const idx = PASOS.indexOf(this.state.pasoActual);
		if (idx > 0) this.state.pasoActual = PASOS[idx - 1];
	}

	// ─── Carga de datos iniciales ─────────────────────────────────────────────

	async fetchDatosIniciales(companyId: string): Promise<void> {
		if (this.companyData && this.empresasConsorciadas.length > 0) return;

		this.state.isLoading = true;
		this.state.error = null;

		try {
			const [companyDetails, consortiumListRaw] = await Promise.all([
				apiService.get<CompanyDetailsResponse>(
					API_ENDPOINTS.company.myCompanyDetails(companyId)
				),
				apiService
					.get<{ companies?: Record<string, unknown>[] }>(
						API_ENDPOINTS.consortium.list(companyId)
					)
					.catch(() => ({ companies: [] }))
			]);

			this.companyData = companyDetails;

			this.empresasConsorciadas = (consortiumListRaw.companies ?? [])
				.filter((c) => (c as Record<string, unknown>)['activo'] !== false)
				.map((c) => {
					const raw = c as Record<string, unknown>;
					const rep = (raw['legalRepresentative'] as Record<string, unknown>) ?? {};
					return {
						consortiumCompanyId: String(raw['consortiumCompanyId'] ?? raw['id'] ?? ''),
						razonSocial: String(raw['razonSocial'] ?? ''),
						ruc: String(raw['ruc'] ?? ''),
						representanteLegal: {
							nombresCompletos: String(rep['fullName'] ?? ''),
							dni: String(rep['documentNumber'] ?? ''),
							cargo: String(rep['position'] ?? 'Representante Legal')
						}
					} satisfies EmpresaConsorciadaSeleccionable;
				});

			if (!this.state.anexo1) {
				this.state.anexo1 = {
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
					representanteLegal: companyDetails.legalRepresentative?.fullName || '',
					dniRepresentante: companyDetails.legalRepresentative?.documentNumber || '',
					cargoRepresentante: 'Representante Legal',
					fecha: new Date().toISOString().split('T')[0],
					aceptaCompromisos: true
				};
			}

			if (!this.state.anexo3) {
				this.state.anexo3 = {
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
			this.state.error = err instanceof Error ? err.message : 'Error al cargar datos';
			console.error('WizardAnexosConsorcioStore.fetchDatosIniciales:', err);
		} finally {
			this.state.isLoading = false;
		}
	}

	// ─── Guardar pasos ─────────────────────────────────────────────────────────

	guardarConfiguracion(config: ConfiguracionConsorcio) {
		this.state.configuracion = config;
		this.state.validationErrors = {};
	}

	guardarAnexo1(data: Anexo1ConsorcioData) {
		this.state.anexo1 = data;
		this.state.validationErrors = {};
	}

	guardarAnexo2(data: Anexo2ConsorcioData) {
		this.state.anexo2 = data;
		this.state.validationErrors = {};
	}

	guardarAnexo3(data: Anexo3ConsorcioData) {
		this.state.anexo3 = data;
		this.state.validationErrors = {};
	}

	// ─── Validación ────────────────────────────────────────────────────────────

	validarDatos(): boolean {
		const errores: Record<string, string> = {};
		if (!this.state.configuracion) errores.configuracion = 'Debe completar la configuración';
		if (!this.state.anexo1) errores.anexo1 = 'Debe completar el Anexo 1';
		if (!this.state.anexo2) errores.anexo2 = 'Debe completar el Anexo 2';
		if (!this.state.anexo3) errores.anexo3 = 'Debe completar el Anexo 3';
		this.state.validationErrors = errores;
		return Object.keys(errores).length === 0;
	}

	// ─── Generar documentos ────────────────────────────────────────────────────

	async generarDocumentos(): Promise<DocumentoConsorcioGenerado[]> {
		this.state.isLoading = true;
		this.state.error = null;

		try {
			const token = localStorage.getItem(STORAGE_KEYS.accessToken);
			if (!token) throw new Error('No se encontró el token de autenticación');

			const cfg = this.state.configuracion!;
			const a1 = this.state.anexo1!;
			const a3 = this.state.anexo3!;

			const liderMiembro = cfg.miembros.find((m) => m.esLider);
			const isOwnCompanyLeader = liderMiembro?.esEmpresaPropia ?? false;
			const leaderConsortiumCompanyId = isOwnCompanyLeader
				? null
				: (liderMiembro?.consortiumCompanyId ?? null);

			const payload: GenerateAnnexesConsortiumRequest = {
				licitacionNumber: cfg.numeroProceso,
				numeroFicha: cfg.numeroFicha,
				numeroAsiento: cfg.numeroAsiento,
				entityName: cfg.entidad,
				purchaseObject: cfg.objeto,
				city: cfg.ciudad,
				consortiumName: cfg.nombreConsorcio,
				isOwnCompanyLeader,
				leaderConsortiumCompanyId,
				members: cfg.miembros.map((m) => ({
					consortiumCompanyId: m.esEmpresaPropia ? null : m.consortiumCompanyId,
					esEmpresaPropia: m.esEmpresaPropia,
					porcentajeParticipacion: m.porcentajeParticipacion
				})),
				autorizaNotificacionesEmail: a1.autorizaNotificacionesEmail,
				emailNotificaciones: a1.autorizaNotificacionesEmail ? a1.emailNotificaciones : null
			};

			const response = await fetch(
				`${API_BASE_URL}${API_ENDPOINTS.document.generateAnnexesConsortium}`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`
					},
					body: JSON.stringify(payload)
				}
			);

			if (!response.ok) {
				const errorData = await response.json().catch(() => null);
				throw new Error(
					errorData?.error ||
						errorData?.message ||
						`Error ${response.status}: No se pudo generar el documento`
				);
			}

			const contentDisposition = response.headers.get('Content-Disposition');
			const filenameMatch = contentDisposition?.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
			const filename =
				filenameMatch?.[1]?.replace(/['"]/g, '') ||
				`Anexos_Consorcio_${cfg.nombreConsorcio}_${cfg.numeroProceso}_${new Date()
					.toISOString()
					.split('T')[0]}.docx`;

			const blob = await response.blob();
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = filename;
			document.body.appendChild(a);
			a.click();
			setTimeout(() => {
				window.URL.revokeObjectURL(url);
				document.body.removeChild(a);
			}, 100);

			return [
				{
					tipo: 'consorcio',
					titulo: `Anexos Consorcio ${cfg.nombreConsorcio} - ${cfg.numeroProceso}`,
					url,
					fechaGeneracion: new Date().toISOString()
				}
			];
		} catch (err) {
			this.state.error = err instanceof Error ? err.message : 'Error al generar documentos';
			throw err;
		} finally {
			this.state.isLoading = false;
		}
	}

	// ─── Reiniciar ─────────────────────────────────────────────────────────────

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

export const wizardConsorcioStore = new WizardAnexosConsorcioStore();