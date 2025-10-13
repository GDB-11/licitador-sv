<!-- src/lib/features/dashboard/components/StatsCard.svelte -->
<script lang="ts">
	import type { Snippet } from 'svelte';

	interface StatsCardProps {
		title: string;
		value: string | number;
		subtitle?: string;
		icon: Snippet;
		iconBgColor?: string;
		progressValue?: number;
		onEdit?: () => void;
	}

	let {
		title,
		value,
		subtitle,
		icon,
		iconBgColor = 'bg-indigo-100 dark:bg-indigo-900',
		progressValue,
		onEdit
	}: StatsCardProps = $props();
</script>

<div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
	<div class="flex items-center justify-between mb-2">
		<span class="text-sm text-gray-600 dark:text-gray-400">{title}</span>
		<div class="{iconBgColor} w-10 h-10 rounded-lg flex items-center justify-center">
			{@render icon()}
		</div>
	</div>

	<div class="flex items-end justify-between">
		<p class="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
		{#if onEdit}
			<button
				onclick={onEdit}
				class="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium transition-colors"
			>
				Editar
			</button>
		{/if}
	</div>

	{#if progressValue !== undefined}
		<div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
			<div
				class="bg-purple-600 dark:bg-purple-500 h-2 rounded-full transition-all duration-500"
				style="width: {progressValue}%"
			></div>
		</div>
	{/if}

	{#if subtitle}
		<p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
	{/if}
</div>