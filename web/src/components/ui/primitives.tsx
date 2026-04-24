import type { CSSProperties, ReactNode, MouseEventHandler } from 'react';
import { tokens } from '../../lib/tokens';

const T = tokens;

export function Card({
  children, style, onClick, raised,
}: { children: ReactNode; style?: CSSProperties; onClick?: MouseEventHandler; raised?: boolean }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: T.color.card,
        borderRadius: T.radius.lg,
        padding: 18,
        border: `1px solid ${T.color.ink08}`,
        boxShadow: raised ? T.shadow.md : 'none',
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function BigBtn({
  children, onClick, variant = 'primary', disabled, style, type = 'button',
}: {
  children: ReactNode;
  onClick?: MouseEventHandler;
  variant?: 'primary' | 'accent' | 'ghost';
  disabled?: boolean;
  style?: CSSProperties;
  type?: 'button' | 'submit';
}) {
  const v = {
    primary: { bg: T.color.ink, color: T.color.paper, border: 'none' },
    accent: { bg: T.color.vita, color: '#14231a', border: 'none' },
    ghost: { bg: 'transparent', color: T.color.ink, border: `1.5px solid ${T.color.ink15}` },
  }[variant];
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        height: 54,
        padding: '0 22px',
        borderRadius: T.radius.pill,
        background: v.bg,
        color: v.color,
        border: v.border,
        fontSize: 16,
        fontWeight: 700,
        fontFamily: T.font.sans,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.55 : 1,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        boxShadow: variant === 'primary' ? T.shadow.md : 'none',
        width: '100%',
        ...style,
      }}
    >
      {children}
    </button>
  );
}

export function IconBtn({
  children, onClick, size = 40, bg, fg, style,
}: {
  children: ReactNode;
  onClick?: MouseEventHandler;
  size?: number;
  bg?: string;
  fg?: string;
  style?: CSSProperties;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        background: bg ?? T.color.card,
        color: fg ?? T.color.ink,
        border: `1px solid ${T.color.ink08}`,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.45,
        fontWeight: 600,
        flexShrink: 0,
        boxShadow: T.shadow.sm,
        ...style,
      }}
    >
      {children}
    </button>
  );
}

export function Chip({
  children, color, filled, sm, style,
}: { children: ReactNode; color?: string; filled?: boolean; sm?: boolean; style?: CSSProperties }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        padding: sm ? '3px 10px' : '5px 12px',
        borderRadius: T.radius.pill,
        background: filled ? (color ?? T.color.ink) : (color ? color + '22' : T.color.ink04),
        color: filled ? '#fff' : (color ?? T.color.ink70),
        border: filled ? 'none' : `1.2px solid ${color ? color + '44' : T.color.ink15}`,
        fontSize: sm ? 11 : 12,
        fontWeight: 700,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {children}
    </span>
  );
}

export function Dot({ color, size = 8 }: { color: string; size?: number }) {
  return (
    <span
      style={{
        display: 'inline-block',
        width: size,
        height: size,
        borderRadius: size / 2,
        background: color,
        flexShrink: 0,
      }}
    />
  );
}

export function Label({ children, color, style }: { children: ReactNode; color?: string; style?: CSSProperties }) {
  return (
    <div
      style={{
        fontFamily: T.font.mono,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: 1.2,
        color: color ?? T.color.ink55,
        textTransform: 'uppercase',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function Sticker({
  children, bg, color, rot = 0, size, style, onClick,
}: {
  children: ReactNode;
  bg?: string;
  color?: string;
  rot?: number;
  size?: number;
  style?: CSSProperties;
  onClick?: MouseEventHandler;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        transform: `rotate(${rot}deg)`,
        background: bg ?? T.color.card,
        color: color ?? T.color.ink,
        borderRadius: 16,
        padding: '8px 14px',
        boxShadow: T.shadow.sticker,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        fontWeight: 700,
        fontSize: size ?? 14,
        border: `2.5px solid ${T.color.paper}`,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.18s cubic-bezier(.2,.8,.4,1)',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function FoodImg({
  src, emoji, size = 80, radius, style,
}: { src?: string; emoji?: string; size?: number; radius?: number; style?: CSSProperties }) {
  const r = radius ?? T.radius.md;
  if (src) {
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: r,
          backgroundImage: `url(${src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          flexShrink: 0,
          ...style,
        }}
      />
    );
  }
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: r,
        background: `radial-gradient(circle at 30% 25%, ${T.color.cardAlt}, ${T.color.paperDeep})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.48,
        flexShrink: 0,
        ...style,
      }}
    >
      {emoji ?? '🍽'}
    </div>
  );
}
