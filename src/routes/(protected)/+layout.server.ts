// src/routes/(protected)/+layout.server.ts
// import { redirect } from '@sveltejs/kit';
// import type { LayoutServerLoad } from './$types';

// export const load: LayoutServerLoad = async ({ cookies, url }) => {
// 	// TODO: Verificar token de autenticación
// 	const token = cookies.get('auth_token');

// 	if (!token) {
// 		// Redirigir al login si no hay token
// 		throw redirect(302, `/login?redirect=${url.pathname}`);
// 	}

// 	// TODO: Validar token con tu API de .NET
// 	// const user = await validateToken(token);
// 	// if (!user) {
// 	//   throw redirect(302, '/login');
// 	// }

// 	return {
// 		// user
// 	};
// };