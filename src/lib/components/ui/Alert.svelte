<script lang="ts">
	import type { Snippet } from 'svelte';

	interface AlertProps {
		type?: 'success' | 'error' | 'warning' | 'info';
		children: Snippet;
	}

	let { type = 'info', children }: AlertProps = $props();

	const typeClasses = {
		success:
			'bg-green-50 border-green-600 text-green-800 dark:bg-green-900/20 dark:border-green-600 dark:text-green-100',
		error:
			'bg-red-50 border-red-600 text-red-800 dark:bg-red-900/20 dark:border-red-600 dark:text-red-100',
		warning:
			'bg-amber-50 border-amber-600 text-amber-800 dark:bg-amber-900/20 dark:border-amber-600 dark:text-amber-100',
		info: 'bg-sky-50 border-sky-600 text-sky-800 dark:bg-sky-900/20 dark:border-sky-600 dark:text-sky-100'
	};

	const iconPaths = {
		success:
			'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
		error:
			'M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
		warning:
			'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z',
		info: 'M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z'
	};
</script>

<div class="border-l-4 p-4 rounded-r-lg {typeClasses[type]}" role="alert">
	<div class="flex items-start">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="currentColor"
			class="w-5 h-5 mr-3 flex-shrink-0 mt-0.5"
		>
			<path stroke-linecap="round" stroke-linejoin="round" d={iconPaths[type]} />
		</svg>
		<div class="text-sm">
			{@render children()}
		</div>
	</div>
</div>