<script lang="ts">
	import schedule from '$lib/data/schedule.json';

	// Conference timezone is ET (EST = UTC-5 in March)
	const ET_OFFSET_MS = -5 * 60 * 60 * 1000;

	function toET(isoString: string): Date {
		const utc = new Date(isoString);
		return new Date(utc.getTime() + ET_OFFSET_MS);
	}

	// 15-minute grid resolution
	const SLOT_MINUTES = 15;

	// All distinct conference dates, sorted
	const dates = [
		...new Set(schedule.sessions.map((s) => s.start_time.slice(0, 10)))
	].sort();

	// Selected date (reactive)
	let selectedDate = $state(dates[0]);

	function formatDateLabel(dateStr: string): string {
		// Parse as local midnight so the weekday is correct
		const [y, m, d] = dateStr.split('-').map(Number);
		return new Date(y, m - 1, d).toLocaleDateString('en-US', {
			weekday: 'long',
			month: 'long',
			day: 'numeric'
		});
	}

	// Derive everything from selectedDate
	const daySessions = $derived(
		schedule.sessions.filter((s) => s.start_time.startsWith(selectedDate))
	);

	const rooms = $derived(
		[...new Set(daySessions.map((s) => s.room).filter((r) => r && r !== 'TBD'))].sort()
	);

	const gridStart = $derived.by(() => {
		const min = Math.min(...daySessions.map((s) => toET(s.start_time).getTime()));
		const d = new Date(min);
		d.setMinutes(Math.floor(d.getMinutes() / SLOT_MINUTES) * SLOT_MINUTES, 0, 0);
		return d;
	});

	const gridEnd = $derived(
		new Date(Math.max(...daySessions.map((s) => toET(s.end_time).getTime())))
	);

	const totalSlots = $derived(
		(gridEnd.getTime() - gridStart.getTime()) / (SLOT_MINUTES * 60 * 1000)
	);

	type HourLabel = { label: string; row: number };

	const hourLabels = $derived.by((): HourLabel[] => {
		const labels: HourLabel[] = [];
		const cursor = new Date(gridStart);
		let slot = 1;
		while (cursor < gridEnd) {
			if (cursor.getMinutes() === 0) {
				labels.push({
					label: cursor.toLocaleTimeString('en-US', {
						hour: 'numeric',
						minute: '2-digit',
						hour12: true,
						timeZone: 'UTC' // already shifted to ET
					}),
					row: slot
				});
			}
			cursor.setMinutes(cursor.getMinutes() + SLOT_MINUTES);
			slot++;
		}
		return labels;
	});

	type GridSession = {
		session_id: number;
		session_title: string;
		session_type: string;
		room: string;
		col: number;
		rowStart: number;
		rowEnd: number;
	};

	const gridSessions = $derived.by((): GridSession[] =>
		daySessions
			.filter((s) => s.room && s.room !== 'TBD')
			.map((s) => {
				const start = toET(s.start_time);
				const end = toET(s.end_time);
				const rowStart =
					(start.getTime() - gridStart.getTime()) / (SLOT_MINUTES * 60 * 1000) + 1;
				const rowEnd =
					(end.getTime() - gridStart.getTime()) / (SLOT_MINUTES * 60 * 1000) + 1;
				const col = rooms.indexOf(s.room) + 2; // +2 because col 1 is the time gutter
				return {
					session_id: s.session_id,
					session_title: s.session_title,
					session_type: s.session_type,
					room: s.room,
					col,
					rowStart,
					rowEnd
				};
			})
	);


</script>

<div class="p-4">
	<!-- Title + date switcher -->
	<div class="flex flex-wrap items-center gap-4 mb-6">
		<h1 class="text-3xl font-bold">{schedule.name}</h1>
		<div class="flex gap-2">
			{#each dates as date}
				<button
					onclick={() => (selectedDate = date)}
					class="px-3 py-1 rounded-full text-sm font-medium border transition-colors
						{selectedDate === date
						? 'bg-gray-900 text-white border-gray-900'
						: 'bg-white text-gray-600 border-gray-300 hover:border-gray-500 hover:text-gray-900'}"
				>
					{formatDateLabel(date)}
				</button>
			{/each}
		</div>
	</div>

	<!-- Scrollable grid wrapper -->
	<div class="overflow-x-auto">
		<div
			class="schedule-grid"
			style="
				display: grid;
				grid-template-columns: 60px {rooms.map(() => 'minmax(120px,1fr)').join(' ')};
				grid-template-rows: 28px {Array(totalSlots).fill('15px').join(' ')};
				min-width: {60 + rooms.length * 120}px;
			"
		>
			<!-- Sticky top-left corner -->
			<div class="sticky left-0 z-30 bg-white border-b border-r border-gray-200"></div>

			<!-- Room headers -->
			{#each rooms as room, i}
				<div
					class="text-xs font-semibold text-center px-1 py-1 bg-gray-50 border-b border-r border-gray-200 truncate"
					style="grid-column: {i + 2}; grid-row: 1;"
					title={room}
				>
					{room}
				</div>
			{/each}

			<!-- Hour labels -->
			{#each hourLabels as { label, row }}
				<div
					class="sticky left-0 z-20 bg-white text-[10px] text-gray-400 text-right pr-2 border-r border-gray-200 flex items-start"
					style="grid-column: 1; grid-row: {row + 1} / span 1;"
				>
					{label}
				</div>
				<!-- Horizontal rule across all rooms at each hour -->
				<div
					class="border-t border-gray-100 pointer-events-none"
					style="grid-column: 2 / {rooms.length + 2}; grid-row: {row + 1};"
				></div>
			{/each}

			<!-- Sessions -->
			{#each gridSessions as s (s.session_id)}
				<div
					class="rounded border border-gray-300 bg-gray-50 text-[11px] leading-2.5 px-1 py-1 overflow-hidden cursor-default m-[1px]"
					style="grid-column: {s.col}; grid-row: {s.rowStart + 1} / {s.rowEnd + 1};"
					title="{s.session_title} ({s.session_type})"
				>
					<span class="font-semibold block">{s.session_title}</span>
				</div>
			{/each}
		</div>
	</div>
</div>
