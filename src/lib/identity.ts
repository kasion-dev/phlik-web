/// Anonymous device-stable identity for the web client.
///
/// Mirrors apps/phlik_career/lib/core/identity/user_identity.dart — UUID
/// generated once per browser, stored in localStorage. Used to build
/// `dev-<userId>-<tier>` tokens for the AI gateway during the stealth phase
/// (BETA_MODE=true on production worker).

const KEY_USER_ID = 'phlik_web:user_id';
const KEY_TIER = 'phlik_web:tier';

function uuid(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID().replace(/-/g, '').slice(0, 16);
  }
  // Fallback for very old browsers.
  let s = '';
  for (let i = 0; i < 16; i++) s += Math.floor(Math.random() * 16).toString(16);
  return s;
}

export interface UserIdentity {
  userId: string;
  tier: 'free' | 'pro' | 'enterprise';
  devToken: string;
}

export function getIdentity(): UserIdentity {
  if (typeof localStorage === 'undefined') {
    // SSR fallback — caller should re-hydrate client-side.
    const stub = uuid();
    return { userId: stub, tier: 'free', devToken: `dev-${stub}-free` };
  }
  let userId = localStorage.getItem(KEY_USER_ID);
  if (!userId) {
    userId = uuid();
    localStorage.setItem(KEY_USER_ID, userId);
  }
  const tier =
    (localStorage.getItem(KEY_TIER) as UserIdentity['tier'] | null) ?? 'free';
  return { userId, tier, devToken: `dev-${userId}-${tier}` };
}

export function setTier(tier: UserIdentity['tier']): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(KEY_TIER, tier);
}
