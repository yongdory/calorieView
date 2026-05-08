import { useEffect, useState } from 'react';
import { tokens as T } from '../lib/tokens';
import { Card, IconBtn, FoodImg } from './ui/primitives';
import { fetchFriendDay, type FriendMealRow, type FriendSummary } from '../lib/friends';
import { PhotoModal } from './PhotoModal';

interface Props {
  friend: FriendSummary;
  onBack: () => void;
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

export function FriendDayView({ friend, onBack }: Props) {
  const [meals, setMeals] = useState<FriendMealRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [date, setDate] = useState(() => { const d = new Date(); d.setHours(0,0,0,0); return d; });
  const [photoSrc, setPhotoSrc] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setErr(null);
    fetchFriendDay(friend.friend_id, date)
      .then(setMeals)
      .catch((e: unknown) => setErr(e instanceof Error ? e.message : '불러오기 실패'))
      .finally(() => setLoading(false));
  }, [friend.friend_id, date]);

  function shiftDate(days: number) {
    const next = new Date(date); next.setDate(next.getDate() + days); next.setHours(0,0,0,0);
    if (next > new Date()) return;
    setDate(next);
  }

  const wd = ['일','월','화','수','목','금','토'][date.getDay()];
  const dateLabel = `${date.getMonth()+1}월 ${date.getDate()}일 (${wd})`;
  const totals = meals.reduce((acc, m) => ({
    kcal: acc.kcal + m.total_kcal,
    carb: acc.carb + m.total_carb_g,
    protein: acc.protein + m.total_protein_g,
    fat: acc.fat + m.total_fat_g,
  }), { kcal: 0, carb: 0, protein: 0, fat: 0 });
  const name = friend.display_name || friend.nickname || '친구';

  return (
    <div className="cal" style={{ minHeight: '100vh', background: T.color.paper }}>
      <div className="cal-scroll" style={{ maxWidth: 460, margin: '0 auto', padding: '16px 0 100px' }}>
        <div style={{ padding: '8px 18px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <IconBtn onClick={onBack} size={36}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </IconBtn>
          <div style={{ flex: 1 }}>
            <div className="cal-display" style={{ fontSize: 22, fontWeight: 700 }}>{name}님의 식단</div>
          </div>
        </div>

        <div style={{ padding: '0 18px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <IconBtn onClick={() => shiftDate(-1)} size={32}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          </IconBtn>
          <div style={{ flex: 1, textAlign: 'center', fontSize: 14, fontWeight: 700 }}>{dateLabel}</div>
          <IconBtn onClick={() => shiftDate(1)} size={32}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6"/></svg>
          </IconBtn>
        </div>

        <div style={{ padding: '0 18px 14px' }}>
          <Card style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 14, boxShadow: 'none' }}>
            <div>
              <div style={{ fontSize: 11, color: T.color.ink55, fontWeight: 700 }}>합계</div>
              <div className="cal-num" style={{ fontSize: 28, fontWeight: 700, lineHeight: 1.1 }}>{totals.kcal.toLocaleString()}</div>
              <div style={{ fontSize: 10, color: T.color.ink55, fontWeight: 700 }}>kcal</div>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12, color: T.color.ink70, fontWeight: 700 }}>
              <span>탄 {totals.carb}g</span>
              <span>단 {totals.protein}g</span>
              <span>지 {totals.fat}g</span>
            </div>
          </Card>
        </div>

        {err && (
          <div style={{ padding: '0 18px 12px' }}>
            <div style={{ padding: '10px 14px', borderRadius: T.radius.sm, background: T.color.proteinSoft, color: T.color.protein, fontSize: 12, fontWeight: 700 }}>{err}</div>
          </div>
        )}

        <div style={{ padding: '0 18px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {loading && <Card style={{ textAlign: 'center', color: T.color.ink55, padding: '24px 18px' }}>불러오는 중...</Card>}
          {!loading && meals.length === 0 && (
            <Card style={{ padding: '24px 18px', border: `1.5px dashed ${T.color.ink15}`, textAlign: 'center', boxShadow: 'none' }}>
              <div style={{ fontSize: 30, marginBottom: 6 }}>🌿</div>
              <div style={{ fontSize: 13, color: T.color.ink55, fontWeight: 700 }}>이 날의 기록이 없어요</div>
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
                  <FoodImg src={m.image_url ?? undefined} emoji={foodEmoji(label)} size={56} radius={18} />
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
      </div>
      {photoSrc && <PhotoModal src={photoSrc} onClose={() => setPhotoSrc(null)} />}
    </div>
  );
}
