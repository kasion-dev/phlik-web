/// Lightweight i18n — TH default, EN/ES/ZH supported.
/// Mirrors apps/phlik_career/lib/l10n/app_*.arb keys (subset that the web
/// surface actually uses; full ARB parity is overkill for an MVP companion).

export type Lang = 'th' | 'en' | 'es' | 'zh';

const KEY_LANG = 'phlik_web:lang';

export function detectLang(): Lang {
  if (typeof localStorage !== 'undefined') {
    const saved = localStorage.getItem(KEY_LANG);
    if (saved === 'th' || saved === 'en' || saved === 'es' || saved === 'zh') {
      return saved;
    }
  }
  if (typeof navigator !== 'undefined') {
    const code = navigator.language.slice(0, 2).toLowerCase();
    if (code === 'th') return 'th';
    if (code === 'es') return 'es';
    if (code === 'zh') return 'zh';
  }
  return 'en';
}

export function setLang(l: Lang): void {
  if (typeof localStorage !== 'undefined') localStorage.setItem(KEY_LANG, l);
}

interface Strings {
  appTitle: string;
  tagline: string;
  hero: string;
  ctaResume: string;
  ctaInterview: string;
  ctaJournal: string;
  resumeHeadline: string;
  resumeSub: string;
  resumeCurrentRole: string;
  resumeTargetRole: string;
  resumeBullets: string;
  resumeBulletsHint: string;
  resumeTone: string;
  toneProfessional: string;
  toneCasual: string;
  polish: string;
  polishing: string;
  interviewHeadline: string;
  interviewSub: string;
  interviewRole: string;
  interviewIndustry: string;
  interviewSalaryMin: string;
  interviewSalaryMax: string;
  generate: string;
  generating: string;
  journalHeadline: string;
  journalSub: string;
  journalMood: string;
  journalEvent: string;
  journalEventHint: string;
  reflect: string;
  reflecting: string;
  result: string;
  copy: string;
  copied: string;
  errorPrefix: string;
  langLabel: string;
  betaPill: string;
  freeBeta: string;
}

const STRINGS: Record<Lang, Strings> = {
  th: {
    appTitle: 'พลิกอาชีพ',
    tagline: 'AI ช่วยพลิกอาชีพ — ไม่ใช่บอกให้ลาออก',
    hero: 'ขัดเรซูเม่ · ฝึกสัมภาษณ์ · จดบันทึกอาชีพ — ทุกอย่างฟรีในช่วงเบต้า',
    ctaResume: 'ขัดเรซูเม่',
    ctaInterview: 'ฝึกสัมภาษณ์',
    ctaJournal: 'บันทึกอาชีพ',
    resumeHeadline: 'วาง bullet เรซูเม่ — AI ขัดให้',
    resumeSub: 'คะแนน ATS + เขียน bullet ใหม่ + ปรับโทน',
    resumeCurrentRole: 'ตำแหน่งปัจจุบัน',
    resumeTargetRole: 'ตำแหน่งเป้าหมาย',
    resumeBullets: 'Bullet ปัจจุบัน (1 บรรทัด/หนึ่ง)',
    resumeBulletsHint: 'แต่ละบรรทัด = 1 bullet',
    resumeTone: 'โทน',
    toneProfessional: 'ทางการ',
    toneCasual: 'สบายๆ',
    polish: 'ขัดเรซูเม่',
    polishing: 'กำลังขัด...',
    interviewHeadline: 'AI ฝึกสัมภาษณ์',
    interviewSub: 'ตำแหน่ง + อุตสาหกรรม → AI สร้างคำถาม + ตัวอย่างคำตอบ',
    interviewRole: 'ตำแหน่ง',
    interviewIndustry: 'อุตสาหกรรม / บริษัท',
    interviewSalaryMin: 'เงินเดือนเป้า ขั้นต่ำ (THB)',
    interviewSalaryMax: 'เงินเดือนเป้า สูงสุด (THB · ไม่บังคับ)',
    generate: 'สร้างคำถาม',
    generating: 'กำลังสร้าง...',
    journalHeadline: 'จดบันทึกอาชีพ 5 นาที',
    journalSub: 'อารมณ์ + เหตุการณ์ → AI สะท้อนให้',
    journalMood: 'อารมณ์วันนี้',
    journalEvent: 'เกิดอะไรขึ้น?',
    journalEventHint: 'เล่าสั้นๆ ว่าเหตุการณ์อะไรทำให้รู้สึกแบบนี้',
    reflect: 'ให้ AI สะท้อน',
    reflecting: 'กำลังสะท้อน...',
    result: 'ผลลัพธ์',
    copy: 'คัดลอก',
    copied: 'คัดลอกแล้ว',
    errorPrefix: 'เกิดข้อผิดพลาด',
    langLabel: 'ภาษา',
    betaPill: 'beta',
    freeBeta: 'ฟรีช่วงเบต้า · ไม่ต้องสมัครสมาชิก',
  },
  en: {
    appTitle: 'Phlik Career',
    tagline: "AI to help you switch jobs — not to talk you into quitting",
    hero: 'Polish your resume · prep for interviews · journal your career — free during beta',
    ctaResume: 'Polish resume',
    ctaInterview: 'Interview prep',
    ctaJournal: 'Career journal',
    resumeHeadline: 'Drop your resume bullets — AI polishes them',
    resumeSub: 'ATS score + bullet rewrites + tone adjust',
    resumeCurrentRole: 'Current role',
    resumeTargetRole: 'Target role',
    resumeBullets: 'Current bullets (one per line)',
    resumeBulletsHint: 'One bullet per line',
    resumeTone: 'Tone',
    toneProfessional: 'Professional',
    toneCasual: 'Casual',
    polish: 'Polish',
    polishing: 'Polishing...',
    interviewHeadline: 'AI Interview Coach',
    interviewSub: 'Role + industry → AI generates questions + sample answers',
    interviewRole: 'Role',
    interviewIndustry: 'Industry / company',
    interviewSalaryMin: 'Target salary min (THB)',
    interviewSalaryMax: 'Target salary max (THB · optional)',
    generate: 'Generate',
    generating: 'Generating...',
    journalHeadline: '5-minute career journal',
    journalSub: 'Mood + event → AI reflects',
    journalMood: 'Mood today',
    journalEvent: 'What happened?',
    journalEventHint: 'Briefly: what triggered this feeling?',
    reflect: 'Get AI reflection',
    reflecting: 'Reflecting...',
    result: 'Result',
    copy: 'Copy',
    copied: 'Copied',
    errorPrefix: 'Something went wrong',
    langLabel: 'Language',
    betaPill: 'beta',
    freeBeta: 'Free during beta · no signup required',
  },
  es: {
    appTitle: 'Phlik Career',
    tagline: 'IA que te ayuda a cambiar de trabajo — no te dice que renuncies',
    hero: 'Pulir CV · prep entrevistas · diario de carrera — gratis en beta',
    ctaResume: 'Pulir CV',
    ctaInterview: 'Prep entrevista',
    ctaJournal: 'Diario',
    resumeHeadline: 'Pega tus bullets — la IA los pule',
    resumeSub: 'Puntaje ATS + reescritura + tono',
    resumeCurrentRole: 'Rol actual',
    resumeTargetRole: 'Rol objetivo',
    resumeBullets: 'Bullets actuales (uno por línea)',
    resumeBulletsHint: 'Un bullet por línea',
    resumeTone: 'Tono',
    toneProfessional: 'Profesional',
    toneCasual: 'Casual',
    polish: 'Pulir',
    polishing: 'Puliendo...',
    interviewHeadline: 'Coach de entrevistas IA',
    interviewSub: 'Rol + industria → IA genera preguntas + respuestas',
    interviewRole: 'Rol',
    interviewIndustry: 'Industria / empresa',
    interviewSalaryMin: 'Salario objetivo min (THB)',
    interviewSalaryMax: 'Salario objetivo max (THB · opcional)',
    generate: 'Generar',
    generating: 'Generando...',
    journalHeadline: 'Diario de carrera de 5 min',
    journalSub: 'Ánimo + evento → IA refleja',
    journalMood: 'Ánimo hoy',
    journalEvent: '¿Qué pasó?',
    journalEventHint: 'Cuenta brevemente qué provocó esta emoción',
    reflect: 'Obtener reflexión IA',
    reflecting: 'Reflexionando...',
    result: 'Resultado',
    copy: 'Copiar',
    copied: 'Copiado',
    errorPrefix: 'Algo salió mal',
    langLabel: 'Idioma',
    betaPill: 'beta',
    freeBeta: 'Gratis en beta · sin registro',
  },
  zh: {
    appTitle: '翻转职涯',
    tagline: 'AI 助你换工作 — 不是劝你辞职',
    hero: '润色简历 · 面试准备 · 职涯日志 — 测试期免费',
    ctaResume: '润色简历',
    ctaInterview: '面试准备',
    ctaJournal: '职涯日志',
    resumeHeadline: '粘贴简历要点 — AI 润色',
    resumeSub: 'ATS 评分 + 要点重写 + 语气调整',
    resumeCurrentRole: '当前职位',
    resumeTargetRole: '目标职位',
    resumeBullets: '当前要点 (每行一条)',
    resumeBulletsHint: '每行 = 一条要点',
    resumeTone: '语气',
    toneProfessional: '专业',
    toneCasual: '随性',
    polish: '润色',
    polishing: '正在润色...',
    interviewHeadline: 'AI 面试教练',
    interviewSub: '职位 + 行业 → AI 生成问题 + 范例答案',
    interviewRole: '职位',
    interviewIndustry: '行业 / 公司',
    interviewSalaryMin: '目标薪资 最低 (THB)',
    interviewSalaryMax: '目标薪资 最高 (THB · 可选)',
    generate: '生成',
    generating: '正在生成...',
    journalHeadline: '5 分钟职涯日志',
    journalSub: '心情 + 事件 → AI 反思',
    journalMood: '今天心情',
    journalEvent: '发生了什么?',
    journalEventHint: '简单说说是什么触发了这种感受',
    reflect: '获取 AI 反思',
    reflecting: '正在反思...',
    result: '结果',
    copy: '复制',
    copied: '已复制',
    errorPrefix: '出错了',
    langLabel: '语言',
    betaPill: '测试',
    freeBeta: '测试期免费 · 无需注册',
  },
};

export function t(lang: Lang): Strings {
  return STRINGS[lang];
}
