// src/lib/features/auth/stores/auth.svelte.ts

import { apiService } from '$lib/services/api.service';
import { API_ENDPOINTS } from '$lib/config/api.config';
import type { AuthState, User, LoginResponse, Company } from '$lib/types/auth.types';

class AuthStore {
	private state = $state<AuthState>({
		user: null,
		company: null,
		isAuthenticated: false,
		isLoading: false,
		error: null
	});

	constructor() {
		// Intentar restaurar la sesión al iniciar
		if (typeof window !== 'undefined') {
			this.restoreSession();
		}
	}

	get user() {
		return this.state.user;
	}

	get company() {
		return this.state.company;
	}

	get isAuthenticated() {
		return this.state.isAuthenticated;
	}

	get isLoading() {
		return this.state.isLoading;
	}

	get error() {
		return this.state.error;
	}

	/**
	 * Inicia sesión con email y contraseña
	 */
	async login(email: string, password: string): Promise<boolean> {
		this.state.isLoading = true;
		this.state.error = null;

		try {
			// Llamar a la API de .NET
			const response = await apiService.post<LoginResponse>(
				API_ENDPOINTS.auth.login,
				{ email, password },
				{ skipAuth: true } // No enviar token en el login
			);

			// Guardar tokens
			apiService.setTokens(
				response.accessToken,
				response.refreshToken,
				new Date(response.expiresAt)
			);

			// Actualizar estado con la información del usuario
			this.state.user = {
				id: response.user.userId,
				email: response.user.email,
				name: response.user.fullName
			};
			this.state.isAuthenticated = true;
			this.state.isLoading = false;

			return true;
		} catch (error) {
			this.state.error = error instanceof Error ? error.message : 'Error al iniciar sesión';
			this.state.isLoading = false;
			this.state.isAuthenticated = false;
			this.state.user = null;
			
			// Limpiar cualquier token residual
			apiService.clearTokens();
			
			return false;
		}
	}

	/**
	 * Refresca el token de acceso usando el refresh token
	 */
	async refreshToken(): Promise<boolean> {
		try {
			const refreshToken = apiService.getRefreshToken();
			if (!refreshToken) {
				throw new Error('No hay refresh token disponible');
			}

			const response = await apiService.post<LoginResponse>(
				API_ENDPOINTS.auth.refresh,
				{ refreshToken },
				{ skipAuth: true }
			);

			// Guardar nuevos tokens
			apiService.setTokens(
				response.accessToken,
				response.refreshToken,
				new Date(response.expiresAt)
			);

			// Actualizar información del usuario
			this.state.user = {
				id: response.user.userId,
				email: response.user.email,
				name: response.user.fullName
			};
			this.state.isAuthenticated = true;

			return true;
		} catch (error) {
			// Si falla el refresh, cerrar sesión
			await this.logout();
			return false;
		}
	}

	/**
	 * Obtiene la información de la empresa del usuario
	 */
	async fetchCompany(): Promise<boolean> {
		try {
			const response = await apiService.get<Company>(API_ENDPOINTS.company.myCompany);
			
			this.state.company = {
				companyId: response.companyId,
				ruc: response.ruc,
				razonSocial: response.razonSocial
			};

			return true;
		} catch (error) {
			console.error('Error al obtener información de la empresa:', error);
			this.state.company = null;
			return false;
		}
	}

	/**
	 * Cierra sesión
	 */
	async logout() {
		try {
			// Intentar llamar al endpoint de logout si existe
			// (puedes implementarlo en el backend si es necesario)
			if (this.state.isAuthenticated) {
				await apiService.post(API_ENDPOINTS.auth.logout, {}).catch(() => {
					// Ignorar errores en logout
				});
			}
		} finally {
			// Siempre limpiar el estado local
			this.state.user = null;
			this.state.company = null;
			this.state.isAuthenticated = false;
			this.state.error = null;
			apiService.clearTokens();
		}
	}

	/**
	 * Restaura la sesión desde localStorage
	 */
	private async restoreSession() {
		const token = apiService.getAccessToken();
		if (!token) {
			return;
		}

		// Si el token ha expirado, intentar refrescar
		if (apiService.isTokenExpired()) {
			await this.refreshToken();
			return;
		}

		// El token es válido, pero necesitamos obtener la información del usuario
		// Esto depende de si tu API tiene un endpoint para obtener el usuario actual
		// Por ahora, intentaremos refrescar el token para obtener la info actualizada
		await this.refreshToken();
	}

	/**
	 * Limpia el error actual
	 */
	clearError() {
		this.state.error = null;
	}

	/**
	 * Verifica si la sesión es válida
	 */
	isSessionValid(): boolean {
		return this.state.isAuthenticated && !apiService.isTokenExpired();
	}
}

export const authStore = new AuthStore();