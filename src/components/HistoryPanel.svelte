<script lang="ts">
  import {
    deleteHistoryEntry,
    clearHistory,
    formatTs,
    type HistoryEntry,
    type HistoryFeature,
  } from '../lib/history';
  import type { Lang } from '../lib/i18n';
  import { t } from '../lib/i18n';

  export let feature: HistoryFeature;
  export let lang: Lang;
  export let entries: HistoryEntry[] = [];
  export let onLoad: (entry: HistoryEntry) => void;
  export let onChange: () => void;

  $: s = t(lang);

  function handleDelete(id: string) {
    deleteHistoryEntry(feature, id);
    onChange();
  }

  function handleClear() {
    clearHistory(feature);
    onChange();
  }
</script>

<div class="rounded-xl border border-ink-800 bg-ink-900/40 p-4">
  <div class="flex items-center justify-between mb-3">
    <span class="text-xs font-mono uppercase tracking-widest text-ink-500">
      {s.historyTitle} ({entries.length})
    </span>
    {#if entries.length > 0}
      <button
        type="button"
        class="text-[10px] text-ink-500 hover:text-red-400 transition-colors"
        on:click={handleClear}
      >
        {s.historyClear}
      </button>
    {/if}
  </div>
  {#if entries.length === 0}
    <p class="text-sm text-ink-500">{s.historyEmpty}</p>
  {:else}
    <ul class="divide-y divide-ink-800">
      {#each entries as e (e.id)}
        <li class="py-2 flex items-center gap-3">
          <div class="flex-1 min-w-0">
            <div class="text-sm text-ink-100 truncate">{e.label}</div>
            <div class="text-[10px] font-mono text-ink-500">
              {formatTs(e.ts, lang)}
            </div>
          </div>
          <button
            type="button"
            class="text-xs text-ion-400 hover:text-ion-300 transition-colors px-2"
            on:click={() => onLoad(e)}
          >
            {s.historyLoad}
          </button>
          <button
            type="button"
            class="text-xs text-ink-500 hover:text-red-400 transition-colors px-2"
            on:click={() => handleDelete(e.id)}
          >
            {s.historyDelete}
          </button>
        </li>
      {/each}
    </ul>
  {/if}
</div>
