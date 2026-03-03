<script lang="ts">
	import schedule from '$lib/data/schedule.json';

	interface Props {
		dates: string[];
		selectedDate: string;
		onSelectDate: (date: string) => void;
	}

	let { dates, selectedDate, onSelectDate }: Props = $props();

	function formatDateLabel(dateStr: string): string {
		const [y, m, d] = dateStr.split('-').map(Number);
		return new Date(y, m - 1, d).toLocaleDateString('en-US', {
			weekday: 'short',
			month: 'short',
			day: 'numeric'
		});
	}
</script>

<header class="flex flex-wrap items-center gap-4 mb-6">
	<h1 class="text-3xl font-bold">{schedule.name}</h1>
	<div class="flex gap-2">
		{#each dates as date}
			<button
				onclick={() => onSelectDate(date)}
				class="px-3 py-1 rounded-full text-sm font-medium border transition-colors
					{selectedDate === date
					? 'bg-gray-900 text-white border-gray-900'
					: 'bg-white text-gray-600 border-gray-300 hover:border-gray-500 hover:text-gray-900'}"
			>
				{formatDateLabel(date)}
			</button>
		{/each}
	</div>
</header>
