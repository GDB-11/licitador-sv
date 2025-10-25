// src/lib/config/api.config.ts

/**
 * Configuración central de la API
 * Cambiar aquí la base URL para todos los entornos
 */

// Base URL del backend - cambiar según el entorno
export const API_BASE_URL: string = getEnvVariable("VITE_API_BASE_URL");

// Endpoints de la API
export const API_ENDPOINTS = {
	auth: {
		login: '/api/auth/login',
		refresh: '/api/auth/refresh',
		logout: '/api/auth/logout'
	},
	company: {
		myCompany: '/api/Company/my-company',
		myCompanyDetails: (companyId: string) => `/api/Company/my-company-details/${companyId}`,
		updateCompanyDetails: '/api/Company/update-company-details'
	},
	perfil: {
		empresarial: '/api/perfil-empresarial',
		representante: '/api/perfil-empresarial/representante',
		datosBancarios: '/api/perfil-empresarial/datos-bancarios'
	},
	empresas: {
		consorciadas: '/api/empresas-consorciadas',
		byId: (id: string) => `/api/empresas-consorciadas/${id}`
	},
	documentos: {
		generar: '/api/documentos/generar',
		listar: '/api/documentos',
		descargar: (id: string) => `/api/documentos/${id}/descargar`
	},
	document: {
		generateAnnexes: '/api/Document/generate-annexes',
		recent: '/api/Document/recent',
		delete: (id: string) => `/api/Document/${id}`
	}
} as const;

// Configuración de timeouts
export const API_TIMEOUT = 30000; // 30 segundos

// Storage keys
export const STORAGE_KEYS = {
	accessToken: 'auth_token',
	refreshToken: 'refresh_token',
	tokenExpiry: 'token_expiry'
} as const;

function getEnvVariable(name: string): string {
	const value = import.meta.env[name];
	if (!value) {
		throw new Error(`${name} is not defined in the environment variables.`);
	}
	return value;
}