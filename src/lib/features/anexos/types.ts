// src/lib/features/anexos/types.ts

export type TipoParticipacion = 'individual' | 'consorcio';
export type EstadoWizard = 'configuracion' | 'anexo1' | 'anexo2' | 'anexo3' | 'resumen';

// Configuración inicial del wizard
export interface ConfiguracionAnexos {
	tipoParticipacion: TipoParticipacion;
	numeroProceso: string;
	entidad: string;
	objeto: string;
	ciudad: string;
}

// Datos del consorcio
export interface MiembroConsorcio {
	empresaId: number;
	nombreEmpresa: string;
	ruc: string;
	esLider: boolean;
	porcentajeParticipacion: number;
}

// Anexo 1: Declaración Jurada de Datos del Postor
export interface Anexo1Data {
	tipoParticipacion: TipoParticipacion;
	// Datos para participación individual
	razonSocial?: string;
	ruc?: string;
	domicilioLegal?: string;
	telefono?: string;
	correoElectronico?: string;
	representanteLegal?: string;
	dniRepresentante?: string;
	// Datos para consorcio
	nombreConsorcio?: string;
	miembros?: MiembroConsorcio[];
	// Autorización de notificaciones
	autorizaNotificacionesEmail: boolean;
	emailNotificaciones: string;
}

// Anexo 2: Pacto de Integridad
export interface Anexo2Data {
	nombreEmpresa: string;
	rucEmpresa: string;
	representanteLegal: string;
	dniRepresentante: string;
	cargoRepresentante: string;
	fecha: string;
	aceptaCompromisos: boolean;
}

// Anexo 3: Declaración Jurada de Impedimentos
export interface Anexo3Data {
	nombreEmpresa: string;
	rucEmpresa: string;
	representanteLegal: string;
	dniRepresentante: string;
	declaraciones: {
		noTieneImpedimentos: boolean;
		conoceSanciones: boolean;
		asumeResponsabilidad: boolean;
	};
	fecha: string;
}

// Estado completo del wizard
export interface WizardAnexosState {
	pasoActual: EstadoWizard;
	configuracion: ConfiguracionAnexos | null;
	anexo1: Anexo1Data | null;
	anexo2: Anexo2Data | null;
	anexo3: Anexo3Data | null;
	isLoading: boolean;
	error: string | null;
	validationErrors: Record<string, string>;
}

// Resultado de generación de documentos
export interface DocumentoGenerado {
	tipo: 'anexo1' | 'anexo2' | 'anexo3';
	titulo: string;
	url: string;
	fechaGeneracion: string;
}

// Empresa disponible para consorcio
export interface EmpresaConsorcio {
	id: number;
	razonSocial: string;
	ruc: string;
	email: string;
	telefono: string;
}