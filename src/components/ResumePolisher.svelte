<script lang="ts">
  import { onMount } from 'svelte';
  import { AiClient } from '../lib/ai_client';
  import { detectLang, t, type Lang } from '../lib/i18n';

  let lang: Lang = 'en';
  let strings = t(lang);
  let currentRole = '';
  let targetRole = '';
  let bulletsText = '';
  let tone: 'professional' | 'casual' = 'professional';
  let loading = false;
  let result = '';
  let error = '';
  let copied = false;

  onMount(() => {
    lang = detectLang();
    strings = t(lang);
  });

  async function polish() {
    error = '';
    result = '';
    const bullets = bulletsText
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    if (bullets.length === 0) {
      error = strings.errorPrefix + ': bullets';
      return;
    }
    loading = true;
    try {
      const res = await AiClient.fromIdentity().resumePolish({
        currentRole,
        targetRole,
        bullets,
        tone,
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
    {strings.resumeHeadline}
  </h1>
  <p class="text-ink-300 mb-6">{strings.resumeSub}</p>

  <div class="space-y-4">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <label class="block">
        <span class="text-xs font-mono uppercase tracking-widest text-ink-500 mb-1.5 block">
          {strings.resumeCurrentRole}
        </span>
        <input
          type="text"
          bind:value={currentRole}
          class="input-glow w-full rounded-lg border border-ink-700 bg-ink-900/60 px-4 py-2.5 text-ink-100"
          placeholder="e.g. Senior Frontend Engineer"
        />
      </label>
      <label class="block">
        <span class="text-xs font-mono uppercase tracking-widest text-ink-500 mb-1.5 block">
          {strings.resumeTargetRole}
        </span>
        <input
          type="text"
          bind:value={targetRole}
          class="input-glow w-full rounded-lg border border-ink-700 bg-ink-900/60 px-4 py-2.5 text-ink-100"
          placeholder="e.g. Engineering Manager"
        />
      </label>
    </div>

    <label class="block">
      <span class="text-xs font-mono uppercase tracking-widest text-ink-500 mb-1.5 block">
        {strings.resumeBullets}
      </span>
      <textarea
        bind:value={bulletsText}
        rows="6"
        class="input-glow w-full rounded-lg border border-ink-700 bg-ink-900/60 px-4 py-3 text-ink-100 font-mono text-sm leading-relaxed"
        placeholder={strings.resumeBulletsHint}
      ></textarea>
    </label>

    <div class="flex items-center gap-3">
      <span class="text-xs font-mono uppercase tracking-widest text-ink-500">
        {strings.resumeTone}
      </span>
      <div class="inline-flex rounded-full border border-ink-700 bg-ink-900/60 p-1">
        <button
          type="button"
          class="px-4 py-1.5 rounded-full text-xs transition-colors {tone === 'professional'
            ? 'bg-ion-500 text-ink-950 font-semibold'
            : 'text-ink-300'}"
          on:click={() => (tone = 'professional')}
        >
          {strings.toneProfessional}
        </button>
        <button
          type="button"
          class="px-4 py-1.5 rounded-full text-xs transition-colors {tone === 'casual'
            ? 'bg-ion-500 text-ink-950 font-semibold'
            : 'text-ink-300'}"
          on:click={() => (tone = 'casual')}
        >
          {strings.toneCasual}
        </button>
      </div>
    </div>

    <button
      type="button"
      class="btn-ion w-full md:w-auto px-8 py-3 rounded-lg"
      on:click={polish}
      disabled={loading}
    >
      {loading ? strings.polishing : strings.polish}
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
