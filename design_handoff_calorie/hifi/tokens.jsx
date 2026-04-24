// ─── Calorie Hi-Fi Design System ──────────────────────────────
// Cute + natural + friendly. Cozy forest picnic energy.

(function () {
  // Read tweaks from localStorage (set by main HTML)
  const getTweak = (k, d) => {
    try { return (window.CAL_TWEAKS && window.CAL_TWEAKS[k]) ?? d; }
    catch { return d; }
  };

  const dark = getTweak('dark', false);
  const paperTone = getTweak('paperTone', 'warm');   // warm | neutral | cool
  const cuteLevel = getTweak('cuteLevel', 'cute');   // cute | balanced | refined

  // ── Paper/bg palettes ─────────────────────────────────────────
  const paperMap = {
    warm:    { paper: '#eaf1e1', paperDeep: '#d9e5c9', card: '#f5f9ee', cardAlt: '#d7e6bd', ink: '#1f2a1e', glow: '#c5dba8' },
    neutral: { paper: '#f0efe7', paperDeep: '#e3e1d3', card: '#f8f7f0', cardAlt: '#d9d5c3', ink: '#2a281f', glow: '#cfcab2' },
    cool:    { paper: '#e6edf1', paperDeep: '#d2dce3', card: '#f1f5f8', cardAlt: '#c1d0da', ink: '#1e252b', glow: '#b6cad6' },
  };
  const darkMap = {
    paper: '#1b2217', paperDeep: '#131812', card: '#242d1f', cardAlt: '#2f3a28', ink: '#f2efe4', glow: '#3a4a31',
  };
  const p = dark ? darkMap : paperMap[paperTone];

  // ── Nutrient palette (tweakable) ─────────────────────────────
  const carb    = getTweak('carb',    '#f4b942'); // warm yellow
  const protein = getTweak('protein', '#e07a5f'); // coral
  const fat     = getTweak('fat',     '#c79fe0'); // soft lavender
  const vita    = getTweak('vita',    '#6bbf8a'); // sage

  // ── Fonts ────────────────────────────────────────────────────
  const fontSets = {
    cute: {
      sans:    "'Gaegu', 'Quicksand', 'Pretendard', system-ui, sans-serif",
      display: "'Gaegu', 'Fredoka', cursive",
      mono:    "'Gaegu', 'JetBrains Mono', ui-monospace, monospace",
      num:     "'Fredoka', 'Gaegu', system-ui, sans-serif",
    },
    balanced: {
      sans:    "'Quicksand', 'Pretendard', system-ui, sans-serif",
      display: "'Fredoka', 'Quicksand', cursive",
      mono:    "'JetBrains Mono', ui-monospace, monospace",
      num:     "'Fredoka', 'Quicksand', system-ui, sans-serif",
    },
    refined: {
      sans:    "'Pretendard', -apple-system, system-ui, sans-serif",
      display: "'Pretendard', system-ui, sans-serif",
      mono:    "'JetBrains Mono', ui-monospace, monospace",
      num:     "'Pretendard', system-ui, sans-serif",
    },
  };
  const F = fontSets[cuteLevel];

  const ink = p.ink;
  const inkRgb = dark ? '242,239,228' : (paperTone === 'warm' ? '31,42,30' : paperTone === 'cool' ? '30,37,43' : '42,40,31');
  const rgba = (a) => `rgba(${inkRgb},${a})`;

  window.CAL = {
    // fonts
    fontSans: F.sans, fontDisplay: F.display, fontMono: F.mono, fontNum: F.num,

    // surfaces
    paper: p.paper, paperDeep: p.paperDeep, card: p.card, cardAlt: p.cardAlt, glow: p.glow,

    // ink
    ink, ink90: rgba(0.90), ink70: rgba(0.70), ink55: rgba(0.55), ink40: rgba(0.40),
    ink25: rgba(0.25), ink15: rgba(0.15), ink08: rgba(0.08), ink04: rgba(0.04),

    // nutrients
    carb, protein, fat, vita,
    carbSoft:    carb + '33',
    proteinSoft: protein + '33',
    fatSoft:     fat + '33',
    vitaSoft:    vita + '33',

    // semantic
    bg: p.paper,
    danger: '#e07a5f',
    success: '#6bbf8a',

    // radii
    rXs: 8, rSm: 14, rMd: 20, rLg: 28, rXl: 36, rPill: 999,

    // shadows — soft, diffused, never harsh
    shadowSm: dark ? '0 2px 8px rgba(0,0,0,0.25)' : '0 2px 8px rgba(31,42,30,0.06)',
    shadowMd: dark ? '0 6px 20px rgba(0,0,0,0.35)' : '0 6px 20px rgba(31,42,30,0.08)',
    shadowLg: dark ? '0 14px 40px rgba(0,0,0,0.45)' : '0 14px 40px rgba(31,42,30,0.10)',
    shadowSticker: dark ? '0 4px 14px rgba(0,0,0,0.45)' : '0 4px 14px rgba(31,42,30,0.14)',

    // flags
    dark, paperTone, cuteLevel,
  };
})();

// ─── Inject global styles + fonts ────────────────────────────────
if (typeof document !== 'undefined' && !document.getElementById('cal-hifi-styles')) {
  const fl = document.createElement('link');
  fl.rel = 'stylesheet';
  fl.href = 'https://fonts.googleapis.com/css2?family=Gaegu:wght@400;700&family=Quicksand:wght@400;500;600;700&family=Fredoka:wght@400;500;600;700&family=Pretendard:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap';
  document.head.appendChild(fl);

  const C = window.CAL;
  const s = document.createElement('style');
  s.id = 'cal-hifi-styles';
  s.textContent = `
    .cal { font-family: ${C.fontSans}; color: ${C.ink}; line-height: 1.45; }
    .cal-display { font-family: ${C.fontDisplay}; }
    .cal-num { font-family: ${C.fontNum}; font-variant-numeric: tabular-nums; letter-spacing: -0.02em; }
    .cal-mono { font-family: ${C.fontMono}; }
    .cal * { box-sizing: border-box; }
    .cal ::-webkit-scrollbar { display: none; }
    .cal-scroll { overflow-y: auto; -webkit-overflow-scrolling: touch; }
    .cal-scroll::-webkit-scrollbar { display: none; }

    /* sticker hover interaction */
    .cal-sticker { transition: transform 0.18s cubic-bezier(.2,.8,.4,1); }
    .cal-sticker:hover { transform: translateY(-2px) rotate(var(--r,0deg)) scale(1.03); }

    /* soft pulse for AI/loading states */
    @keyframes cal-pulse { 0%,100% { opacity: 0.5; } 50% { opacity: 1; } }
    .cal-pulse { animation: cal-pulse 1.4s ease-in-out infinite; }

    @keyframes cal-spin { to { transform: rotate(360deg); } }
    .cal-spin { animation: cal-spin 1.2s linear infinite; }

    @keyframes cal-bob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
    .cal-bob { animation: cal-bob 2.4s ease-in-out infinite; }

    /* cute underline */
    .cal-wavy {
      text-decoration-line: underline;
      text-decoration-style: wavy;
      text-decoration-color: ${C.vita};
      text-decoration-thickness: 1.5px;
      text-underline-offset: 4px;
    }
  `;
  document.head.appendChild(s);
}
