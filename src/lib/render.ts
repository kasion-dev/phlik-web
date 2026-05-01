/// Tiny rendering helpers. Markdown subset + interview JSON parser.
/// No external deps — keeps gzip footprint small.

interface InterviewQA {
  q: string;
  sample?: string;
}

export interface InterviewSet {
  questions: InterviewQA[];
}

/// Try parsing the AI output as an interview set. Returns null if the
/// shape doesn't match — caller should fall back to markdown render.
export function parseInterviewSet(raw: string): InterviewSet | null {
  const trimmed = raw.trim();
  // Models sometimes wrap JSON in ```json fences — strip them.
  const stripped = trimmed
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '');
  // Fallback: extract first { ... } block in case there's preamble text.
  let candidate = stripped;
  if (!candidate.startsWith('{')) {
    const m = stripped.match(/\{[\s\S]*\}/);
    if (!m) return null;
    candidate = m[0];
  }
  try {
    const parsed = JSON.parse(candidate);
    if (
      parsed &&
      Array.isArray(parsed.questions) &&
      parsed.questions.every(
        (e: unknown) =>
          typeof e === 'object' &&
          e !== null &&
          typeof (e as InterviewQA).q === 'string',
      )
    ) {
      return parsed as InterviewSet;
    }
  } catch {
    return null;
  }
  return null;
}

/// Minimal Markdown → HTML renderer.
/// Supports: # ## ### headings, **bold**, *italic*, `code`, - bullets,
/// 1. numbered lists, --- hr, blank-line paragraphs, line breaks.
/// Output is sanitized — only emits a fixed allowlist of tags. Inline HTML
/// in source is escaped. Good enough for AI markdown responses; for
/// untrusted input we'd swap to a real parser.
export function renderMarkdown(src: string): string {
  const escape = (s: string): string =>
    s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

  const inline = (s: string): string =>
    escape(s)
      .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-ink-800 text-ion-300 text-[0.95em]">$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong class="text-ink-100 font-semibold">$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-ion-400 hover:underline">$1</a>',
      );

  const lines = src.split(/\r?\n/);
  const out: string[] = [];
  let listMode: 'ul' | 'ol' | null = null;
  let para: string[] = [];

  const flushPara = () => {
    if (para.length === 0) return;
    out.push(
      `<p class="my-2 leading-relaxed text-ink-100">${para.map(inline).join('<br>')}</p>`,
    );
    para = [];
  };
  const closeList = () => {
    if (listMode) {
      out.push(`</${listMode}>`);
      listMode = null;
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    if (line.trim() === '') {
      flushPara();
      closeList();
      continue;
    }
    if (line.trim() === '---') {
      flushPara();
      closeList();
      out.push('<hr class="my-4 border-ink-800">');
      continue;
    }
    const h = /^(#{1,3})\s+(.+)$/.exec(line);
    if (h) {
      flushPara();
      closeList();
      const lvl = h[1].length;
      const sizes = ['text-2xl', 'text-xl', 'text-lg'];
      out.push(
        `<h${lvl} class="${sizes[lvl - 1]} font-bold text-ink-100 mt-4 mb-2">${inline(h[2])}</h${lvl}>`,
      );
      continue;
    }
    const ul = /^[-*]\s+(.+)$/.exec(line);
    if (ul) {
      flushPara();
      if (listMode !== 'ul') {
        closeList();
        out.push('<ul class="list-disc pl-6 my-2 space-y-1 text-ink-100">');
        listMode = 'ul';
      }
      out.push(`<li>${inline(ul[1])}</li>`);
      continue;
    }
    const ol = /^\d+\.\s+(.+)$/.exec(line);
    if (ol) {
      flushPara();
      if (listMode !== 'ol') {
        closeList();
        out.push('<ol class="list-decimal pl-6 my-2 space-y-1 text-ink-100">');
        listMode = 'ol';
      }
      out.push(`<li>${inline(ol[1])}</li>`);
      continue;
    }
    // Plain text
    closeList();
    para.push(line);
  }
  flushPara();
  closeList();
  return out.join('\n');
}
