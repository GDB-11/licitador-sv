// src/lib/features/perfil-empresarial/index.ts

// Página principal
export { default as PerfilEmpresarialPage } from './PerfilEmpresarialPage.svelte';

// Componentes
export { default as DatosGeneralesForm } from './components/DatosGeneralesForm.svelte';
export { default as RepresentanteLegalForm } from './components/RepresentanteLegalForm.svelte';
export { default as DatosBancariosForm } from './components/DatosBancariosForm.svelte';
export { default as PerfilProgress } from './components/PerfilProgress.svelte';

// Store
export { perfilEmpresarialStore } from './stores/perfil-empresarial.svelte';

// Tipos
export type {
	DatosGenerales,
	RepresentanteLegal,
	DatosBancarios,
	PerfilEmpresarial,
	ValidationErrors,
	PerfilEmpresarialState
} from './types';