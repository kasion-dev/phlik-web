import { getIdentity } from './identity';

/// Calls the same Kasion AI gateway as the Flutter app.
/// Server worker: packages/ai-router/src/index.ts
///
/// Multi-app discipline: every payload carries `app_id: 'phlik_career'` so
/// session HMAC isolation, billing, and rate limits scope per-app on a
/// shared user account.

const GATEWAY_URL =
  import.meta.env.PUBLIC_AI_GATEWAY_URL ??
  'https://kasion-ai-router-prod.kasidit-wans.workers.dev';

const APP_ID = 'phlik_career';

export interface InvokeUsage {
  prompt_tokens?: number;
  completion_tokens?: number;
  cost_usd?: number;
}

export interface InvokeResponse {
  output: string;
  model_used: string;
  usage?: InvokeUsage;
  cached?: boolean;
}

export interface InvokeError {
  error: string;
  attempts?: string[];
}

export class AiClient {
  constructor(private readonly token: string) {}

  static fromIdentity(): AiClient {
    return new AiClient(getIdentity().devToken);
  }

  async invoke(
    task: string,
    input: Record<string, unknown>,
    sessionId?: string,
  ): Promise<InvokeResponse> {
    const res = await fetch(`${GATEWAY_URL}/v1/invoke`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${this.token}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        app_id: APP_ID,
        task,
        input,
        ...(sessionId ? { session_id: sessionId } : {}),
      }),
    });
    const data = (await res.json().catch(() => ({}))) as
      | InvokeResponse
      | InvokeError;
    if (!res.ok || 'error' in data) {
      const msg =
        'error' in data ? data.error : `gateway_${res.status}`;
      throw new Error(msg);
    }
    return data;
  }

  // High-level helpers — match Flutter side payload shape so server prompts
  // hit the same code path.

  resumePolish(args: {
    currentRole: string;
    targetRole: string;
    bullets: string[];
    tone?: 'professional' | 'casual';
    lang?: 'th' | 'en' | 'es' | 'zh' | 'auto';
  }) {
    return this.invoke('resume_polish', {
      current_role: args.currentRole,
      target_role: args.targetRole,
      bullets: args.bullets,
      tone: args.tone ?? 'professional',
      lang: args.lang ?? 'auto',
    });
  }

  interviewPrep(args: {
    role: string;
    industry: string;
    targetSalaryMinThb: number;
    targetSalaryMaxThb?: number;
    lang?: 'th' | 'en' | 'es' | 'zh' | 'auto';
  }) {
    return this.invoke('interview_prep', {
      role: args.role,
      industry: args.industry,
      target_salary_min_thb: args.targetSalaryMinThb,
      target_salary_max_thb: args.targetSalaryMaxThb,
      lang: args.lang ?? 'auto',
    });
  }

  moodReflect(args: {
    emotion: string;
    event: string;
    last7dTrend?: string[];
    lang?: 'th' | 'en' | 'es' | 'zh' | 'auto';
  }) {
    return this.invoke('mood_reflect', {
      emotion: args.emotion,
      event: args.event,
      last_7d_trend: args.last7dTrend ?? [],
      lang: args.lang ?? 'auto',
    });
  }
}
