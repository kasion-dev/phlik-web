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

<div class="flex items-center gap-3">
  <img
    src="/kw-logo.png"
    alt=""
    width="20"
    height="20"
    class="w-5 h-5 rounded-sm opacity-70"
  />
  <span class="text-ink-300">© 2026 Kasion</span>
  <span class="text-ink-700 hidden sm:inline">·</span>
  <span class="hidden sm:inline">{s.footerStudio}</span>
</div>
