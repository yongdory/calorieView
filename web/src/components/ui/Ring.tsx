import type { ReactNode } from 'react';
import { tokens } from '../../lib/tokens';

interface RingProps {
  value: number;
  color?: string;
  size?: number;
  stroke?: number;
  track?: string;
  children?: ReactNode;
  rotation?: number;
}

export function Ring({
  value,
  color = tokens.color.ink,
  size = 100,
  stroke = 10,
  track = tokens.color.ink08,
  children,
  rotation = -90,
}: RingProps) {
  const v = value > 1 ? value / 100 : value;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = Math.max(0, Math.min(1, v)) * c;
  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'inline-block' }}>
      <svg width={size} height={size} style={{ transform: `rotate(${rotation}deg)` }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={`${dash} ${c}`}
          strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 0.4s ease' }}
        />
      </svg>
      {children && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            lineHeight: 1.05,
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

interface MultiRingProps {
  rings: Array<{ value: number; color: string }>;
  size?: number;
  stroke?: number;
  gap?: number;
  children?: ReactNode;
}

export function MultiRing({ rings, size = 150, stroke = 9, gap = 3, children }: MultiRingProps) {
  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'inline-block' }}>
      {rings.map((r, i) => {
        const s = size - i * (stroke + gap) * 2;
        return (
          <div key={i} style={{ position: 'absolute', top: i * (stroke + gap), left: i * (stroke + gap) }}>
            <Ring value={r.value} color={r.color} size={s} stroke={stroke} />
          </div>
        );
      })}
      {children && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}
