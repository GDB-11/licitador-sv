// src/lib/features/anexos/index.ts

// Página principal
export { default as WizardAnexosPage } from './WizardAnexosPage.svelte';

// Componentes
export { default as WizardProgress } from './components/WizardProgress.svelte';
export { default as PasoConfiguracion } from './components/PasoConfiguracion.svelte';
export { default as PasoAnexo1 } from './components/PasoAnexo1.svelte';
export { default as PasoAnexo2 } from './components/PasoAnexo2.svelte';
export { default as PasoAnexo3 } from './components/PasoAnexo3.svelte';
export { default as PasoResumen } from './components/PasoResumen.svelte';

// Store
export { wizardAnexosStore } from './stores/wizard-anexos.svelte';

// Tipos
export type {
	TipoParticipacion,
	EstadoWizard,
	ConfiguracionAnexos,
	MiembroConsorcio,
	Anexo1Data,
	Anexo2Data,
	Anexo3Data,
	WizardAnexosState,
	DocumentoGenerado,
	EmpresaConsorcio
} from './types';