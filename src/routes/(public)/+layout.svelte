<script lang="ts">
	import type { Snippet } from 'svelte';
	import { ThemeToggle } from '$lib/features/theme';

	interface PublicLayoutProps {
		children: Snippet;
	}

	let { children }: PublicLayoutProps = $props();
</script>

<div
	class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800"
>
	<!-- Header público -->
	<header class="absolute top-0 left-0 right-0 p-4 z-10">
		<nav class="container mx-auto flex justify-between items-center">
			<a href="/" class="flex items-center space-x-2">
				<div
					class="w-10 h-10 bg-blue-600 dark:bg-blue-500 rounded-lg flex items-center justify-center"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="2"
						stroke="currentColor"
						class="w-6 h-6 text-white"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
						/>
					</svg>
				</div>
				<span class="text-xl font-bold text-gray-900 dark:text-white hidden sm:block">
					Licitador SV
				</span>
			</a>

			<!-- Links de navegación pública -->
			<div class="flex items-center space-x-3">
				<!-- Theme Toggle -->
				<ThemeToggle />
                <a				
					href="/login"
					class="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors hidden sm:inline-block"
				>
					Iniciar Sesión
				</a>
				<a
					href="/registro"
					class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 font-medium transition-colors"
				>
					Registrarse
				</a>
			</div>
		</nav>
	</header>

	<!-- Contenido de las páginas públicas -->
	<main class="min-h-screen flex items-center justify-center px-4 py-12">
		{@render children()}
	</main>

	<!-- Footer público -->
	<footer class="absolute bottom-0 left-0 right-0 p-4">
		<div class="container mx-auto text-center text-sm text-gray-600 dark:text-gray-400">
			<p>© 2025 Licitador SV - Sistema de Contrataciones Públicas - Ley N° 32069</p>
		</div>
	</footer>
</div>