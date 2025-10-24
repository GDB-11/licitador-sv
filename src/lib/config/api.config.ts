// src/lib/config/api.config.ts

/**
 * Configuración central de la API
 * Cambiar aquí la base URL para todos los entornos
 */

// Base URL del backend - cambiar según el entorno
export const API_BASE_URL = 'http://localhost:5182';
//export const API_BASE_URL = 'http://localhost:5182';//import.meta.env.VITE_API_BASE_URL || 'http://localhost:5182';

// Endpoints de la API
export const API_ENDPOINTS = {
	auth: {
		login: '/api/auth/login',
		refresh: '/api/auth/refresh',
		logout: '/api/auth/logout'
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