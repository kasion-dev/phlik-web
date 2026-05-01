<script lang="ts">
  import { onMount } from 'svelte';
  import { AiClient } from '../lib/ai_client';
  import { detectLang, t, type Lang } from '../lib/i18n';
  import {
    loadHistory,
    saveHistoryEntry,
    type HistoryEntry,
  } from '../lib/history';
  import { parseInterviewSet, type InterviewSet } from '../lib/render';
  import HistoryPanel from './HistoryPanel.svelte';

  interface Input {
    role: string;
    industry: string;
    salaryMin: number;
    salaryMax: number | null;
  }

  let lang: Lang = 'en';
  let strings = t(lang);
  let role = '';
  let industry = '';
  let salaryMin = 50000;
  let salaryMax: number | null = null;
  let loading = false;
  let raw = '';
  let parsed: InterviewSet | null = null;
  let error = '';
  let copied = false;
  let revealed: Record<number, boolean> = {};
  let history: HistoryEntry<Input>[] = [];

  onMount(() => {
    lang = detectLang();
    strings = t(lang);
    history = loadHistory<Input>('interview');
  });

  async function generate() {
    error = '';
    raw = '';
    parsed = null;
    revealed = {};
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
      raw = res.output;
      parsed = parseInterviewSet(raw);
      saveHistoryEntry<Input>('interview', {
        label: `${role}${industry ? ` · ${industry}` : ''}`,
        output: raw,
        input: { role, industry, salaryMin, salaryMax },
      });
      history = loadHistory<Input>('interview');
    } catch (e) {
      error = `${strings.errorPrefix}: ${e instanceof Error ? e.message : String(e)}`;
    } finally {
      loading = false;
    }
  }

  function loadEntry(entry: HistoryEntry<Input>) {
    role = entry.input.role;
    industry = entry.input.industry;
    salaryMin = entry.input.salaryMin;
    salaryMax = entry.input.salaryMax;
    raw = entry.output;
    parsed = parseInterviewSet(raw);
    revealed = {};
    error = '';
  }

  function refreshHistory() {
    history = loadHistory<Input>('interview');
  }

  function toggleSample(i: number) {
    revealed = { ...revealed, [i]: !revealed[i] };
  }

  async function copyAll() {
    if (!raw) return;
    await navigator.clipboard.writeText(raw);
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

  {#if parsed}
    <div class="mt-6 space-y-3">
      <div class="flex items-center justify-between">
        <span class="text-xs font-mono uppercase tracking-widest text-ion-400">
          {strings.result} · {parsed.questions.length}
        </span>
        <button
          type="button"
          class="text-xs text-ink-300 hover:text-ion-400 transition-colors"
          on:click={copyAll}
        >
          {copied ? strings.copied : strings.copy}
        </button>
      </div>
      {#each parsed.questions as qa, i (i)}
        <div class="rounded-xl border border-ink-700 bg-ink-900/60 p-5 backdrop-blur-sm">
          <div class="flex items-baseline gap-3 mb-2">
            <span
              class="inline-flex items-center justify-center w-7 h-7 rounded-full bg-ion-500/15 text-ion-400 text-xs font-mono font-bold"
            >
              {i + 1}
            </span>
            <span class="text-[10px] font-mono uppercase tracking-widest text-ink-500">
              {strings.questionLabel}
            </span>
          </div>
          <p class="text-ink-100 leading-relaxed mb-3">{qa.q}</p>
          {#if qa.sample}
            <button
              type="button"
              class="text-xs font-mono text-ion-400 hover:text-ion-300 transition-colors"
              on:click={() => toggleSample(i)}
            >
              {revealed[i] ? strings.hideSample : strings.showSample} →
            </button>
            {#if revealed[i]}
              <div
                class="mt-3 rounded-lg border-l-2 border-gold-400/60 bg-gold-500/5 px-4 py-3"
              >
                <div class="text-[10px] font-mono uppercase tracking-widest text-gold-400 mb-1.5">
                  {strings.sampleAnswerLabel}
                </div>
                <p class="text-sm text-ink-100 leading-relaxed">{qa.sample}</p>
              </div>
            {/if}
          {/if}
        </div>
      {/each}
    </div>
  {:else if raw}
    <div class="mt-6 rounded-xl border border-ion-500/30 bg-ink-900/60 p-5 backdrop-blur-sm">
      <div class="flex items-center justify-between mb-3">
        <span class="text-xs font-mono uppercase tracking-widest text-ion-400">
          {strings.result}
        </span>
        <button
          type="button"
          class="text-xs text-ink-300 hover:text-ion-400 transition-colors"
          on:click={copyAll}
        >
          {copied ? strings.copied : strings.copy}
        </button>
      </div>
      <pre class="whitespace-pre-wrap text-sm text-ink-100 leading-relaxed font-sans">{raw}</pre>
    </div>
  {/if}

  <div class="mt-8">
    <HistoryPanel
      feature="interview"
      {lang}
      entries={history}
      onLoad={loadEntry}
      onChange={refreshHistory}
    />
  </div>
</section>
