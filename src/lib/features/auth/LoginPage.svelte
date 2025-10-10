<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from '$lib/components/form/Button.svelte';
	import Input from '$lib/components/form/Input.svelte';
	import PasswordInput from '$lib/components/form/PasswordInput.svelte';
	import Checkbox from '$lib/components/form/Checkbox.svelte';
	import Link from '$lib/components/ui/Link.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';
	import { authStore } from './stores/auth.svelte';

	interface FormErrors {
		email?: string;
		password?: string;
	}

	let email = $state('');
	let password = $state('');
	let rememberMe = $state(false);
	let errors = $state<FormErrors>({});
	let showError = $state(false);

	// Obtener URL de redirección si existe
	const redirectUrl = $page.url.searchParams.get('redirect') || '/dashboard';

	function validateForm(): boolean {
		const newErrors: FormErrors = {};

		if (!email) {
			newErrors.email = 'El correo electrónico es requerido';
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			newErrors.email = 'Ingrese un correo electrónico válido';
		}

		if (!password) {
			newErrors.password = 'La contraseña es requerida';
		} else if (password.length < 6) {
			newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
		}

		errors = newErrors;
		return Object.keys(newErrors).length === 0;
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();
		showError = false;

		if (!validateForm()) {
			return;
		}

		const success = await authStore.login(email, password);

		if (success) {
			await goto(redirectUrl);
		} else {
			showError = true;
		}
	}

	function handleEmailInput() {
		if (errors.email) errors.email = undefined;
		if (showError) {
			showError = false;
			authStore.clearError();
		}
	}

	function handlePasswordInput() {
		if (errors.password) errors.password = undefined;
		if (showError) {
			showError = false;
			authStore.clearError();
		}
	}
</script>

<div class="w-full max-w-md">
	<!-- Logo y título -->
	<div class="text-center mb-8">
		<div
			class="inline-flex items-center justify-center w-16 h-16 bg-blue-600 dark:bg-blue-500 rounded-2xl mb-4"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="2"
				stroke="currentColor"
				class="w-10 h-10 text-white"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
				/>
			</svg>
		</div>
		<h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Licitador SV</h1>
		<p class="text-gray-600 dark:text-gray-400">Sistema de Contrataciones Públicas</p>
	</div>

	<!-- Card del formulario -->
	<div
		class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8"
	>
		<h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Iniciar Sesión</h2>

		{#if showError && authStore.error}
			<div class="mb-6">
				<Alert type="error">
					{authStore.error}
				</Alert>
			</div>
		{/if}

		<form onsubmit={handleSubmit} class="space-y-6">
			<Input
				type="email"
				name="email"
				label="Correo Electrónico"
				placeholder="correo@ejemplo.com"
				bind:value={email}
				error={errors.email}
				required
				autocomplete="email"
				oninput={handleEmailInput}
			/>

			<PasswordInput
				name="password"
				label="Contraseña"
				placeholder="••••••••"
				bind:value={password}
				error={errors.password}
				required
				autocomplete="current-password"
				oninput={handlePasswordInput}
			/>

			<div class="flex items-center justify-between">
				<Checkbox bind:checked={rememberMe}>Recordarme</Checkbox>

				<Link href="/recuperar-password" variant="primary">¿Olvidaste tu contraseña?</Link>
			</div>

			<Button type="submit" variant="primary" fullWidth loading={authStore.isLoading}>
				{authStore.isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
			</Button>
		</form>

		<!-- Divider -->
		<div class="relative my-6">
			<div class="absolute inset-0 flex items-center">
				<div class="w-full border-t border-gray-300 dark:border-gray-600"></div>
			</div>
			<div class="relative flex justify-center text-sm">
				<span class="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
					¿No tienes una cuenta?
				</span>
			</div>
		</div>

		<!-- Registro -->
		<div class="text-center">
			<Link href="/registro" variant="secondary">Crear cuenta nueva</Link>
		</div>
	</div>

	<!-- Footer -->
	<div class="mt-8 mb-4 text-center text-sm text-gray-600 dark:text-gray-400">
		<p>
			Al iniciar sesión, aceptas nuestros
			<Link href="/terminos" variant="ghost">Términos de Servicio</Link>
			y
			<Link href="/privacidad" variant="ghost">Política de Privacidad</Link>
		</p>
	</div>
</div>