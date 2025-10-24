// src/lib/guards/auth.guard.ts

import { authStore } from '$lib/features/auth/stores/auth.svelte';
import { goto } from '$app/navigation';

/**
 * Guard para proteger rutas que requieren autenticación
 * Usar en el onMount de componentes o en hooks de SvelteKit
 */
export function requireAuth(): boolean {
	const isAuthenticated = authStore.isAuthenticated;

	if (!isAuthenticated) {
		// Redirigir al login si no está autenticado
		goto('/login');
		return false;
	}

	return true;
}

/**
 * Guard para redirigir usuarios autenticados (ej: página de login)
 */
export function requireGuest(): boolean {
	const isAuthenticated = authStore.isAuthenticated;

	if (isAuthenticated) {
		// Redirigir al dashboard si ya está autenticado
		goto('/dashboard');
		return false;
	}

	return true;
}

/**
 * Verifica si el usuario tiene una sesión válida
 * y refresca el token si es necesario
 */
export async function checkSession(): Promise<boolean> {
	if (!authStore.isSessionValid()) {
		// Intentar refrescar el token
		const refreshed = await authStore.refreshToken();
		
		if (!refreshed) {
			// Si no se pudo refrescar, redirigir al login
			goto('/login');
			return false;
		}
	}

	return true;
}