interface User {
	id: string;
	email: string;
	name: string;
}

interface AuthState {
	user: User | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	error: string | null;
}

class AuthStore {
	private state = $state<AuthState>({
		user: null,
		isAuthenticated: false,
		isLoading: false,
		error: null
	});

	get user() {
		return this.state.user;
	}

	get isAuthenticated() {
		return this.state.isAuthenticated;
	}

	get isLoading() {
		return this.state.isLoading;
	}

	get error() {
		return this.state.error;
	}

	async login(email: string, password: string): Promise<boolean> {
		this.state.isLoading = true;
		this.state.error = null;

		try {
			// TODO: Llamar a tu API de .NET
			const response = await fetch('/api/auth/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ email, password })
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.message || 'Error al iniciar sesión');
			}

			const data = await response.json();

			this.state.user = data.user;
			this.state.isAuthenticated = true;
			this.state.isLoading = false;

			// Guardar token en localStorage
			if (typeof window !== 'undefined' && data.token) {
				localStorage.setItem('auth_token', data.token);
			}

			return true;
		} catch (error) {
			this.state.error = error instanceof Error ? error.message : 'Error desconocido';
			this.state.isLoading = false;
			return false;
		}
	}

	async logout() {
		this.state.user = null;
		this.state.isAuthenticated = false;
		this.state.error = null;

		if (typeof window !== 'undefined') {
			localStorage.removeItem('auth_token');
		}

		// TODO: Llamar a tu API para invalidar el token
	}

	clearError() {
		this.state.error = null;
	}
}

export const authStore = new AuthStore();