// src/routes/+page.server.ts
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
	// Check if user has an active session by checking for auth_token
	const token = cookies.get('auth_token');

	if (token) {
		// User is authenticated, redirect to dashboard
		throw redirect(302, '/dashboard');
	} else {
		// User is not authenticated, redirect to login
		throw redirect(302, '/login');
	}
};
