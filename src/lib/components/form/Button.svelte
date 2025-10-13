<!-- src/lib/components/form/Button.svelte -->
<script lang="ts">
	import type { Snippet } from 'svelte';

	interface ButtonProps {
		type?: 'button' | 'submit' | 'reset';
		variant?: 'primary' | 'secondary' | 'ghost';
		size?: 'sm' | 'md' | 'lg';
		fullWidth?: boolean;
		disabled?: boolean;
		loading?: boolean;
		onclick?: () => void;
		children?: Snippet;
	}

	let {
		type = 'button',
		variant = 'primary',
		size = 'md',
		fullWidth = false,
		disabled = false,
		loading = false,
		onclick,
		children
	}: ButtonProps = $props();

	const baseClasses =
		'inline-flex items-center justify-center font-medium transition-colors duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2';

	const variantClasses = {
		primary:
			'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500',
		secondary:
			'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-500',
		ghost:
			'bg-transparent text-blue-600 hover:bg-blue-50 focus:ring-blue-600 dark:text-blue-400 dark:hover:bg-blue-900/20'
	};

	const sizeClasses = {
		sm: 'px-4 py-2 text-sm',
		md: 'px-6 py-2.5 text-base',
		lg: 'px-8 py-3 text-lg'
	};

	const disabledClasses = 'opacity-50 cursor-not-allowed';
	const fullWidthClass = fullWidth ? 'w-full' : '';
</script>

<button
	{type}
	class="{baseClasses} {variantClasses[variant]} {sizeClasses[size]} {fullWidthClass} {disabled ||
	loading
		? disabledClasses
		: ''}"
	{disabled}
	{onclick}
>
	{#if loading}
		<svg
			class="animate-spin -ml-1 mr-3 h-5 w-5"
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
		>
			<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
			></circle>
			<path
				class="opacity-75"
				fill="currentColor"
				d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
			></path>
		</svg>
	{/if}
	{@render children?.()}
</button>