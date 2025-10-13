// src/routes/(public)/+layout.server.ts
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
	const year = new Date().getFullYear();
	return { year };
};
