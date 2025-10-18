// src/lib/features/anexos/stores/wizard-anexos.svelte.ts

import type {
	WizardAnexosState,
	EstadoWizard,
	ConfiguracionAnexos,
	Anexo1Data,
	Anexo2Data,
	Anexo3Data,
	DocumentoGenerado,
	EmpresaConsorcio
} from '../types';

class WizardAnexosStore {
	private state = $state<WizardAnexosState>({
		pasoActual: 'configuracion',
		configuracion: null,
		anexo1: null,
		anexo2: null,
		anexo3: null,
		isLoading: false,
		error: null,
		validationErrors: {}
	});

	// Getters reactivos
	get pasoActual() {
		return this.state.pasoActual;
	}

	get configuracion() {
		return this.state.configuracion;
	}

	get anexo1() {
		return this.state.anexo1;
	}

	get anexo2() {
		return this.state.anexo2;
	}

	get anexo3() {
		return this.state.anexo3;
	}

	get isLoading() {
		return this.state.isLoading;
	}

	get error() {
		return this.state.error;
	}

	get validationErrors() {
		return this.state.validationErrors;
	}

	get progresoTotal() {
		const pasos: EstadoWizard[] = ['configuracion', 'anexo1', 'anexo2', 'anexo3', 'resumen'];
		const indiceActual = pasos.indexOf(this.state.pasoActual);
		return ((indiceActual + 1) / pasos.length) * 100;
	}

	get puedeAvanzar() {
		switch (this.state.pasoActual) {
			case 'configuracion':
				return this.state.configuracion !== null;
			case 'anexo1':
				return this.state.anexo1 !== null;
			case 'anexo2':
				return this.state.anexo2 !== null;
			case 'anexo3':
				return this.state.anexo3 !== null;
			default:
				return false;
		}
	}

	// Navegación
	irAPaso(paso: EstadoWizard) {
		this.state.pasoActual = paso;
		this.state.error = null;
		this.state.validationErrors = {};
	}

	siguiente() {
		const pasos: EstadoWizard[] = ['configuracion', 'anexo1', 'anexo2', 'anexo3', 'resumen'];
		const indiceActual = pasos.indexOf(this.state.pasoActual);
		if (indiceActual < pasos.length - 1) {
			this.state.pasoActual = pasos[indiceActual + 1];
		}
	}

	anterior() {
		const pasos: EstadoWizard[] = ['configuracion', 'anexo1', 'anexo2', 'anexo3', 'resumen'];
		const indiceActual = pasos.indexOf(this.state.pasoActual);
		if (indiceActual > 0) {
			this.state.pasoActual = pasos[indiceActual - 1];
		}
	}

	// Guardar datos de cada paso
	guardarConfiguracion(config: ConfiguracionAnexos) {
		this.state.configuracion = config;
		this.state.validationErrors = {};
	}

	guardarAnexo1(data: Anexo1Data) {
		this.state.anexo1 = data;
		this.state.validationErrors = {};
	}

	guardarAnexo2(data: Anexo2Data) {
		this.state.anexo2 = data;
		this.state.validationErrors = {};
	}

	guardarAnexo3(data: Anexo3Data) {
		this.state.anexo3 = data;
		this.state.validationErrors = {};
	}

	// Obtener empresas disponibles para consorcio (API simulada)
	async obtenerEmpresasConsorcio(): Promise<EmpresaConsorcio[]> {
		this.state.isLoading = true;
		this.state.error = null;

		try {
			// TODO: Reemplazar con llamada real a la API
			// const response = await fetch('/api/empresas/consorcio');
			// const data = await response.json();

			// Simulación
			await new Promise((resolve) => setTimeout(resolve, 500));

			return [
				{
					id: 1,
					razonSocial: 'CONSTRUCTORA ANDINA S.A.C.',
					ruc: '20543212345',
					email: 'contacto@andina.pe',
					telefono: '01-4567890'
				},
				{
					id: 2,
					razonSocial: 'INGENIEROS UNIDOS S.R.L.',
					ruc: '20543298765',
					email: 'info@ingenierosunidos.pe',
					telefono: '01-9876543'
				},
				{
					id: 3,
					razonSocial: 'OBRAS CIVILES DEL SUR E.I.R.L.',
					ruc: '20543245678',
					email: 'ventas@obrasciviles.pe',
					telefono: '054-234567'
				}
			];
		} catch (err) {
			this.state.error = err instanceof Error ? err.message : 'Error al cargar empresas';
			return [];
		} finally {
			this.state.isLoading = false;
		}
	}

	// Generar documentos (API simulada)
	async generarDocumentos(): Promise<DocumentoGenerado[]> {
		this.state.isLoading = true;
		this.state.error = null;

		try {
			// TODO: Reemplazar con llamada real a la API
			// const response = await fetch('/api/anexos/generar', {
			//   method: 'POST',
			//   headers: { 'Content-Type': 'application/json' },
			//   body: JSON.stringify({
			//     configuracion: this.state.configuracion,
			//     anexo1: this.state.anexo1,
			//     anexo2: this.state.anexo2,
			//     anexo3: this.state.anexo3
			//   })
			// });
			// const documentos = await response.json();

			// Simulación
			await new Promise((resolve) => setTimeout(resolve, 2000));

			const fechaActual = new Date().toISOString();
			const numeroProceso = this.state.configuracion?.numeroProceso || 'LP-001-2025';

			return [
				{
					tipo: 'anexo1',
					titulo: `Anexo 1 - Declaración Jurada - ${numeroProceso}`,
					url: '/api/documentos/anexo1.docx',
					fechaGeneracion: fechaActual
				},
				{
					tipo: 'anexo2',
					titulo: `Anexo 2 - Pacto de Integridad - ${numeroProceso}`,
					url: '/api/documentos/anexo2.docx',
					fechaGeneracion: fechaActual
				},
				{
					tipo: 'anexo3',
					titulo: `Anexo 3 - Declaración de Impedimentos - ${numeroProceso}`,
					url: '/api/documentos/anexo3.docx',
					fechaGeneracion: fechaActual
				}
			];
		} catch (err) {
			this.state.error = err instanceof Error ? err.message : 'Error al generar documentos';
			throw err;
		} finally {
			this.state.isLoading = false;
		}
	}

	// Validar datos antes de generar
	validarDatos(): boolean {
		const errores: Record<string, string> = {};

		if (!this.state.configuracion) {
			errores.configuracion = 'Debe completar la configuración inicial';
		}

		if (!this.state.anexo1) {
			errores.anexo1 = 'Debe completar el Anexo 1';
		}

		if (!this.state.anexo2) {
			errores.anexo2 = 'Debe completar el Anexo 2';
		}

		if (!this.state.anexo3) {
			errores.anexo3 = 'Debe completar el Anexo 3';
		}

		this.state.validationErrors = errores;
		return Object.keys(errores).length === 0;
	}

	// Reiniciar wizard
	reiniciar() {
		this.state = {
			pasoActual: 'configuracion',
			configuracion: null,
			anexo1: null,
			anexo2: null,
			anexo3: null,
			isLoading: false,
			error: null,
			validationErrors: {}
		};
	}
}

export const wizardAnexosStore = new WizardAnexosStore();