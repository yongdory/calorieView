import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { MacroTargets } from '../lib/nutrition';
import { tokens as T } from '../lib/tokens';
import { MultiRing } from './ui/Ring';
import { Card, Chip, IconBtn, FoodImg } from './ui/primitives';
import { PhotoModal } from './PhotoModal';

interface MealRow {
  id: string;
  eaten_at: string;
  total_kcal: number;
  total_carb_g: number;
  total_protein_g: number;
  total_fat_g: number;
  items: Array<{ name: string; kcal: number; estimatedGrams: number }>;
  image_url: string | null;
}

const foodEmoji = (name: string): string => {
  const n = (name ?? '').toLowerCase();
  if (/(burger|버거|햄버거)/.test(n)) return '🍔';
  if (/(pizza|피자)/.test(n)) return '🍕';
  if (/(rice|밥|김밥)/.test(n)) return '🍚';
  if (/(noodle|라면|면)/.test(n)) return '🍜';
  if (/(salad|샐러드)/.test(n)) return '🥗';
  if (/(bread|빵|토스트)/.test(n)) return '🍞';
  if (/(chicken|닭)/.test(n)) return '🍗';
  if (/(fish|생선|연어)/.test(n)) return '🐟';
  if (/(apple|사과)/.test(n)) return '🍎';
  if (/(avocado|아보카도)/.test(n)) return '🥑';
  return '🍽';
};

interface Props {
  email: string;
  nickname?: string | null;
  targets: MacroTargets;
  onPickPhoto: () => void;
  onOpenHistory: () => void;
  onOpenFriends: () => void;
  onOpenSettings: () => void;
  refreshKey: number;
}

export function HomeView({ email: _email, nickname, targets, onPickPhoto, onOpenHistory, onOpenFriends, onOpenSettings, refreshKey }: Props) {
  const [meals, setMeals] = useState<MealRow[]>([]);
  const [photoSrc, setPhotoSrc] = useState<string | null>(null);

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    supabase
      .from('meals')
      .select('id, eaten_at, total_kcal, total_carb_g, total_protein_g, total_fat_g, items, image_url')
      .gte('eaten_at', today.toISOString())
      .order('eaten_at', { ascending: false })
      .then(({ data }) => setMeals((data as MealRow[]) ?? []));
  }, [refreshKey]);

  const totals = meals.reduce(
    (acc, m) => ({
      kcal: acc.kcal + m.total_kcal,
      carb: acc.carb + m.total_carb_g,
      protein: acc.protein + m.total_protein_g,
      fat: acc.fat + m.total_fat_g,
    }),
    { kcal: 0, carb: 0, protein: 0, fat: 0 },
  );
  const left = Math.max(0, targets.kcal - totals.kcal);
  const rings = [
    { value: totals.carb / targets.carbG, color: T.color.carb },
    { value: totals.protein / targets.proteinG, color: T.color.protein },
    { value: totals.fat / targets.fatG, color: T.color.fat },
  ];

  const today = new Date();
  const wd = ['일', '월', '화', '수', '목', '금', '토'][today.getDay()];
  const dateLabel = `${wd}요일 · ${today.getMonth() + 1}월 ${today.getDate()}일`;
  const prefix = nickname ? `${nickname}님, ` : '';
  const greet = meals.length === 0 ? `${prefix}오늘 첫 식사 어땠어요?` : left === 0 ? `${prefix}오늘도 잘 해냈어요 🎉` : `${prefix}오늘도 천천히 🍃`;

  async function shareToday() {
    const pct = Math.round((totals.kcal / Math.max(1, targets.kcal)) * 100);
    const head = nickname ? `${nickname}님의 오늘 식단` : '오늘 식단';
    const text = `${head}\n${totals.kcal.toLocaleString()} / ${targets.kcal.toLocaleString()} kcal (${pct}%)\n탄 ${totals.carb}g · 단 ${totals.protein}g · 지 ${totals.fat}g\n\ncalorieView`;
    const nav = navigator as Navigator & { share?: (d: ShareData) => Promise<void> };
    if (typeof nav.share === 'function') {
      try { await nav.share({ title: 'calorieView', text, url: window.location.origin }); return; }
      catch { /* user cancel / unsupported → fall through to clipboard */ }
    }
    try { await navigator.clipboard.writeText(text); alert('오늘 식단을 클립보드에 복사했어요'); }
    catch { alert('공유를 지원하지 않는 환경이에요'); }
  }

  return (
    <div className="cal" style={{ minHeight: '100vh', background: T.color.paper, position: 'relative' }}>
      <div className="cal-scroll" style={{ maxWidth: 460, margin: '0 auto', padding: '16px 0 140px' }}>
        {/* header */}
        <div style={{ padding: '12px 22px 6px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: T.color.ink55, fontWeight: 700 }}>{dateLabel}</div>
            <div className="cal-display" style={{ fontSize: 24, fontWeight: 700, marginTop: 2 }}>{greet}</div>
          </div>
          <IconBtn size={38} onClick={onOpenSettings}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </IconBtn>
        </div>

        {/* big ring card */}
        <div
          style={{
            margin: '14px 18px 16px',
            padding: '24px 20px 20px',
            borderRadius: T.radius.xl,
            background: T.color.card,
            border: `1px solid ${T.color.ink08}`,
            position: 'relative',
            overflow: 'hidden',
            boxShadow: T.shadow.sm,
          }}
        >
          <div style={{ position: 'absolute', top: -8, right: -6, fontSize: 40, opacity: 0.22, transform: 'rotate(18deg)' }}>🌿</div>
          <div style={{ position: 'absolute', bottom: 10, left: 14, fontSize: 22, opacity: 0.22, transform: 'rotate(-12deg)' }}>🌱</div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <MultiRing rings={rings} size={150} stroke={9} gap={3}>
              <div style={{ fontSize: 11, color: T.color.ink55, fontWeight: 700 }}>오늘 먹은 양</div>
              <div className="cal-num" style={{ fontSize: 36, fontWeight: 700, lineHeight: 1, marginTop: 4 }}>
                {totals.kcal.toLocaleString()}
              </div>
              <div style={{ fontSize: 11, color: T.color.ink55, fontWeight: 600, marginTop: 4 }}>
                / {targets.kcal.toLocaleString()} kcal
              </div>
            </MultiRing>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <NutrientPill color={T.color.carb} name="탄수화물" val={totals.carb} target={targets.carbG} icon="🍚" />
              <NutrientPill color={T.color.protein} name="단백질" val={totals.protein} target={targets.proteinG} icon="🍗" />
              <NutrientPill color={T.color.fat} name="지방" val={totals.fat} target={targets.fatG} icon="🥑" />
            </div>
          </div>

          <div style={{ marginTop: 18, padding: '12px 14px', borderRadius: T.radius.md, background: T.color.paper, display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ fontSize: 18 }}>{left > 0 ? '🌤' : '✨'}</div>
            <div style={{ flex: 1, fontSize: 13, fontWeight: 700 }}>
              {left > 0 ? (
                <>앞으로 <span style={{ color: T.color.vita }}>{left.toLocaleString()} kcal</span> 더 먹을 수 있어요</>
              ) : (
                <>목표를 <span style={{ color: T.color.vita }}>완벽하게</span> 달성했어요</>
              )}
            </div>
          </div>
        </div>

        {/* quick actions */}
        <div style={{ padding: '0 18px 14px', display: 'flex', gap: 8 }}>
          <QuickBtn emoji="📷" label="업로드" onClick={onPickPhoto} />
          <QuickBtn emoji="📊" label="기록" onClick={onOpenHistory} />
          <QuickBtn emoji="👥" label="친구" onClick={onOpenFriends} />
          <QuickBtn emoji="💭" label="공유" onClick={shareToday} />
        </div>

        {/* meals */}
        <div style={{ padding: '4px 22px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="cal-display" style={{ fontSize: 22, fontWeight: 700 }}>오늘의 식사</div>
          <div style={{ fontSize: 12, color: T.color.ink55, fontWeight: 700 }}>{meals.length}개</div>
        </div>

        <div style={{ padding: '0 18px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {meals.length === 0 && (
            <Card style={{ padding: '30px 20px', border: `1.5px dashed ${T.color.ink15}`, textAlign: 'center', boxShadow: 'none' }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>🍽</div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>아직 기록이 없어요</div>
              <div style={{ fontSize: 12, color: T.color.ink55, marginTop: 4 }}>사진으로 시작해보세요</div>
            </Card>
          )}
          {meals.map(m => {
            const time = new Date(m.eaten_at).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
            const label = m.items?.[0]?.name ?? '식사';
            const moreLabel = (m.items?.length ?? 0) > 1 ? ` 외 ${m.items.length - 1}` : '';
            return (
              <Card key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 10, boxShadow: 'none' }}>
                <div
                  onClick={m.image_url ? () => setPhotoSrc(m.image_url!) : undefined}
                  style={{ cursor: m.image_url ? 'zoom-in' : 'default' }}
                >
                  <FoodImg src={m.image_url ?? undefined} emoji={foodEmoji(label)} size={52} radius={18} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="cal-mono" style={{ fontSize: 10, color: T.color.ink55, fontWeight: 700 }}>{time}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {label}{moreLabel}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="cal-num" style={{ fontSize: 17, fontWeight: 700 }}>{m.total_kcal}</div>
                  <div style={{ fontSize: 10, color: T.color.ink55, fontWeight: 700 }}>kcal</div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* insight */}
        {meals.length > 0 && (
          <div style={{ margin: '16px 18px 0', padding: 14, borderRadius: T.radius.md, background: left === 0 ? T.color.vitaSoft : T.color.carbSoft, display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ fontSize: 28 }}>{left === 0 ? '🏆' : '💡'}</div>
            <div style={{ flex: 1, fontSize: 13, lineHeight: 1.45 }}>
              {left === 0
                ? <><b>목표 달성!</b> 남은 하루도 가볍게 보내세요.</>
                : <><b>{Math.round(((targets.kcal - left) / targets.kcal) * 100)}% 달성</b>. 남은 여유는 {left.toLocaleString()} kcal.</>}
            </div>
          </div>
        )}

        <div style={{ padding: '18px 22px 0', textAlign: 'center', fontSize: 11, color: T.color.ink40 }}>
          <Chip sm>AI 추정엔 ±18% 오차가 있어요.(향후 모델 업그레이드 예정)</Chip>
        </div>
      </div>
      {photoSrc && <PhotoModal src={photoSrc} onClose={() => setPhotoSrc(null)} />}
    </div>
  );
}

function NutrientPill({ color, name, val, target, icon }: { color: string; name: string; val: number; target: number; icon: string }) {
  const pct = Math.min(1, val / Math.max(1, target));
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 3 }}>
        <span style={{ fontSize: 11 }}>{icon}</span>
        <span style={{ fontSize: 11, fontWeight: 700, color: T.color.ink70 }}>{name}</span>
        <div style={{ flex: 1 }} />
        <span className="cal-num" style={{ fontSize: 12, fontWeight: 700 }}>{val}</span>
        <span style={{ fontSize: 10, color: T.color.ink55, fontWeight: 700 }}>/{target}g</span>
      </div>
      <div style={{ height: 6, borderRadius: 3, background: T.color.ink08, overflow: 'hidden' }}>
        <div style={{ width: pct * 100 + '%', height: '100%', background: color, borderRadius: 3, transition: 'width .3s' }} />
      </div>
    </div>
  );
}

function QuickBtn({ emoji, label, onClick, disabled }: { emoji: string; label: string; onClick?: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        flex: 1,
        padding: '14px 10px',
        borderRadius: T.radius.md,
        background: T.color.card,
        border: `1px solid ${T.color.ink08}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
        fontFamily: 'inherit',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        color: T.color.ink,
      }}
    >
      <div style={{ fontSize: 22 }}>{emoji}</div>
      <div style={{ fontSize: 12, fontWeight: 700 }}>{label}</div>
    </button>
  );
}
