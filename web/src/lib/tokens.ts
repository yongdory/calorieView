export const tokens = {
  font: {
    sans: "'Gaegu', 'Quicksand', 'Pretendard', system-ui, sans-serif",
    display: "'Gaegu', 'Fredoka', cursive",
    num: "'Fredoka', 'Gaegu', system-ui, sans-serif",
    mono: "'JetBrains Mono', ui-monospace, monospace",
  },

  color: {
    paper: '#eaf1e1',
    paperDeep: '#d9e5c9',
    card: '#f5f9ee',
    cardAlt: '#d7e6bd',
    glow: '#c5dba8',

    ink: '#1f2a1e',
    ink90: 'rgba(31,42,30,0.90)',
    ink70: 'rgba(31,42,30,0.70)',
    ink55: 'rgba(31,42,30,0.55)',
    ink40: 'rgba(31,42,30,0.40)',
    ink25: 'rgba(31,42,30,0.25)',
    ink15: 'rgba(31,42,30,0.15)',
    ink08: 'rgba(31,42,30,0.08)',
    ink04: 'rgba(31,42,30,0.04)',

    carb: '#f4b942',
    protein: '#e07a5f',
    fat: '#c79fe0',
    vita: '#6bbf8a',

    carbSoft: '#f4b94233',
    proteinSoft: '#e07a5f33',
    fatSoft: '#c79fe033',
    vitaSoft: '#6bbf8a33',

    danger: '#e07a5f',
    success: '#6bbf8a',
  },

  radius: { xs: 8, sm: 14, md: 20, lg: 28, xl: 36, pill: 999 },

  shadow: {
    sm: '0 2px 8px rgba(31,42,30,0.06)',
    md: '0 6px 20px rgba(31,42,30,0.08)',
    lg: '0 14px 40px rgba(31,42,30,0.10)',
    sticker: '0 4px 14px rgba(31,42,30,0.14)',
  },
} as const;

export type Tokens = typeof tokens;
