<script lang="ts">
  import { savedSessions } from "$stores/savedSessions.svelte.ts";

  interface Props {
    open: boolean;
    id: string;
    title: string;
    description: string;
    onClose: () => void;
    skillLevel?: string;
    sessionType?: string;
    tracks?: string[];
    recorded?: boolean;
  }

  let {
    open,
    id,
    title,
    description,
    onClose,
    skillLevel,
    sessionType,
    tracks = [],
    recorded,
  }: Props = $props();

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Escape") {
      onClose();
    }
  }

  function toggleSaved() {
    savedSessions.toggle(id);
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
      <div
        class="flex items-start justify-between p-4 border-b border-gray-200"
      >
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
      <div
        class="border-t border-gray-200 px-4 py-3 bg-gray-50 text-xs text-gray-600 flex items-center flex-wrap gap-4"
      >
        {#if skillLevel}
          <div class="flex items-center gap-1">
            <span class="font-semibold text-gray-700">{skillLevel}</span>
          </div>
        {/if}
        {#if sessionType}
          <div class="flex items-center gap-1">
            <span>{sessionType}</span>
          </div>
        {/if}
        {#if tracks && tracks.length > 0}
          <div class="flex items-center gap-1">
            {#each tracks as track}
              <span class="bg-blue-100 text-blue-800 px-2 py-0.5 rounded"
                >{track}</span
              >
            {/each}
          </div>
        {/if}
        {#if recorded !== undefined && recorded}
          <span class="font-semibold text-gray-700">🎥 Recorded</span>
        {/if}

        <button class="items-right" onclick={toggleSaved}>
          {savedSessions.isSaved(id) ? "★ Saved" : "☆ Save"}
        </button>
      </div>
    </div>
  </div>
{/if}
