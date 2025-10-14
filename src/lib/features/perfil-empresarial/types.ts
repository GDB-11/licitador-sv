// src/lib/features/perfil-empresarial/types.ts

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