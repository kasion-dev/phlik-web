<script lang="ts">
  import { onMount } from 'svelte';
  import { AiClient } from '../lib/ai_client';
  import { detectLang, t, type Lang } from '../lib/i18n';

  let lang: Lang = 'en';
  let strings = t(lang);
  let mood: 'great' | 'ok' | 'meh' | 'down' | 'bad' = 'ok';
  let event = '';
  let loading = false;
  let result = '';
  let error = '';
  let copied = false;

  onMount(() => {
    lang = detectLang();
    strings = t(lang);
  });

  const moods: { id: typeof mood; emoji: string; labels: Record<Lang, string> }[] = [
    { id: 'great', emoji: '🤩', labels: { th: 'ดีมาก', en: 'Great', es: 'Genial', zh: '很棒' } },
    { id: 'ok', emoji: '🙂', labels: { th: 'OK', en: 'OK', es: 'OK', zh: 'OK' } },
    { id: 'meh', emoji: '😐', labels: { th: 'เฉยๆ', en: 'Meh', es: 'Regular', zh: '一般' } },
    { id: 'down', emoji: '😔', labels: { th: 'แย่', en: 'Down', es: 'Bajón', zh: '低落' } },
    { id: 'bad', emoji: '😣', labels: { th: 'แย่มาก', en: 'Bad', es: 'Mal', zh: '不好' } },
  ];

  async function reflect() {
    error = '';
    result = '';
    if (!event.trim()) {
      error = `${strings.errorPrefix}: event`;
      return;
    }
    loading = true;
    try {
      const res = await AiClient.fromIdentity().moodReflect({
        emotion: mood,
        event,
        lang,
      });
      result = res.output;
    } catch (e) {
      error = `${strings.errorPrefix}: ${e instanceof Error ? e.message : String(e)}`;
    } finally {
      loading = false;
    }
  }

  async function copyResult() {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    copied = true;
    setTimeout(() => (copied = false), 1500);
  }
</script>

<section class="max-w-3xl mx-auto">
  <h1 class="text-3xl md:text-4xl font-bold tracking-tight mb-2 text-ink-100">
    {strings.journalHeadline}
  </h1>
  <p class="text-ink-300 mb-6">{strings.journalSub}</p>

  <div class="space-y-5">
    <div>
      <span class="text-xs font-mono uppercase tracking-widest text-ink-500 mb-2 block">
        {strings.journalMood}
      </span>
      <div class="flex flex-wrap gap-2">
        {#each moods as m (m.id)}
          <button
            type="button"
            class="flex items-center gap-2 px-4 py-2 rounded-full border transition-colors {mood === m.id
              ? 'border-ion-400 bg-ion-500/15 text-ink-100'
              : 'border-ink-700 bg-ink-900/40 text-ink-300 hover:border-ink-500'}"
            on:click={() => (mood = m.id)}
          >
            <span class="text-lg">{m.emoji}</span>
            <span class="text-sm">{m.labels[lang]}</span>
          </button>
        {/each}
      </div>
    </div>

    <label class="block">
      <span class="text-xs font-mono uppercase tracking-widest text-ink-500 mb-1.5 block">
        {strings.journalEvent}
      </span>
      <textarea
        bind:value={event}
        rows="5"
        class="input-glow w-full rounded-lg border border-ink-700 bg-ink-900/60 px-4 py-3 text-ink-100 leading-relaxed"
        placeholder={strings.journalEventHint}
      ></textarea>
    </label>

    <button
      type="button"
      class="btn-ion w-full md:w-auto px-8 py-3 rounded-lg"
      on:click={reflect}
      disabled={loading}
    >
      {loading ? strings.reflecting : strings.reflect}
    </button>
  </div>

  {#if error}
    <div class="mt-6 rounded-lg border border-red-900/50 bg-red-900/20 px-4 py-3 text-sm text-red-300">
      {error}
    </div>
  {/if}

  {#if result}
    <div class="mt-6 rounded-xl border border-gold-500/30 bg-ink-900/60 p-5 backdrop-blur-sm">
      <div class="flex items-center justify-between mb-3">
        <span class="text-xs font-mono uppercase tracking-widest text-gold-400">
          {strings.result}
        </span>
        <button
          type="button"
          class="text-xs text-ink-300 hover:text-gold-400 transition-colors"
          on:click={copyResult}
        >
          {copied ? strings.copied : strings.copy}
        </button>
      </div>
      <pre class="whitespace-pre-wrap text-sm text-ink-100 leading-relaxed font-sans">{result}</pre>
    </div>
  {/if}
</section>
