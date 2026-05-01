<script lang="ts">
  import { onMount } from 'svelte';
  import { detectLang, t, type Lang } from '../lib/i18n';

  let lang: Lang = 'en';
  let s = t(lang);

  onMount(() => {
    lang = detectLang();
    s = t(lang);
  });
</script>

<div class="mb-6 flex flex-wrap items-center gap-2">
  <span
    class="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-ion-400 border border-ion-500/30 bg-ion-500/5 px-3 py-1.5 rounded-full"
  >
    <span class="pulse-dot" style="width:6px;height:6px"></span>
    <span>{s.freeBetaPill}</span>
  </span>
  <span
    class="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-ink-300 border border-ink-700 bg-ink-900/40 px-3 py-1.5 rounded-full"
  >
    {s.multiLangPill}
  </span>
</div>

<h1
  class="text-5xl md:text-7xl font-black tracking-tighter leading-none mb-4"
>
  <span class="wordmark">{s.appTitle}</span>
</h1>
{#if lang !== 'th'}
  <p class="text-2xl md:text-3xl text-ink-100 font-light tracking-tight mb-2">
    Phlik Career
  </p>
{/if}
<p
  class="text-base md:text-lg text-ink-300 leading-relaxed mb-3 max-w-2xl"
  class:font-thai={lang === 'th'}
>
  {s.hero}
</p>
<p
  class="text-sm md:text-base text-ink-500 leading-relaxed mb-10 max-w-2xl"
  class:font-thai={lang === 'th'}
>
  {s.heroSub}
</p>

<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
  <a
    href="/resume"
    class="group rounded-2xl border border-ink-700 hover:border-ion-400/60 bg-ink-900/40 hover:bg-ion-500/5 p-6 transition-all"
  >
    <div class="text-3xl mb-3">📄</div>
    <h3 class="font-semibold text-ink-100 mb-1.5">{s.cardResumeTitle}</h3>
    <p class="text-sm text-ink-300 leading-relaxed">{s.cardResumeDesc}</p>
    <div
      class="mt-4 text-xs font-mono text-ion-400 group-hover:translate-x-1 transition-transform"
    >
      {s.ctaOpen}
    </div>
  </a>
  <a
    href="/interview"
    class="group rounded-2xl border border-ink-700 hover:border-ion-400/60 bg-ink-900/40 hover:bg-ion-500/5 p-6 transition-all"
  >
    <div class="text-3xl mb-3">🎤</div>
    <h3 class="font-semibold text-ink-100 mb-1.5">{s.cardInterviewTitle}</h3>
    <p class="text-sm text-ink-300 leading-relaxed">{s.cardInterviewDesc}</p>
    <div
      class="mt-4 text-xs font-mono text-ion-400 group-hover:translate-x-1 transition-transform"
    >
      {s.ctaOpen}
    </div>
  </a>
  <a
    href="/journal"
    class="group rounded-2xl border border-ink-700 hover:border-gold-400/60 bg-ink-900/40 hover:bg-gold-500/5 p-6 transition-all"
  >
    <div class="text-3xl mb-3">📓</div>
    <h3 class="font-semibold text-ink-100 mb-1.5">{s.cardJournalTitle}</h3>
    <p class="text-sm text-ink-300 leading-relaxed">{s.cardJournalDesc}</p>
    <div
      class="mt-4 text-xs font-mono text-gold-400 group-hover:translate-x-1 transition-transform"
    >
      {s.ctaOpen}
    </div>
  </a>
</div>

<div
  class="rounded-2xl border border-ink-800 bg-ink-900/30 p-5 flex flex-col md:flex-row items-start md:items-center gap-4 backdrop-blur-sm"
>
  <img
    src="/phlik-icon.png"
    alt=""
    width="48"
    height="48"
    class="w-12 h-12 rounded-xl ring-1 ring-ink-700"
  />
  <div class="flex-1">
    <div class="font-semibold text-ink-100 mb-0.5">{s.installBannerTitle}</div>
    <div class="text-sm text-ink-300">{s.installBannerSub}</div>
  </div>
  <a
    href="https://play.google.com/store/apps/details?id=dev.kasion.phlik.career"
    target="_blank"
    rel="noopener noreferrer"
    class="inline-block transition-opacity hover:opacity-80"
    aria-label="Get Phlik Career on Google Play"
  >
    <img
      src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
      alt="Get it on Google Play"
      width="160"
      height="62"
      loading="lazy"
      class="block"
    />
  </a>
</div>
