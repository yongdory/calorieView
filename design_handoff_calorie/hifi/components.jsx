// ─── Shared Hi-Fi components ──────────────────────────────────

// iPhone-ish frame, softer than real
window.Phone = function Phone({ children, width = 340, height = 720, statusDark = false, navOnPaper = true, style = {} }) {
  const C = window.CAL;
  return (
    <div style={{
      width, height, background: C.ink, borderRadius: 52, padding: 9,
      boxShadow: C.shadowLg,
      position: 'relative',
      ...style,
    }}>
      <div style={{
        width: '100%', height: '100%',
        background: C.paper,
        borderRadius: 44, overflow: 'hidden', position: 'relative',
        color: C.ink,
      }}>
        {/* status bar */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 40, zIndex: 30,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 26px 0', fontSize: 13, fontWeight: 700,
          color: statusDark ? '#fff' : C.ink, pointerEvents: 'none',
          fontFamily: C.fontNum,
        }}>
          <span>9:41</span>
          <span style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
            <svg width="16" height="10" viewBox="0 0 16 10" fill="currentColor"><path d="M1 8h1.5v1H1zM4 6h1.5v3H4zM7 4h1.5v5H7zM10 2h1.5v7h-1.5zM13 0h1.5v9H13z"/></svg>
            <svg width="14" height="9" viewBox="0 0 14 9" fill="currentColor"><path d="M7 1.5C5 1.5 3.2 2.3 2 3.5l1.4 1.4C4.3 4 5.6 3.5 7 3.5s2.7.5 3.6 1.4L12 3.5C10.8 2.3 9 1.5 7 1.5z"/><circle cx="7" cy="7" r="1.2"/></svg>
            <span style={{ display: 'inline-block', width: 22, height: 10, border: `1.2px solid currentColor`, borderRadius: 3, position: 'relative' }}>
              <span style={{ position: 'absolute', inset: 1.5, background: 'currentColor', borderRadius: 1.5, width: '82%' }} />
              <span style={{ position: 'absolute', left: '100%', top: '30%', height: '40%', width: 1.5, background: 'currentColor', borderRadius: 1, marginLeft: 1 }} />
            </span>
          </span>
        </div>
        {/* dynamic island */}
        <div style={{
          position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)',
          width: 100, height: 28, background: '#000', borderRadius: 16, zIndex: 31,
        }} />
        {/* content */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

// ─── Ring ─────────────────────────────────────────────────────
window.Ring = function Ring({ value = 0.5, color, size = 100, stroke = 10, track, children, rotation = -90 }) {
  const C = window.CAL;
  const v = value > 1 ? value / 100 : value;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = Math.max(0, Math.min(1, v)) * c;
  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'inline-block' }}>
      <svg width={size} height={size} style={{ transform: `rotate(${rotation}deg)` }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={track || C.ink08} strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color || C.ink} strokeWidth={stroke}
          strokeDasharray={`${dash} ${c}`} strokeLinecap="round" />
      </svg>
      {children && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', textAlign: 'center', lineHeight: 1.05 }}>
          {children}
        </div>
      )}
    </div>
  );
};

// ─── MultiRing (nested rings) ─────────────────────────────────
window.MultiRing = function MultiRing({ rings = [], size = 180, stroke = 10, gap = 4, children }) {
  const C = window.CAL;
  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'inline-block' }}>
      {rings.map((r, i) => {
        const s = size - i * (stroke + gap) * 2;
        return (
          <div key={i} style={{ position: 'absolute', top: i*(stroke+gap), left: i*(stroke+gap) }}>
            <window.Ring value={r.value} color={r.color} size={s} stroke={stroke} track={C.ink08} />
          </div>
        );
      })}
      {children && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          {children}
        </div>
      )}
    </div>
  );
};

// ─── Sticker — rotated, soft shadow, layered ─────────────────
window.Sticker = function Sticker({ children, bg, color, rot = 0, size, style = {}, onClick }) {
  const C = window.CAL;
  return (
    <div className="cal-sticker" onClick={onClick}
      style={{
        '--r': rot + 'deg',
        transform: `rotate(${rot}deg)`,
        background: bg || C.card, color: color || C.ink,
        borderRadius: 16, padding: '8px 14px',
        boxShadow: C.shadowSticker,
        display: 'inline-flex', alignItems: 'center', gap: 6,
        fontWeight: 700, fontSize: size || 14,
        border: `2.5px solid ${C.paper}`,
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}>
      {children}
    </div>
  );
};

// ─── Chip ─────────────────────────────────────────────────────
window.Chip = function Chip({ children, color, filled, sm, style = {} }) {
  const C = window.CAL;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: sm ? '3px 10px' : '5px 12px',
      borderRadius: C.rPill,
      background: filled ? (color || C.ink) : (color ? color + '22' : C.ink04),
      color: filled ? '#fff' : (color || C.ink70),
      border: filled ? 'none' : `1.2px solid ${color ? color + '44' : C.ink15}`,
      fontSize: sm ? 11 : 12, fontWeight: 700,
      whiteSpace: 'nowrap',
      ...style,
    }}>{children}</span>
  );
};

// ─── NutrientDot ──────────────────────────────────────────────
window.Dot = function Dot({ color, size = 8 }) {
  return <span style={{ display: 'inline-block', width: size, height: size, borderRadius: size/2, background: color, flexShrink: 0 }} />;
};

// ─── IconButton ───────────────────────────────────────────────
window.IconBtn = function IconBtn({ children, onClick, size = 40, bg, fg, style = {} }) {
  const C = window.CAL;
  return (
    <button onClick={onClick} style={{
      width: size, height: size, borderRadius: size/2,
      background: bg || C.card, color: fg || C.ink,
      border: `1px solid ${C.ink08}`, cursor: 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.45, fontWeight: 600, flexShrink: 0,
      boxShadow: C.shadowSm,
      ...style,
    }}>{children}</button>
  );
};

// ─── Primary button ───────────────────────────────────────────
window.BigBtn = function BigBtn({ children, onClick, variant = 'primary', style = {} }) {
  const C = window.CAL;
  const styles = {
    primary: { bg: C.ink, color: C.paper },
    accent:  { bg: C.vita, color: '#14231a' },
    ghost:   { bg: 'transparent', color: C.ink, border: `1.5px solid ${C.ink15}` },
  };
  const s = styles[variant];
  return (
    <button onClick={onClick} style={{
      height: 54, padding: '0 22px', borderRadius: C.rPill,
      background: s.bg, color: s.color, border: s.border || 'none',
      fontSize: 16, fontWeight: 700, fontFamily: 'inherit',
      cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      boxShadow: variant === 'primary' ? C.shadowMd : 'none',
      width: '100%',
      ...style,
    }}>{children}</button>
  );
};

// ─── Food photo placeholder (or real image) ──────────────────
window.FoodImg = function FoodImg({ src, emoji, label, size = 80, radius, style = {} }) {
  const C = window.CAL;
  const r = radius ?? C.rMd;
  if (src) {
    return <div style={{ width: size, height: size, borderRadius: r, backgroundImage: `url(${src})`, backgroundSize: 'cover', backgroundPosition: 'center', flexShrink: 0, ...style }} />;
  }
  // emoji-based cute placeholder
  return (
    <div style={{
      width: size, height: size, borderRadius: r,
      background: `radial-gradient(circle at 30% 25%, ${C.cardAlt}, ${C.paperDeep})`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.48, flexShrink: 0, ...style,
    }}>{emoji || '🍽'}</div>
  );
};

// ─── Card (soft) ─────────────────────────────────────────────
window.Card = function Card({ children, style = {}, onClick, raised }) {
  const C = window.CAL;
  return (
    <div onClick={onClick} style={{
      background: C.card, borderRadius: C.rLg,
      padding: 18,
      border: `1px solid ${C.ink08}`,
      boxShadow: raised ? C.shadowMd : 'none',
      cursor: onClick ? 'pointer' : 'default',
      ...style,
    }}>{children}</div>
  );
};

// ─── Tab bar (bottom nav) ────────────────────────────────────
window.TabBar = function TabBar({ active = 'home', onTab }) {
  const C = window.CAL;
  const tabs = [
    { id: 'home',    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11.5 12 4l9 7.5"/><path d="M5 10v10h14V10"/></svg>, label: '홈' },
    { id: 'history', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="3"/><path d="M3 10h18M9 4v4M15 4v4"/></svg>, label: '기록' },
    { id: 'camera',  center: true },
    { id: 'recipe',  icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2 15 9l7 .5-5.5 4.5L18 21l-6-4-6 4 1.5-7L2 9.5 9 9z"/></svg>, label: '추천' },
    { id: 'profile', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 22c0-4.4 3.6-8 8-8s8 3.6 8 8"/></svg>, label: '프로필' },
  ];
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 0,
      height: 84, paddingBottom: 18,
      display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around',
      background: window.CAL.dark ? 'rgba(27,34,23,0.92)' : 'rgba(234,241,225,0.92)',
      backdropFilter: 'blur(16px)',
      borderTop: `1px solid ${C.ink08}`,
      zIndex: 20,
    }}>
      {tabs.map(t => t.center ? (
        <button key={t.id} onClick={() => onTab && onTab(t.id)} style={{
          width: 60, height: 60, borderRadius: 30, marginBottom: 10,
          background: C.ink, color: C.paper, border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 6px 18px rgba(0,0,0,0.2)',
        }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/>
            <circle cx="12" cy="13" r="3.5"/>
          </svg>
        </button>
      ) : (
        <button key={t.id} onClick={() => onTab && onTab(t.id)} style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
          color: active === t.id ? C.ink : C.ink40,
          fontSize: 11, fontWeight: 700, flex: 1,
          background: 'transparent', border: 'none', cursor: 'pointer',
          fontFamily: 'inherit',
        }}>
          {t.icon}
          <span>{t.label}</span>
        </button>
      ))}
    </div>
  );
};

// ─── Section label (small caps) ──────────────────────────────
window.Label = function Label({ children, color, style = {} }) {
  const C = window.CAL;
  return <div className="cal-mono" style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.2, color: color || C.ink55, textTransform: 'uppercase', ...style }}>{children}</div>;
};

// ─── Nutrient stack (carb/protein/fat compact) ──────────────
window.NutrientStack = function NutrientStack({ c, p, f, v, compact }) {
  const C = window.CAL;
  const items = [
    { k: '탄', val: c, color: C.carb },
    { k: '단', val: p, color: C.protein },
    { k: '지', val: f, color: C.fat },
  ];
  if (v !== undefined) items.push({ k: '비', val: v, color: C.vita });
  return (
    <div style={{ display: 'flex', gap: compact ? 8 : 12 }}>
      {items.map(x => (
        <div key={x.k} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <window.Dot color={x.color} size={compact ? 7 : 9} />
          <span style={{ fontSize: compact ? 11 : 12, fontWeight: 700, color: C.ink70 }}>{x.k} {x.val}g</span>
        </div>
      ))}
    </div>
  );
};

// Export to window
Object.assign(window, { Phone: window.Phone, Ring: window.Ring, MultiRing: window.MultiRing,
  Sticker: window.Sticker, Chip: window.Chip, Dot: window.Dot, IconBtn: window.IconBtn,
  BigBtn: window.BigBtn, FoodImg: window.FoodImg, Card: window.Card, TabBar: window.TabBar,
  Label: window.Label, NutrientStack: window.NutrientStack });
