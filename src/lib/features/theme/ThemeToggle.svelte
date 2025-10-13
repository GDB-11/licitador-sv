<!-- src/lib/features/theme/ThemeToggle.svelte -->
<script lang="ts">
	import { theme } from './stores/theme.svelte';

	// Derivar el tema actual
	let currentTheme = $state<'light' | 'dark'>('light');

	// Suscribirse al store
	$effect(() => {
		const unsubscribe = theme.subscribe((value) => {
			currentTheme = value;
		});

		return unsubscribe;
	});

	function toggleTheme() {
		theme.toggle();
	}
</script>

<button
	onclick={toggleTheme}
	class="relative inline-flex items-center justify-center w-10 h-10 rounded-lg
         bg-gray-200 dark:bg-gray-700 
         hover:bg-gray-300 dark:hover:bg-gray-600
         transition-colors duration-200
         focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2
         dark:focus:ring-offset-gray-900"
	aria-label={currentTheme === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
	title={currentTheme === 'light' ? 'Modo oscuro' : 'Modo claro'}
>
	<!-- Sun Icon (Light Mode) -->
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		stroke-width="2"
		stroke="currentColor"
		class="w-5 h-5 text-gray-700 dark:text-gray-300 transition-all duration-300
           {currentTheme === 'light'
			? 'rotate-0 scale-100 opacity-100'
			: 'rotate-90 scale-0 opacity-0 absolute'}"
	>
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
		/>
	</svg>

	<!-- Moon Icon (Dark Mode) -->
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		stroke-width="2"
		stroke="currentColor"
		class="w-5 h-5 text-gray-700 dark:text-gray-300 transition-all duration-300
           {currentTheme === 'dark'
			? 'rotate-0 scale-100 opacity-100'
			: '-rotate-90 scale-0 opacity-0 absolute'}"
	>
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
		/>
	</svg>
</button>