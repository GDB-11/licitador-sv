// src/lib/features/empresas-consorciadas/types/index.ts

export interface EmpresaConsorciada {
	id: number;
	ruc: string;
	razonSocial: string;
	nombreComercial?: string;
	domicilioFiscal: string;
	representanteLegal: {
		dni: string;
		nombresCompletos: string;
		cargo: string;
	};
	contacto: {
		telefono: string;
		correoElectronico: string;
	};
	// Datos adicionales útiles
	actividadPrincipal?: string;
	registroRNP?: string; // Registro Nacional de Proveedores
	vigenciaRNPHasta?: string;
	fechaRegistro: string;
	fechaActualizacion?: string;
	activo: boolean;
}

export interface EmpresaConsorciadaFormData {
	ruc: string;
	razonSocial: string;
	nombreComercial?: string;
	domicilioFiscal: string;
	representanteLegal: {
		dni: string;
		nombresCompletos: string;
		cargo: string;
	};
	contacto: {
		telefono: string;
		correoElectronico: string;
	};
	actividadPrincipal?: string;
	registroRNP?: string;
	vigenciaRNPHasta?: string;
	activo: boolean;
}

export interface ValidationErrors {
	[key: string]: string;
}

export interface EmpresasConsorciadasState {
	empresas: EmpresaConsorciada[];
	empresaSeleccionada: EmpresaConsorciada | null;
	isLoading: boolean;
	isSaving: boolean;
	error: string | null;
	validationErrors: ValidationErrors;
	filtroActivas: boolean;
}

export interface EmpresasResumen {
	totalEmpresas: number;
	empresasActivas: number;
	empresasInactivas: number;
	empresasConRNPVigente: number;
}