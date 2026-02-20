// src/lib/features/empresas-consorciadas/stores/empresas-consorciadas.svelte.ts
import { apiService } from '$lib/services/api.service';
import { API_ENDPOINTS } from '$lib/config/api.config';
import type {
	EmpresaConsorciada,
	EmpresaConsorciadaFormData,
	EmpresasConsorciadasState,
	ValidationErrors,
	EmpresasResumen,
	ApiListResponse
} from '../types';
import { mapApiToEmpresa } from '../types';

class EmpresasConsorciadasStore {
	private state = $state<EmpresasConsorciadasState>({
		empresas: [],
		empresaSeleccionada: null,
		isLoading: false,
		isSaving: false,
		error: null,
		validationErrors: {},
		filtroActivas: true
	});

	// ─── Getters reactivos ────────────────────────────────────────────────────

	get empresas() {
		return this.state.filtroActivas
			? this.state.empresas.filter((e) => e.activo)
			: this.state.empresas;
	}

	get todasLasEmpresas() {
		return this.state.empresas;
	}

	get empresaSeleccionada() {
		return this.state.empresaSeleccionada;
	}

	get isLoading() {
		return this.state.isLoading;
	}

	get isSaving() {
		return this.state.isSaving;
	}

	get error() {
		return this.state.error;
	}

	get validationErrors() {
		return this.state.validationErrors;
	}

	get filtroActivas() {
		return this.state.filtroActivas;
	}

	get resumen(): EmpresasResumen {
		const totalEmpresas = this.state.empresas.length;
		const empresasActivas = this.state.empresas.filter((e) => e.activo).length;
		const empresasInactivas = totalEmpresas - empresasActivas;
		const empresasConRNPVigente = this.state.empresas.filter((e) => {
			if (!e.vigenciaRNPHasta) return false;
			return new Date(e.vigenciaRNPHasta) > new Date();
		}).length;

		return { totalEmpresas, empresasActivas, empresasInactivas, empresasConRNPVigente };
	}

	// ─── Filtro ───────────────────────────────────────────────────────────────

	setFiltroActivas(mostrarSoloActivas: boolean) {
		this.state.filtroActivas = mostrarSoloActivas;
	}

	// ─── API: Cargar lista ────────────────────────────────────────────────────

	async fetchEmpresas(companyId: string): Promise<void> {
		this.state.isLoading = true;
		this.state.error = null;

		try {
			const data = await apiService.get<ApiListResponse>(
				API_ENDPOINTS.consortium.list(companyId)
			);
			this.state.empresas = (data.companies ?? []).map(mapApiToEmpresa);
		} catch (err) {
			this.state.error = err instanceof Error ? err.message : 'Error al cargar empresas';
		} finally {
			this.state.isLoading = false;
		}
	}

	// ─── API: Crear empresa ───────────────────────────────────────────────────

	async agregarEmpresa(companyId: string, data: EmpresaConsorciadaFormData): Promise<boolean> {
		this.state.isSaving = true;
		this.state.error = null;
		this.state.validationErrors = {};

		const errors = this.validarEmpresa(data);
		if (Object.keys(errors).length > 0) {
			this.state.validationErrors = errors;
			this.state.isSaving = false;
			return false;
		}

		try {
			await apiService.post<void>(API_ENDPOINTS.consortium.create, {
				companyId,
				ruc:             data.ruc,
				rnpRegistration: data.registroRNP       || null,
				razonSocial:     data.razonSocial,
				nombreComercial: data.nombreComercial   || null,
				rnpValidUntil:   data.vigenciaRNPHasta  || null,
				mainActivity:    data.actividadPrincipal || null,
				domicilioFiscal: data.domicilioFiscal,
				contactPhone:    data.contacto.telefono          || null,
				contactEmail:    data.contacto.correoElectronico || null,
				dni:             data.representanteLegal.dni,
				fullName:        data.representanteLegal.nombresCompletos,
				position:        data.representanteLegal.cargo
			});

			// Recargar para obtener el ID asignado por el servidor
			await this.fetchEmpresas(companyId);
			return true;
		} catch (err) {
			this.state.error = err instanceof Error ? err.message : 'Error al agregar empresa';
			return false;
		} finally {
			this.state.isSaving = false;
		}
	}

	// ─── API: Actualizar empresa ──────────────────────────────────────────────

	async actualizarEmpresa(
		companyId: string,
		consortiumCompanyId: string,
		data: EmpresaConsorciadaFormData
	): Promise<boolean> {
		this.state.isSaving = true;
		this.state.error = null;
		this.state.validationErrors = {};

		const errors = this.validarEmpresa(data, consortiumCompanyId);
		if (Object.keys(errors).length > 0) {
			this.state.validationErrors = errors;
			this.state.isSaving = false;
			return false;
		}

		try {
			await apiService.put<void>(API_ENDPOINTS.consortium.update, {
				consortiumCompanyId,
				companyId,
				ruc:             data.ruc,
				rnpRegistration: data.registroRNP       || null,
				razonSocial:     data.razonSocial,
				nombreComercial: data.nombreComercial   || null,
				rnpValidUntil:   data.vigenciaRNPHasta  || null,
				mainActivity:    data.actividadPrincipal || null,
				domicilioFiscal: data.domicilioFiscal,
				contactPhone:    data.contacto.telefono          || null,
				contactEmail:    data.contacto.correoElectronico || null,
				consortiumLegalRepresentativeId:
					data.representanteLegal.consortiumLegalRepresentativeId ?? null,
				dni:      data.representanteLegal.dni,
				fullName: data.representanteLegal.nombresCompletos,
				position: data.representanteLegal.cargo
			});

			// Actualización optimista local
			this.state.empresas = this.state.empresas.map((e) =>
				e.consortiumCompanyId === consortiumCompanyId
					? {
							...e,
							ruc:                data.ruc,
							razonSocial:        data.razonSocial,
							nombreComercial:    data.nombreComercial,
							domicilioFiscal:    data.domicilioFiscal,
							actividadPrincipal: data.actividadPrincipal,
							registroRNP:        data.registroRNP,
							vigenciaRNPHasta:   data.vigenciaRNPHasta,
							contacto: { ...data.contacto },
							representanteLegal: {
								consortiumLegalRepresentativeId:
									data.representanteLegal.consortiumLegalRepresentativeId ?? null,
								dni:              data.representanteLegal.dni,
								nombresCompletos: data.representanteLegal.nombresCompletos,
								cargo:            data.representanteLegal.cargo
							},
							fechaActualizacion: new Date().toISOString()
					  }
					: e
			);

			return true;
		} catch (err) {
			this.state.error = err instanceof Error ? err.message : 'Error al actualizar empresa';
			return false;
		} finally {
			this.state.isSaving = false;
		}
	}

	// ─── API: Eliminar empresa ────────────────────────────────────────────────

	async eliminarEmpresa(companyId: string, consortiumCompanyId: string): Promise<boolean> {
		this.state.isSaving = true;
		this.state.error = null;

		try {
			await apiService.delete<void>(
				API_ENDPOINTS.consortium.delete(companyId, consortiumCompanyId)
			);

			this.state.empresas = this.state.empresas.filter(
				(e) => e.consortiumCompanyId !== consortiumCompanyId
			);
			return true;
		} catch (err) {
			this.state.error = err instanceof Error ? err.message : 'Error al eliminar empresa';
			return false;
		} finally {
			this.state.isSaving = false;
		}
	}

	// ─── Estado local ─────────────────────────────────────────────────────────

	seleccionarEmpresa(empresa: EmpresaConsorciada | null) {
		this.state.empresaSeleccionada = empresa;
	}

	buscarPorRUC(ruc: string): EmpresaConsorciada | undefined {
		return this.state.empresas.find((e) => e.ruc === ruc);
	}

	limpiarErrores() {
		this.state.error = null;
		this.state.validationErrors = {};
	}

	// ─── Validaciones ─────────────────────────────────────────────────────────

	private validarEmpresa(
		data: EmpresaConsorciadaFormData,
		excludeId?: string
	): ValidationErrors {
		const errors: ValidationErrors = {};

		if (!data.ruc || !/^\d{11}$/.test(data.ruc)) {
			errors['ruc'] = 'El RUC debe tener 11 dígitos';
		} else {
			const duplicado = this.state.empresas.find(
				(e) => e.ruc === data.ruc && e.consortiumCompanyId !== excludeId
			);
			if (duplicado) errors['ruc'] = 'Ya existe una empresa con este RUC';
		}

		if (!data.razonSocial?.trim()) {
			errors['razonSocial'] = 'La razón social es obligatoria';
		}

		if (!data.domicilioFiscal?.trim()) {
			errors['domicilioFiscal'] = 'El domicilio fiscal es obligatorio';
		}

		if (!data.representanteLegal.dni || !/^\d{8}$/.test(data.representanteLegal.dni)) {
			errors['representanteLegal.dni'] = 'El DNI debe tener 8 dígitos';
		}

		if (!data.representanteLegal.nombresCompletos?.trim()) {
			errors['representanteLegal.nombresCompletos'] = 'Los nombres completos son obligatorios';
		}

		if (!data.representanteLegal.cargo?.trim()) {
			errors['representanteLegal.cargo'] = 'El cargo es obligatorio';
		}

		if (!data.contacto.telefono || !/^\d{9}$/.test(data.contacto.telefono)) {
			errors['contacto.telefono'] = 'El teléfono debe tener 9 dígitos';
		}

		if (
			!data.contacto.correoElectronico ||
			!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contacto.correoElectronico)
		) {
			errors['contacto.correoElectronico'] = 'El correo electrónico no es válido';
		}

		if (data.vigenciaRNPHasta) {
			const fecha = new Date(data.vigenciaRNPHasta);
			if (isNaN(fecha.getTime())) {
				errors['vigenciaRNPHasta'] = 'La fecha de vigencia no es válida';
			}
		}

		return errors;
	}
}

export const empresasConsorciadasStore = new EmpresasConsorciadasStore();