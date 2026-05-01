<script lang="ts">
  import { onMount } from 'svelte';
  import { detectLang, setLang, type Lang } from '../lib/i18n';

  let current: Lang = 'en';

  onMount(() => {
    current = detectLang();
  });

  function pick(l: Lang) {
    current = l;
    setLang(l);
    // Reload to re-render server-rendered strings + remount islands.
    window.location.reload();
  }

  const langs: { id: Lang; flag: string; label: string }[] = [
    { id: 'th', flag: '🇹🇭', label: 'ไทย' },
    { id: 'en', flag: '🇬🇧', label: 'English' },
    { id: 'es', flag: '🇲🇽', label: 'Español' },
    { id: 'zh', flag: '🇨🇳', label: '中文' },
  ];
</script>

<div class="inline-flex items-center gap-1 rounded-full border border-ink-700/60 bg-ink-900/40 p-1 backdrop-blur-sm">
  {#each langs as l (l.id)}
    <button
      type="button"
      class="px-3 py-1.5 rounded-full text-xs font-medium transition-colors {current === l.id
        ? 'bg-ion-500 text-ink-950'
        : 'text-ink-300 hover:text-ink-100'}"
      on:click={() => pick(l.id)}
      aria-pressed={current === l.id}
    >
      <span class="mr-1">{l.flag}</span>{l.label}
    </button>
  {/each}
</div>
