<!-- src/lib/components/form/Checkbox.svelte -->
<script lang="ts">
	import type { Snippet } from 'svelte';

	interface CheckboxProps {
		id?: string;
		name?: string;
		checked?: boolean;
		disabled?: boolean;
		onchange?: (checked: boolean) => void;
		children?: Snippet;
	}

	let {
		id = '',
		name = '',
		checked = $bindable(false),
		disabled = false,
		onchange,
		children
	}: CheckboxProps = $props();

	const inputId = id || name || Math.random().toString(36).substr(2, 9);

	function handleChange(e: Event) {
		const target = e.target as HTMLInputElement;
		checked = target.checked;
		onchange?.(checked);
	}
</script>

<div class="flex items-center">
	<input
		type="checkbox"
		id={inputId}
		{name}
		{disabled}
		bind:checked
		onchange={handleChange}
		class="w-4 h-4 text-blue-600 border-gray-300 rounded 
           focus:ring-2 focus:ring-blue-600 focus:ring-offset-2
           dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-offset-gray-900
           {disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}"
	/>
	{#if children}
		<label
			for={inputId}
			class="ml-2 text-sm text-gray-700 dark:text-gray-300 {disabled
				? 'opacity-50 cursor-not-allowed'
				: 'cursor-pointer'}"
		>
			{@render children()}
		</label>
	{/if}
</div>