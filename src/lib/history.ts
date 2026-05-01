/// localStorage-backed history per feature.
///
/// Keep last N entries (default 10) so the user can re-open past polishes /
/// interview sets / journal reflections without re-spending AI calls.
/// Stored under `phlik_web:history:<feature>`. Schema is intentionally
/// loose so we can add fields later without migrations — anything not
/// present falls back at read time.

const KEY_PREFIX = 'phlik_web:history';
const DEFAULT_LIMIT = 10;

export type HistoryFeature = 'resume' | 'interview' | 'journal';

export interface HistoryEntry<T = unknown> {
  id: string;
  ts: number;
  /// Short label shown in the dropdown — e.g. "Senior Engineer · 18 May".
  label: string;
  /// Raw AI output text (markdown / JSON / plain).
  output: string;
  /// Original input echo for re-loading the form.
  input: T;
}

function key(feature: HistoryFeature): string {
  return `${KEY_PREFIX}:${feature}`;
}

function safeParse<T>(raw: string | null): HistoryEntry<T>[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as HistoryEntry<T>[]) : [];
  } catch {
    return [];
  }
}

export function loadHistory<T = unknown>(
  feature: HistoryFeature,
): HistoryEntry<T>[] {
  if (typeof localStorage === 'undefined') return [];
  return safeParse<T>(localStorage.getItem(key(feature)));
}

export function saveHistoryEntry<T>(
  feature: HistoryFeature,
  entry: Omit<HistoryEntry<T>, 'id' | 'ts'>,
  limit = DEFAULT_LIMIT,
): HistoryEntry<T> {
  const id =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);
  const full: HistoryEntry<T> = { id, ts: Date.now(), ...entry };
  if (typeof localStorage === 'undefined') return full;
  const list = [full, ...loadHistory<T>(feature)].slice(0, limit);
  try {
    localStorage.setItem(key(feature), JSON.stringify(list));
  } catch {
    // Quota exceeded — drop oldest aggressively and retry once.
    try {
      localStorage.setItem(key(feature), JSON.stringify(list.slice(0, 3)));
    } catch {
      // Give up silently — history is best-effort.
    }
  }
  return full;
}

export function deleteHistoryEntry(
  feature: HistoryFeature,
  id: string,
): void {
  if (typeof localStorage === 'undefined') return;
  const next = loadHistory(feature).filter((e) => e.id !== id);
  localStorage.setItem(key(feature), JSON.stringify(next));
}

export function clearHistory(feature: HistoryFeature): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.removeItem(key(feature));
}

export function formatTs(ts: number, lang: string): string {
  const d = new Date(ts);
  try {
    return d.toLocaleString(lang || 'en', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return d.toISOString().slice(0, 16).replace('T', ' ');
  }
}
