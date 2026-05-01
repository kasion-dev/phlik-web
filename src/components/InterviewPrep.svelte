<script lang="ts">
  import { onMount } from 'svelte';
  import { AiClient } from '../lib/ai_client';
  import { detectLang, t, type Lang } from '../lib/i18n';

  let lang: Lang = 'en';
  let strings = t(lang);
  let role = '';
  let industry = '';
  let salaryMin = 50000;
  let salaryMax: number | null = null;
  let loading = false;
  let result = '';
  let error = '';
  let copied = false;

  onMount(() => {
    lang = detectLang();
    strings = t(lang);
  });

  async function generate() {
    error = '';
    result = '';
    if (!role.trim()) {
      error = `${strings.errorPrefix}: role`;
      return;
    }
    loading = true;
    try {
      const res = await AiClient.fromIdentity().interviewPrep({
        role,
        industry,
        targetSalaryMinThb: salaryMin,
        targetSalaryMaxThb: salaryMax ?? undefined,
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
    {strings.interviewHeadline}
  </h1>
  <p class="text-ink-300 mb-6">{strings.interviewSub}</p>

  <div class="space-y-4">
    <label class="block">
      <span class="text-xs font-mono uppercase tracking-widest text-ink-500 mb-1.5 block">
        {strings.interviewRole}
      </span>
      <input
        type="text"
        bind:value={role}
        class="input-glow w-full rounded-lg border border-ink-700 bg-ink-900/60 px-4 py-2.5 text-ink-100"
        placeholder="e.g. Senior Frontend Engineer"
      />
    </label>

    <label class="block">
      <span class="text-xs font-mono uppercase tracking-widest text-ink-500 mb-1.5 block">
        {strings.interviewIndustry}
      </span>
      <input
        type="text"
        bind:value={industry}
        class="input-glow w-full rounded-lg border border-ink-700 bg-ink-900/60 px-4 py-2.5 text-ink-100"
        placeholder="e.g. Tech startup TH"
      />
    </label>

    <div class="grid grid-cols-2 gap-4">
      <label class="block">
        <span class="text-xs font-mono uppercase tracking-widest text-ink-500 mb-1.5 block">
          {strings.interviewSalaryMin}
        </span>
        <input
          type="number"
          bind:value={salaryMin}
          min="0"
          class="input-glow w-full rounded-lg border border-ink-700 bg-ink-900/60 px-4 py-2.5 text-ink-100"
        />
      </label>
      <label class="block">
        <span class="text-xs font-mono uppercase tracking-widest text-ink-500 mb-1.5 block">
          {strings.interviewSalaryMax}
        </span>
        <input
          type="number"
          bind:value={salaryMax}
          min="0"
          class="input-glow w-full rounded-lg border border-ink-700 bg-ink-900/60 px-4 py-2.5 text-ink-100"
        />
      </label>
    </div>

    <button
      type="button"
      class="btn-ion w-full md:w-auto px-8 py-3 rounded-lg"
      on:click={generate}
      disabled={loading}
    >
      {loading ? strings.generating : strings.generate}
    </button>
  </div>

  {#if error}
    <div class="mt-6 rounded-lg border border-red-900/50 bg-red-900/20 px-4 py-3 text-sm text-red-300">
      {error}
    </div>
  {/if}

  {#if result}
    <div class="mt-6 rounded-xl border border-ion-500/30 bg-ink-900/60 p-5 backdrop-blur-sm">
      <div class="flex items-center justify-between mb-3">
        <span class="text-xs font-mono uppercase tracking-widest text-ion-400">
          {strings.result}
        </span>
        <button
          type="button"
          class="text-xs text-ink-300 hover:text-ion-400 transition-colors"
          on:click={copyResult}
        >
          {copied ? strings.copied : strings.copy}
        </button>
      </div>
      <pre class="whitespace-pre-wrap text-sm text-ink-100 leading-relaxed font-sans">{result}</pre>
    </div>
  {/if}
</section>
