<script lang="ts">
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



	import { savedSessions } from '$stores/savedSessions.svelte.ts';

	import { page } from '$app/stores';
import { browser } from '$app/environment';
import { onMount } from 'svelte';

onMount(() => {
  const params = new URLSearchParams(window.location.search);
  const saved = params.get('saved');
  if (saved) {
    saved.split(',').forEach(id => {
      if (!savedSessions.isSaved(id)) savedSessions.toggle(id);
    });
  }
});

function buildShareUrl(): string {
  const ids = savedSessions.getIds().join(',');
  const url = new URL(window.location.href);
  url.searchParams.set('saved', ids);
  return url.toString();
}

let copied = $state(false);

function copyShareUrl() {
  navigator.clipboard.writeText(buildShareUrl());
  copied = true;
  setTimeout(() => copied = false, 2000);
}
</script>

<header class="flex flex-wrap items-center gap-4 mb-6">
	<h1 class="text-3xl font-bold">NICAR 2026</h1>
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
	<button
  onclick={copyShareUrl}
  class="text-xs px-3 py-1 rounded bg-green-100 border border-green-400 hover:bg-green-200 transition-colors"
>
  {copied ? '✓ Link copied!' : 'Share Saved Sessions'}
</button>
</header>
