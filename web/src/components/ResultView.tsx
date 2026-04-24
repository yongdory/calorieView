import type { AnalyzeResponse } from '../lib/api';
import type { MacroTargets } from '../lib/nutrition';
import { tokens as T } from '../lib/tokens';
import { BigBtn, Chip, IconBtn, Label, Sticker } from './ui/primitives';

const foodEmoji = (name: string): string => {
  const n = name.toLowerCase();
  if (/(burger|버거|햄버거)/.test(n)) return '🍔';
  if (/(fry|튀김|감자)/.test(n)) return '🍟';
  if (/(pizza|피자)/.test(n)) return '🍕';
  if (/(sushi|스시|초밥)/.test(n)) return '🍣';
  if (/(rice|밥|김밥|주먹밥)/.test(n)) return '🍚';
  if (/(noodle|라면|파스타|국수|면)/.test(n)) return '🍜';
  if (/(salad|샐러드|야채|채소)/.test(n)) return '🥗';
  if (/(bread|빵|토스트)/.test(n)) return '🍞';
  if (/(egg|계란|달걀)/.test(n)) return '🍳';
  if (/(chicken|닭)/.test(n)) return '🍗';
  if (/(fish|생선|연어)/.test(n)) return '🐟';
  if (/(fruit|사과|apple)/.test(n)) return '🍎';
  if (/(cheese|치즈)/.test(n)) return '🧀';
  if (/(bacon|베이컨)/.test(n)) return '🥓';
  if (/(avocado|아보카도)/.test(n)) return '🥑';
  if (/(tomato|토마토)/.test(n)) return '🍅';
  if (/(소고기|beef|steak)/.test(n)) return '🥩';
  return '🍽';
};

interface Props {
  result: AnalyzeResponse;
  targets: MacroTargets;
  imageSrc: string;
  onBack: () => void;
}

export function ResultView({ result, targets, imageSrc, onBack }: Props) {
  const { totals, items } = result;
  const pct = Math.round((totals.kcal / targets.kcal) * 100);
  const primary = items[0]?.name ?? '분석 결과';
  const secondary = items.slice(1, 3).map(i => i.name).join(' · ');
  const title = secondary ? `${primary} + ${secondary}` : primary;

  return (
    <div className="cal" style={{ minHeight: '100vh', background: T.color.paper, position: 'relative' }}>
      {/* top bar */}
      <div style={{ position: 'sticky', top: 0, zIndex: 10, padding: '16px 18px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: T.color.paper }}>
        <IconBtn size={36} onClick={onBack}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </IconBtn>
        <Label>분석 결과</Label>
        <div style={{ width: 36 }} />
      </div>

      <div style={{ maxWidth: 460, margin: '0 auto', padding: '10px 20px 120px' }}>
        {/* hero with stickers */}
        <div
          style={{
            position: 'relative',
            borderRadius: T.radius.xl,
            aspectRatio: '1 / 0.92',
            backgroundImage: `url(${imageSrc})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            boxShadow: T.shadow.md,
            margin: '20px 0 32px',
          }}
        >
          <div style={{ position: 'absolute', inset: 0, borderRadius: T.radius.xl, background: 'linear-gradient(180deg, transparent 55%, rgba(0,0,0,0.18))' }} />

          <div style={{ position: 'absolute', top: -14, right: 16 }}>
            <Sticker bg={T.color.ink} color={T.color.paper} rot={6} style={{ padding: '10px 16px', borderRadius: 22 }}>
              <span className="cal-num" style={{ fontSize: 22, fontWeight: 700 }}>{totals.kcal}</span>
              <span style={{ fontSize: 11, opacity: 0.7 }}>kcal</span>
            </Sticker>
          </div>

          <div style={{ position: 'absolute', top: 20, left: -6 }}>
            <Sticker bg={T.color.vita} color="#14231a" rot={-8} size={12}>
              <span>✓</span>
              <span>AI</span>
              <span style={{ opacity: 0.7, fontWeight: 600 }}>분석</span>
            </Sticker>
          </div>

          <div style={{ position: 'absolute', bottom: 14, left: 14 }}>
            <Sticker bg={T.color.carb} color="#3a2a10" rot={-5} size={12}>
              <span>🍞</span>
              <span>탄수화물</span>
              <span className="cal-num" style={{ fontSize: 14 }}>{totals.carbG}g</span>
            </Sticker>
          </div>

          <div style={{ position: 'absolute', bottom: 52, right: 14 }}>
            <Sticker bg={T.color.protein} color="#fff" rot={4} size={12}>
              <span>🥩</span>
              <span>단백질</span>
              <span className="cal-num" style={{ fontSize: 14 }}>{totals.proteinG}g</span>
            </Sticker>
          </div>

          <div style={{ position: 'absolute', bottom: 12, right: 30 }}>
            <Sticker bg={T.color.fat} color="#3a2740" rot={7} size={12}>
              <span>🧀</span>
              <span>지방</span>
              <span className="cal-num" style={{ fontSize: 14 }}>{totals.fatG}g</span>
            </Sticker>
          </div>
        </div>

        {/* title */}
        <div style={{ marginBottom: 20 }}>
          <div className="cal-display" style={{ fontSize: 28, fontWeight: 700, lineHeight: 1.2 }}>
            {title}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 6, flexWrap: 'wrap' }}>
            <Chip color={T.color.vita} sm>AI 자동 분석</Chip>
            <span style={{ fontSize: 13, color: T.color.ink55, fontWeight: 700 }}>
              오늘 목표의 <b style={{ color: T.color.ink }}>{pct}%</b>
            </span>
          </div>
        </div>

        {/* macro breakdown row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 20 }}>
          {[
            { label: '탄수화물', value: totals.carbG, target: targets.carbG, color: T.color.carb, soft: T.color.carbSoft, icon: '🍞' },
            { label: '단백질', value: totals.proteinG, target: targets.proteinG, color: T.color.protein, soft: T.color.proteinSoft, icon: '🥩' },
            { label: '지방', value: totals.fatG, target: targets.fatG, color: T.color.fat, soft: T.color.fatSoft, icon: '🧀' },
          ].map(m => (
            <div key={m.label} style={{ padding: 14, borderRadius: T.radius.md, background: m.soft, border: `1px solid ${T.color.ink08}` }}>
              <div style={{ fontSize: 18 }}>{m.icon}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: T.color.ink70, marginTop: 4 }}>{m.label}</div>
              <div className="cal-num" style={{ fontSize: 22, fontWeight: 700, marginTop: 2 }}>
                {m.value}<span style={{ fontSize: 11, color: T.color.ink55, fontWeight: 700 }}>g</span>
              </div>
              <div style={{ fontSize: 11, color: T.color.ink55, fontWeight: 700 }}>
                목표 {Math.round((m.value / m.target) * 100)}%
              </div>
            </div>
          ))}
        </div>

        {/* items */}
        <div style={{ marginBottom: 18 }}>
          <Label style={{ padding: '0 4px 8px' }}>인식된 음식 {items.length}개</Label>
          <div style={{ background: T.color.card, borderRadius: T.radius.md, border: `1px solid ${T.color.ink08}`, overflow: 'hidden' }}>
            {items.map((it, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 14px',
                  borderBottom: i < items.length - 1 ? `1px solid ${T.color.ink08}` : 'none',
                }}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 12,
                    background: T.color.paper,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 20,
                  }}
                >
                  {foodEmoji(it.name)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {it.name}
                  </div>
                  <div className="cal-num" style={{ fontSize: 11, color: T.color.ink55, fontWeight: 700, marginTop: 1 }}>
                    {it.estimatedGrams}g
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="cal-num" style={{ fontSize: 16, fontWeight: 700 }}>{it.kcal}</div>
                  <div style={{ fontSize: 10, color: T.color.ink55, fontWeight: 700 }}>kcal</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* wellness tip */}
        <div style={{ padding: 14, borderRadius: T.radius.md, background: T.color.vitaSoft, display: 'flex', gap: 10 }}>
          <div style={{ fontSize: 22 }}>🌿</div>
          <div style={{ flex: 1, fontSize: 13, lineHeight: 1.5, color: T.color.ink }}>
            <b>오늘 목표의 {pct}%</b>를 이 한 끼로 쓰셨어요.
            {pct < 40 ? ' 가볍게 잘 드셨네요!' : pct < 70 ? ' 균형 잡힌 한 끼예요.' : ' 남은 끼니는 가볍게 드시면 좋아요.'}
          </div>
        </div>
      </div>

      {/* fixed bottom action */}
      <div
        style={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          padding: '12px 18px 24px',
          background: `linear-gradient(to top, ${T.color.paper} 72%, transparent)`,
          maxWidth: 460,
          margin: '0 auto',
        }}
      >
        <BigBtn variant="accent" onClick={onBack}>
          완료 🌱
        </BigBtn>
      </div>
    </div>
  );
}
