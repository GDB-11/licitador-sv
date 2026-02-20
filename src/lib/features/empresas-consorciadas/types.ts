// src/lib/features/empresas-consorciadas/types.ts

export interface ApiRepresentanteLegal {
	consortiumLegalRepresentativeId: string | null;
	consortiumCompanyId: string | null;
	dni: string | null;
	fullName: string | null;
	position: string | null;
	isActive: boolean | null;
	createdDate?: string;
	updatedDate?: string;
}

export interface ApiEmpresaConsorciada {
	consortiumCompanyId: string;
	companyId: string;
	ruc: string;
	rnpRegistration: string | null;
	razonSocial: string;
	nombreComercial: string | null;
	rnpValidUntil: string | null;
	mainActivity: string | null;
	domicilioFiscal: string;
	contactPhone: string | null;
	contactEmail: string | null;
	isActive: boolean;
	createdDate?: string;
	updatedDate?: string;
	legalRepresentative: ApiRepresentanteLegal;
}

export interface ApiListResponse {
	companies: ApiEmpresaConsorciada[];
}

export interface ApiSingleResponse {
	company: ApiEmpresaConsorciada;
}

// ─── Modelo interno del frontend ─────────────────────────────────────────────

export interface RepresentanteLegalConsorciada {
	consortiumLegalRepresentativeId: string | null;
	dni: string;
	nombresCompletos: string;
	cargo: string;
}

export interface EmpresaConsorciada {
	consortiumCompanyId: string;
	companyId: string;
	ruc: string;
	razonSocial: string;
	nombreComercial: string;
	domicilioFiscal: string;
	representanteLegal: RepresentanteLegalConsorciada;
	contacto: {
		telefono: string;
		correoElectronico: string;
	};
	actividadPrincipal: string;
	registroRNP: string;
	vigenciaRNPHasta: string;
	activo: boolean;
	fechaRegistro?: string;
	fechaActualizacion?: string;
}

export interface EmpresaConsorciadaFormData {
	ruc: string;
	razonSocial: string;
	nombreComercial: string;
	domicilioFiscal: string;
	representanteLegal: {
		consortiumLegalRepresentativeId?: string | null;
		dni: string;
		nombresCompletos: string;
		cargo: string;
	};
	contacto: {
		telefono: string;
		correoElectronico: string;
	};
	actividadPrincipal: string;
	registroRNP: string;
	vigenciaRNPHasta: string;
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

export interface ValidationErrors {
	[key: string]: string | undefined;
}

export interface EmpresasResumen {
	totalEmpresas: number;
	empresasActivas: number;
	empresasInactivas: number;
	empresasConRNPVigente: number;
}

// ─── Mapeadores API ↔ Frontend ────────────────────────────────────────────────

export function mapApiToEmpresa(api: ApiEmpresaConsorciada): EmpresaConsorciada {
	return {
		consortiumCompanyId: api.consortiumCompanyId,
		companyId: api.companyId,
		ruc: api.ruc,
		razonSocial: api.razonSocial,
		nombreComercial: api.nombreComercial ?? '',
		domicilioFiscal: api.domicilioFiscal,
		representanteLegal: {
			consortiumLegalRepresentativeId: api.legalRepresentative?.consortiumLegalRepresentativeId ?? null,
			dni: api.legalRepresentative?.dni ?? '',
			nombresCompletos: api.legalRepresentative?.fullName ?? '',
			cargo: api.legalRepresentative?.position ?? ''
		},
		contacto: {
			telefono: api.contactPhone ?? '',
			correoElectronico: api.contactEmail ?? ''
		},
		actividadPrincipal: api.mainActivity ?? '',
		registroRNP: api.rnpRegistration ?? '',
		vigenciaRNPHasta: api.rnpValidUntil ?? '',
		activo: api.isActive,
		fechaRegistro: api.createdDate,
		fechaActualizacion: api.updatedDate
	};
}