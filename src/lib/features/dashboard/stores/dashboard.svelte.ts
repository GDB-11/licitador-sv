// src/lib/features/dashboard/stores/dashboard.svelte.ts
import { writable } from 'svelte/store';
import { authStore } from '$lib/features/auth/stores/auth.svelte';

// Tipos
export interface Estadisticas {
	documentosGenerados: number;
	perfilCompleto: number;
	empresasConsorciadas: number;
}

export interface DocumentoReciente {
	id: number;
	nombre: string;
	fecha: string;
	concurso: string;
}

export interface DashboardData {
	estadisticas: Estadisticas | null;
	documentosRecientes: DocumentoReciente[];
	isLoading: boolean;
	error: string | null;
}

// Estado reactivo usando runes
class DashboardStore {
	private data = $state<DashboardData>({
		estadisticas: null,
		documentosRecientes: [],
		isLoading: false,
		error: null
	});

	// Getters reactivos
	get estadisticas() {
		return this.data.estadisticas;
	}

	get documentosRecientes() {
		return this.data.documentosRecientes;
	}

	get isLoading() {
		return this.data.isLoading;
	}

	get error() {
		return this.data.error;
	}

	get perfilIncompleto() {
		return this.data.estadisticas ? this.data.estadisticas.perfilCompleto < 100 : false;
	}

	// Getters para información del usuario y empresa desde authStore
	get userName() {
		return authStore.user?.name;
	}

	get companyName() {
		return authStore.company?.razonSocial;
	}

	get companyRuc() {
		return authStore.company?.ruc;
	}

	// Simular carga de estadísticas (aquí irá tu API call)
	async fetchEstadisticas() {
		this.data.isLoading = true;
		this.data.error = null;

		try {
			// TODO: Reemplazar con tu llamada real a la API
			// const response = await fetch('/api/dashboard/estadisticas');
			// const data = await response.json();

			// Simulación de respuesta de API
			await new Promise((resolve) => setTimeout(resolve, 500));

			this.data.estadisticas = {
				documentosGenerados: 24,
				perfilCompleto: 85,
				empresasConsorciadas: 2
			};
		} catch (err) {
			this.data.error = err instanceof Error ? err.message : 'Error al cargar estadísticas';
		} finally {
			this.data.isLoading = false;
		}
	}

	// Simular carga de documentos recientes (aquí irá tu API call)
	async fetchDocumentosRecientes() {
		this.data.isLoading = true;
		this.data.error = null;

		try {
			// TODO: Reemplazar con tu llamada real a la API
			// const response = await fetch('/api/dashboard/documentos-recientes');
			// const data = await response.json();

			// Simulación de respuesta de API
			await new Promise((resolve) => setTimeout(resolve, 500));

			this.data.documentosRecientes = [
				{
					id: 1,
					nombre: 'Anexo N° 1 - Declaración Jurada de Datos',
					fecha: '2025-10-10',
					concurso: 'LP-001-2025-MINSA'
				},
				{
					id: 2,
					nombre: 'Anexo N° 2 - Pacto de Integridad',
					fecha: '2025-10-10',
					concurso: 'LP-001-2025-MINSA'
				},
				{
					id: 3,
					nombre: 'Anexo N° 3 - Declaración de Impedimentos',
					fecha: '2025-10-09',
					concurso: 'ADP-004-2025-UNMSM'
				}
			];
		} catch (err) {
			this.data.error = err instanceof Error ? err.message : 'Error al cargar documentos';
		} finally {
			this.data.isLoading = false;
		}
	}

	// Cargar todos los datos del dashboard
	async loadDashboardData() {
		// Primero cargar la información de la empresa si no está disponible
		if (!authStore.company) {
			await authStore.fetchCompany();
		}
		
		await Promise.all([this.fetchEstadisticas(), this.fetchDocumentosRecientes()]);
	}

	// Limpiar error
	clearError() {
		this.data.error = null;
	}
}

// Exportar instancia única del store
export const dashboardStore = new DashboardStore();