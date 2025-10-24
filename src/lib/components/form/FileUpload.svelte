<!-- src/lib/components/form/FileUpload.svelte -->
<script lang="ts">
	interface FileUploadProps {
		label: string;
		accept?: string;
		maxSize?: number; // en MB
		currentFile?: string;
		error?: string;
		disabled?: boolean;
		required?: boolean;
		onUpload: (file: File) => Promise<void>;
		onRemove?: () => void;
	}

	let {
		label,
		accept = 'image/*,.pdf',
		maxSize = 5,
		currentFile = $bindable(),
		error,
		disabled = false,
		required = false,
		onUpload,
		onRemove
	}: FileUploadProps = $props();

	let fileInput = $state<HTMLInputElement>();
	let isDragging = $state(false);
	let isUploading = $state(false);
	let uploadError = $state<string | undefined>();

	// Helper para detectar si es Base64
	const isBase64Image = $derived(
		currentFile && 
		(currentFile.startsWith('data:image/') || 
		 (currentFile.length > 100 && !currentFile.startsWith('http')))
	);

	async function handleFileSelect(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		if (file) {
			await processFile(file);
		}
	}

	async function handleDrop(event: DragEvent) {
		event.preventDefault();
		isDragging = false;

		const file = event.dataTransfer?.files[0];
		if (file) {
			await processFile(file);
		}
	}

	async function processFile(file: File) {
		uploadError = undefined;

		// Validar tamaño
		if (file.size > maxSize * 1024 * 1024) {
			uploadError = `El archivo no debe superar ${maxSize}MB`;
			return;
		}

		isUploading = true;
		try {
			await onUpload(file);
		} catch (err) {
			uploadError = 'Error al subir el archivo';
		} finally {
			isUploading = false;
		}
	}

	function handleDragOver(event: DragEvent) {
		event.preventDefault();
		isDragging = true;
	}

	function handleDragLeave() {
		isDragging = false;
	}

	function handleRemove() {
		if (onRemove) {
			onRemove();
		}
		if (fileInput) {
			fileInput.value = '';
		}
	}
</script>

<div class="w-full">
	<label for="file-upload-{label}" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
		{label}
		{#if required}
			<span class="text-red-600 dark:text-red-400">*</span>
		{/if}
	</label>

	{#if currentFile}
		<!-- Vista previa del archivo -->
		<div
			class="flex flex-col space-y-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border-2 border-gray-300 dark:border-gray-600"
		>
			<!-- Vista previa de imagen si es Base64 o URL de imagen -->
			{#if isBase64Image || (currentFile && (currentFile.endsWith('.jpg') || currentFile.endsWith('.jpeg') || currentFile.endsWith('.png') || currentFile.endsWith('.gif')))}
				<div class="flex justify-center">
					<img
						src={isBase64Image ? `data:image/png;base64,${currentFile}` : currentFile}
						alt="Vista previa del DNI"
						class="max-w-full h-auto max-h-64 rounded-lg border border-gray-300 dark:border-gray-600"
					/>
				</div>
			{/if}

			<div class="flex items-center justify-between">
				<div class="flex items-center space-x-3">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="2"
						stroke="currentColor"
						class="w-8 h-8 text-green-600 dark:text-green-400"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					<div>
						<p class="text-sm font-medium text-gray-900 dark:text-white">Archivo cargado</p>
						{#if !isBase64Image}
							<a
								href={currentFile}
								target="_blank"
								rel="noopener noreferrer"
								class="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
							>
								Ver archivo
							</a>
						{/if}
					</div>
				</div>
				<button
					type="button"
					onclick={handleRemove}
					class="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
					{disabled}
					aria-label="Eliminar archivo"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="2"
						stroke="currentColor"
						class="w-5 h-5"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
						/>
					</svg>
				</button>
			</div>
		</div>
	{:else}
		<!-- Zona de carga -->
		<div
			class="relative border-2 border-dashed rounded-lg p-6 transition-colors
           {isDragging
				? 'border-indigo-600 bg-indigo-50 dark:border-indigo-400 dark:bg-indigo-900/20'
				: 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'}
           {error || uploadError ? 'border-red-500' : ''}"
			ondragover={handleDragOver}
			ondragleave={handleDragLeave}
			ondrop={handleDrop}
			role="button"
			tabindex="0"
		>
			<input
				type="file"
				id="file-upload-{label}"
				bind:this={fileInput}
				{accept}
				{disabled}
				onchange={handleFileSelect}
				class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
			/>

			<div class="text-center">
				{#if isUploading}
					<div class="flex flex-col items-center">
						<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-3"></div>
						<p class="text-sm text-gray-600 dark:text-gray-400">Subiendo archivo...</p>
					</div>
				{:else}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
						/>
					</svg>
					<p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
						<span class="font-semibold text-indigo-600 dark:text-indigo-400">Click para subir</span>
						o arrastra el archivo
					</p>
					<p class="text-xs text-gray-500 dark:text-gray-500 mt-1">
						Máximo {maxSize}MB
					</p>
				{/if}
			</div>
		</div>
	{/if}

	{#if error || uploadError}
		<p class="mt-1 text-sm text-red-600 dark:text-red-400">
			{error || uploadError}
		</p>
	{/if}
</div>