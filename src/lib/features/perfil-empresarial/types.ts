// src/lib/features/perfil-empresarial/types.ts

// API Response Types (matching backend DTOs)
// Campos opcionales para manejar perfiles incompletos
export interface CompanyDetailsResponse {
	companyId: string;
	ruc: string;
	razonSocial: string;
	domicilioLegal: string;
	telefono: string | null;
	email: string;
	fechaConstitucion: string | null;
	isMype: boolean;
	legalRepresentative?: LegalRepresentativeResponse | null;
	bankAccount?: BankAccountResponse | null;
}

export interface LegalRepresentativeResponse {
	legalRepresentativeId: string;
	fullName: string;
	documentType: string;
	documentNumber: string;
	nationalIdImage: string | null; // Base64 string
}

export interface BankAccountResponse {
	bankAccountId: string;
	bankName: string;
	accountNumber: string;
	cciCode: string;
}

// PUT Request Types (for updating company details)
export interface UpdateCompanyDetailsRequest {
	companyId: string;
	ruc: string;
	razonSocial: string;
	domicilioLegal: string;
	telefono: string | null;
	email: string;
	fechaConstitucion: string | null;
	isMype: boolean;
	legalRepresentative?: UpdateLegalRepresentativeRequest | null;
	bankAccount?: UpdateBankAccountRequest | null;
}

export interface UpdateLegalRepresentativeRequest {
	fullName: string;
	documentType: string;
	documentNumber: string;
	nationalIdImage?: string | null; // Base64 string (optional for update)
}

export interface UpdateBankAccountRequest {
	bankName: string;
	accountNumber: string;
	cciCode: string;
}

// Frontend Types (for forms and UI)
export interface DatosGenerales {
	ruc: string;
	razonSocial: string;
	nombreComercial: string;
	domicilioLegal: string;
	telefono: string;
	correoElectronico: string;
	fechaConstitucion: string;
	condicionMYPE: boolean;
}

export interface RepresentanteLegal {
	dni: string;
	nombresCompletos: string;
	copiaDNI?: string; // URL del archivo o base64
}

export interface DatosBancarios {
	cci: string;
	banco: string;
	numeroCuenta: string;
}

export interface PerfilEmpresarial {
	datosGenerales: DatosGenerales;
	representanteLegal: RepresentanteLegal;
	datosBancarios: DatosBancarios;
}

export interface ValidationErrors {
	[key: string]: string | undefined;
}

export interface PerfilEmpresarialState {
	perfil: PerfilEmpresarial | null;
	isLoading: boolean;
	isSaving: boolean;
	error: string | null;
	validationErrors: ValidationErrors;
	completitud: number;
}