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

<a href="/resume" class="hover:text-ion-400 transition-colors hidden sm:inline">
  {s.navResume}
</a>
<a href="/interview" class="hover:text-ion-400 transition-colors hidden sm:inline">
  {s.navInterview}
</a>
<a href="/journal" class="hover:text-ion-400 transition-colors hidden sm:inline">
  {s.navJournal}
</a>
<span class="flex items-center gap-2 text-ion-400/80">
  <span class="pulse-dot"></span>
  <span>{s.betaPill}</span>
</span>
