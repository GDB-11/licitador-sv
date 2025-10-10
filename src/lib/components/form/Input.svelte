<script lang="ts">
	interface InputProps {
		type?: 'text' | 'email' | 'number' | 'tel';
		id?: string;
		name?: string;
		label?: string;
		placeholder?: string;
		value?: string;
		error?: string;
		required?: boolean;
		disabled?: boolean;
		autocomplete?: string;
		oninput?: (e: Event) => void;
		onblur?: (e: FocusEvent) => void;
	}

	let {
		type = 'text',
		id = '',
		name = '',
		label = '',
		placeholder = '',
		value = $bindable(''),
		error = '',
		required = false,
		disabled = false,
		oninput,
		onblur
	}: InputProps = $props();

	const inputId = id || name || Math.random().toString(36).substr(2, 9);
</script>

<div class="w-full">
	{#if label}
		<label
			for={inputId}
			class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
		>
			{label}
			{#if required}
				<span class="text-red-600 dark:text-red-400">*</span>
			{/if}
		</label>
	{/if}

	<input
		{type}
		id={inputId}
		{name}
		{placeholder}
		{required}
		{disabled}
		bind:value
		{oninput}
		{onblur}
		class="w-full px-4 py-2.5 border-2 rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-700 
           placeholder-gray-400 dark:placeholder-gray-500
           transition-colors duration-200
           focus:outline-none focus:ring-2 focus:ring-offset-2
           {error
			? 'border-red-500 focus:border-red-500 focus:ring-red-600 dark:border-red-400'
			: 'border-gray-300 dark:border-gray-600 focus:border-blue-600 focus:ring-blue-600'}
           {disabled ? 'opacity-50 cursor-not-allowed' : ''}"
	/>

	{#if error}
		<p class="mt-1 text-sm text-red-600 dark:text-red-400">
			{error}
		</p>
	{/if}
</div>