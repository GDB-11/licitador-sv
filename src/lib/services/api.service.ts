// src/lib/services/api.service.ts

import { API_BASE_URL, API_ENDPOINTS, API_TIMEOUT, STORAGE_KEYS } from '$lib/config/api.config';
import { goto } from '$app/navigation';

interface RequestConfig extends RequestInit {
	timeout?: number;
	skipAuth?: boolean;
}

interface ApiError {
	message: string;
	statusCode?: number;
	errors?: Record<string, string[]>;
}

class ApiService {
	private isRefreshing = false;
	private refreshSubscribers: ((token: string) => void)[] = [];

	/**
	 * Realiza una petición HTTP con manejo automático de tokens
	 */
	private async request<T>(
		endpoint: string,
		config: RequestConfig = {}
	): Promise<T> {
		const { timeout = API_TIMEOUT, skipAuth = false, ...fetchConfig } = config;

		const url = `${API_BASE_URL}${endpoint}`;
		
		const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...(fetchConfig.headers as Record<string, string>) // Cast or ensure fetchConfig.headers is compatible
        };

        // Agregar token de autenticación si está disponible
        if (!skipAuth && typeof window !== 'undefined') {
            const token = localStorage.getItem(STORAGE_KEYS.accessToken);
            if (token) {
                // Now 'Authorization' can be safely indexed on Record<string, string>
                headers['Authorization'] = `Bearer ${token}`; 
            }
        }
		// Crear un AbortController para el timeout
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), timeout);

		try {
			const response = await fetch(url, {
				...fetchConfig,
				headers,
				signal: controller.signal
			});

			clearTimeout(timeoutId);

			// Si es 401, intentar refrescar el token
			if (response.status === 401 && !skipAuth && !endpoint.includes('/auth/')) {
				return await this.handleUnauthorized<T>(endpoint, config);
			}

			// Si la respuesta no es OK, lanzar error
			if (!response.ok) {
				const error: ApiError = await response.json().catch(() => ({
					message: 'Error desconocido del servidor',
					statusCode: response.status
				}));
				
				throw new Error(error.message || `Error ${response.status}`);
			}

			// Si es 204 No Content, retornar null
			if (response.status === 204) {
				return null as T;
			}

			return await response.json();
		} catch (error) {
			clearTimeout(timeoutId);
			
			if (error instanceof Error) {
				if (error.name === 'AbortError') {
					throw new Error('La petición excedió el tiempo de espera');
				}
				throw error;
			}
			
			throw new Error('Error desconocido en la petición');
		}
	}

	/**
	 * Maneja errores 401 intentando refrescar el token
	 */
	private async handleUnauthorized<T>(
		endpoint: string,
		config: RequestConfig
	): Promise<T> {
		// Si ya estamos refrescando, esperar a que termine
		if (this.isRefreshing) {
			return new Promise((resolve, reject) => {
				this.refreshSubscribers.push((token: string) => {
					this.request<T>(endpoint, {
						...config,
						headers: {
							...config.headers,
							Authorization: `Bearer ${token}`
						}
					})
						.then(resolve)
						.catch(reject);
				});
			});
		}

		this.isRefreshing = true;

		try {
			const refreshToken = this.getRefreshToken();
			if (!refreshToken) {
				throw new Error('No hay token de refresco disponible');
			}

			// Refrescar el token
			const response = await this.post<{ accessToken: string; refreshToken: string; expiresAt: string }>(
				API_ENDPOINTS.auth.refresh,
				{ refreshToken },
				{ skipAuth: true }
			);

			// Guardar los nuevos tokens
			this.setTokens(response.accessToken, response.refreshToken, new Date(response.expiresAt));

			// Notificar a todos los suscriptores
			this.refreshSubscribers.forEach((callback) => callback(response.accessToken));
			this.refreshSubscribers = [];

			// Reintentar la petición original
			return await this.request<T>(endpoint, config);
		} catch (error) {
			// Si falla el refresh, limpiar tokens y redirigir a login
			this.clearTokens();
			
			// Redirigir al login solo si estamos en el navegador
			if (typeof window !== 'undefined') {
				console.error('Sesión expirada. Redirigiendo al login...');
				goto('/login');
			}
			
			throw new Error('Sesión expirada. Por favor, inicie sesión nuevamente.');
		} finally {
			this.isRefreshing = false;
		}
	}

	/**
	 * GET request
	 */
	async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
		return this.request<T>(endpoint, { ...config, method: 'GET' });
	}

	/**
	 * POST request
	 */
	async post<T>(
		endpoint: string,
		data?: unknown,
		config?: RequestConfig
	): Promise<T> {
		return this.request<T>(endpoint, {
			...config,
			method: 'POST',
			body: data ? JSON.stringify(data) : undefined
		});
	}

	/**
	 * PUT request
	 */
	async put<T>(
		endpoint: string,
		data?: unknown,
		config?: RequestConfig
	): Promise<T> {
		return this.request<T>(endpoint, {
			...config,
			method: 'PUT',
			body: data ? JSON.stringify(data) : undefined
		});
	}

	/**
	 * DELETE request
	 */
	async delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
		return this.request<T>(endpoint, { ...config, method: 'DELETE' });
	}

	/**
	 * PATCH request
	 */
	async patch<T>(
		endpoint: string,
		data?: unknown,
		config?: RequestConfig
	): Promise<T> {
		return this.request<T>(endpoint, {
			...config,
			method: 'PATCH',
			body: data ? JSON.stringify(data) : undefined
		});
	}

	/**
	 * Guarda los tokens en localStorage
	 */
	setTokens(accessToken: string, refreshToken: string, expiresAt?: Date): void {
		if (typeof window === 'undefined') return;

		localStorage.setItem(STORAGE_KEYS.accessToken, accessToken);
		localStorage.setItem(STORAGE_KEYS.refreshToken, refreshToken);
		
		if (expiresAt) {
			localStorage.setItem(STORAGE_KEYS.tokenExpiry, expiresAt.toISOString());
		}
	}

	/**
	 * Obtiene el access token
	 */
	getAccessToken(): string | null {
		if (typeof window === 'undefined') return null;
		return localStorage.getItem(STORAGE_KEYS.accessToken);
	}

	/**
	 * Obtiene el refresh token
	 */
	getRefreshToken(): string | null {
		if (typeof window === 'undefined') return null;
		return localStorage.getItem(STORAGE_KEYS.refreshToken);
	}

	/**
	 * Limpia todos los tokens
	 */
	clearTokens(): void {
		if (typeof window === 'undefined') return;
		
		localStorage.removeItem(STORAGE_KEYS.accessToken);
		localStorage.removeItem(STORAGE_KEYS.refreshToken);
		localStorage.removeItem(STORAGE_KEYS.tokenExpiry);
	}

	/**
	 * Verifica si el token ha expirado
	 */
	isTokenExpired(): boolean {
		if (typeof window === 'undefined') return true;

		const expiry = localStorage.getItem(STORAGE_KEYS.tokenExpiry);
		if (!expiry) return true;

		return new Date(expiry) <= new Date();
	}
}

// Exportar una instancia singleton
export const apiService = new ApiService();