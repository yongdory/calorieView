import { useEffect, useState } from 'react';
import { Ring } from './ui/Ring';
import { tokens as T } from '../lib/tokens';
import { Chip, Label } from './ui/primitives';

const steps = [
  { icon: '👀', label: '사진 읽는 중' },
  { icon: '🔎', label: '음식 찾는 중' },
  { icon: '🧮', label: '영양 계산 중' },
  { icon: '🌿', label: '마무리 중' },
];

export function LoadingView({ previewSrc }: { previewSrc?: string | null }) {
  const [pct, setPct] = useState(3);

  useEffect(() => {
    const id = setInterval(() => {
      setPct(p => (p >= 95 ? 95 : p + 1.4));
    }, 60);
    return () => clearInterval(id);
  }, []);

  const stepIdx = Math.min(steps.length - 1, Math.floor((pct / 100) * steps.length));

  return (
    <div className="cal" style={{ minHeight: '100vh', background: T.color.paper, padding: '48px 22px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <Label>GEMINI · VISION</Label>
        <Chip color={T.color.vita} filled sm>
          <span className="cal-pulse">●</span> 분석중
        </Chip>
      </div>

      <div className="cal-display" style={{ fontSize: 22, fontWeight: 700, marginBottom: 28, color: T.color.ink70 }}>
        사진을 읽고 있어요
      </div>

      <div style={{ position: 'relative', marginBottom: 10 }}>
        <Ring value={pct / 100} color={T.color.vita} size={220} stroke={14} track={T.color.ink08}>
          {previewSrc ? (
            <div style={{ width: 168, height: 168, borderRadius: '50%', backgroundImage: `url(${previewSrc})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
          ) : (
            <div style={{ fontSize: 46 }}>🍽</div>
          )}
        </Ring>
        <div style={{ position: 'absolute', top: -8, right: -4 }}>
          <div className="cal-pulse" style={{ fontSize: 26 }}>✨</div>
        </div>
      </div>

      <div className="cal-num" style={{ fontSize: 46, fontWeight: 700, lineHeight: 1, marginTop: 6 }}>
        {Math.round(pct)}<span style={{ fontSize: 22, color: T.color.ink55 }}>%</span>
      </div>
      <div style={{ marginTop: 4, fontSize: 14, color: T.color.ink55, fontWeight: 700 }}>
        {steps[stepIdx].icon} {steps[stepIdx].label}
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 36, flexWrap: 'wrap', justifyContent: 'center' }}>
        {steps.map((s, i) => (
          <Chip key={i} color={i <= stepIdx ? T.color.vita : undefined} filled={i === stepIdx} sm>
            <span>{s.icon}</span>
            <span>{s.label}</span>
          </Chip>
        ))}
      </div>

      <div style={{ marginTop: 28, padding: 14, borderRadius: T.radius.md, background: T.color.card, border: `1px solid ${T.color.ink08}`, fontSize: 13, color: T.color.ink70, display: 'flex', gap: 10, maxWidth: 360 }}>
        <div style={{ fontSize: 20 }}>💡</div>
        <div>
          AI 추정엔 <b>±30% 오차</b>가 있을 수 있어요. 결과는 참고용으로 사용하세요.
        </div>
      </div>
    </div>
  );
}
