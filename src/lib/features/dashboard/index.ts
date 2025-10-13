// src/lib/features/dashboard/index.ts
export { default as DashboardPage } from './DashboardPage.svelte';
export { default as StatsCard } from './components/StatsCard.svelte';
export { default as AlertaPerfilIncompleto } from './components/AlertaPerfilIncompleto.svelte';
export { default as GenerarDocumentosSection } from './components/GenerarDocumentosSection.svelte';
export { default as DocumentosRecientes } from './components/DocumentosRecientes.svelte';
export { default as DashboardSidebar } from './components/DashboardSidebar.svelte';
export { dashboardStore } from './stores/dashboard.svelte';
export type { Estadisticas, DocumentoReciente, DashboardData } from './stores/dashboard.svelte';