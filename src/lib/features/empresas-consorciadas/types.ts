// src/lib/features/empresas-consorciadas/types/index.ts

export interface EmpresaConsorciada {
	id: number;
	ruc: string;
	razonSocial: string;
	nombreComercial?: string;
	porcentajeParticipacion: number;
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
	esLider: boolean;
	fechaRegistro: string;
}

export interface EmpresaConsorciadaFormData {
	ruc: string;
	razonSocial: string;
	nombreComercial?: string;
	porcentajeParticipacion: number;
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
	esLider: boolean;
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
	porcentajeTotal: number;
}

export interface ConsorcioResumen {
	totalEmpresas: number;
	porcentajeTotal: number;
	empresaLider: EmpresaConsorciada | null;
	esValido: boolean;
}