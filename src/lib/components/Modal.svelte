<script lang="ts">
	interface Props {
		open: boolean;
		title: string;
		description: string;
		onClose: () => void;
	}

	let { open, title, description, onClose }: Props = $props();

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			onClose();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open}
	<div class="fixed inset-0 z-50 flex items-center justify-center">
		<!-- Backdrop -->
		<button
			class="absolute inset-0 bg-black/50 cursor-default"
			onclick={onClose}
			aria-label="Close modal"
			tabindex="-1"
		></button>
		<div
			class="relative bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto"
			role="dialog"
			aria-modal="true"
			aria-labelledby="modal-title"
		>
			<div class="flex items-start justify-between p-4 border-b border-gray-200">
				<h2 id="modal-title" class="text-lg font-semibold text-gray-900">
					{title}
				</h2>
				<button
					onclick={onClose}
					class="text-gray-400 hover:text-gray-600 text-2xl leading-none p-1"
					aria-label="Close modal"
				>
					&times;
				</button>
			</div>
			<div class="p-4 text-gray-700">
				{@html description}
			</div>
		</div>
	</div>
{/if}
