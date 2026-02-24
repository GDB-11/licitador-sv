// src/lib/features/anexos-consorcio/types.ts

// ─── Pasos del wizard ─────────────────────────────────────────────────────────

export type EstadoWizardConsorcio =
	| 'configuracion'
	| 'anexo1'
	| 'anexo2'
	| 'anexo3'
	| 'resumen';

// ─── Configuración del consorcio ──────────────────────────────────────────────

export interface EmpresaConsorciadaSeleccionable {
	consortiumCompanyId: string;
	razonSocial: string;
	ruc: string;
	representanteLegal: {
		nombresCompletos: string;
		dni: string;
		cargo: string;
	};
}

/** Miembro del consorcio ya seleccionado con porcentaje de participación */
export interface MiembroConsorcioSeleccionado {
	consortiumCompanyId: string; // 'propia' = empresa del usuario
	razonSocial: string;
	ruc: string;
	esLider: boolean;
	esEmpresaPropia: boolean;
	porcentajeParticipacion: number; // entero 1-99; suma de todos = 100
}

export interface ConfiguracionConsorcio {
	numeroProceso: string;
	numeroFicha: string;
	numeroAsiento: string;
	entidad: string;
	objeto: string;
	ciudad: string;
	nombreConsorcio: string;
	miembros: MiembroConsorcioSeleccionado[];
}

// ─── Datos de cada anexo ──────────────────────────────────────────────────────

export interface Anexo1ConsorcioData {
	razonSocial: string;
	ruc: string;
	domicilioLegal: string;
	telefono: string;
	correoElectronico: string;
	representanteLegal: string;
	dniRepresentante: string;
	autorizaNotificacionesEmail: boolean;
	emailNotificaciones: string;
}

export interface Anexo2ConsorcioData {
	representanteLegal: string;
	dniRepresentante: string;
	cargoRepresentante: string;
	fecha: string;
	aceptaCompromisos: boolean;
}

export interface Anexo3ConsorcioData {
	representanteLegal: string;
	dniRepresentante: string;
	declaraciones: {
		noTieneImpedimentos: boolean;
		conoceSanciones: boolean;
		asumeResponsabilidad: boolean;
	};
	fecha: string;
}

// ─── Documento generado ───────────────────────────────────────────────────────

export interface DocumentoConsorcioGenerado {
	tipo: string;
	titulo: string;
	url: string;
	fechaGeneracion: string;
}

// ─── Estado del wizard ────────────────────────────────────────────────────────

export interface WizardConsorcioState {
	pasoActual: EstadoWizardConsorcio;
	configuracion: ConfiguracionConsorcio | null;
	anexo1: Anexo1ConsorcioData | null;
	anexo2: Anexo2ConsorcioData | null;
	anexo3: Anexo3ConsorcioData | null;
	isLoading: boolean;
	error: string | null;
	validationErrors: Record<string, string>;
}

// ─── Payload de la API ────────────────────────────────────────────────────────

export interface ConsorcioBroMiembro {
	consortiumCompanyId: string | null; // null = empresa propia
	esEmpresaPropia: boolean;
	porcentajeParticipacion: number;
}

export interface GenerateAnnexesConsortiumRequest {
	licitacionNumber: string;
	numeroFicha: string;
	numeroAsiento: string;
	entityName: string;
	purchaseObject: string;
	city: string;
	consortiumName: string;
	isOwnCompanyLeader: boolean;
	leaderConsortiumCompanyId: string | null;
	members: ConsorcioBroMiembro[];
	autorizaNotificacionesEmail: boolean;
	emailNotificaciones: string | null;
}