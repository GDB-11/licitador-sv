<!-- src/lib/components/ui/Link.svelte -->
<script lang="ts">
	import type { Snippet } from 'svelte';

	interface LinkProps {
		href: string;
		variant?: 'primary' | 'secondary' | 'ghost';
		children: Snippet;
	}

	let { href, variant = 'primary', children }: LinkProps = $props();

	const variantClasses = {
		primary:
			'text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:underline',
		secondary:
			'text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 hover:underline',
		ghost:
			'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 hover:underline'
	};
</script>

<a {href} class="font-medium transition-colors duration-200 {variantClasses[variant]}">
	{@render children()}
</a>