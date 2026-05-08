import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { MacroTargets } from '../lib/nutrition';
import { tokens as T } from '../lib/tokens';
import { IconBtn, Label, Chip, Card } from './ui/primitives';

type Range = 7 | 30;

interface MealRow {
  id: string;
  eaten_at: string;
  total_kcal: number;
  total_carb_g: number;
  total_protein_g: number;
  total_fat_g: number;
}

interface DailyAgg {
  date: string;     // YYYY-MM-DD
  ymd: Date;
  kcal: number;
  carb: number;
  protein: number;
  fat: number;
  count: number;
}

interface Props {
  userId: string;
  targets: MacroTargets;
  onBack: () => void;
}

export function HistoryView({ userId, targets, onBack }: Props) {
  const [range, setRange] = useState<Range>(7);
  const [meals, setMeals] = useState<MealRow[]>([]);

  useEffect(() => {
    const since = new Date();
    since.setDate(since.getDate() - range + 1);
    since.setHours(0, 0, 0, 0);
    supabase
      .from('meals')
      .select('id, eaten_at, total_kcal, total_carb_g, total_protein_g, total_fat_g')
      .eq('user_id', userId)
      .gte('eaten_at', since.toISOString())
      .order('eaten_at', { ascending: true })
      .then(({ data }) => setMeals((data as MealRow[]) ?? []));
  }, [range, userId]);

  const daily = useMemo(() => buildDaily(meals, range), [meals, range]);

  const nonEmpty = daily.filter(d => d.count > 0);
  const avgKcal = nonEmpty.length ? Math.round(nonEmpty.reduce((s, d) => s + d.kcal, 0) / nonEmpty.length) : 0;
  const avgCarb = nonEmpty.length ? Math.round(nonEmpty.reduce((s, d) => s + d.carb, 0) / nonEmpty.length) : 0;
  const avgProtein = nonEmpty.length ? Math.round(nonEmpty.reduce((s, d) => s + d.protein, 0) / nonEmpty.length) : 0;
  const avgFat = nonEmpty.length ? Math.round(nonEmpty.reduce((s, d) => s + d.fat, 0) / nonEmpty.length) : 0;

  const streak = computeStreak(daily);

  return (
    <div className="cal" style={{ minHeight: '100vh', background: T.color.paper }}>
      <div style={{ position: 'sticky', top: 0, zIndex: 10, padding: '16px 18px 10px', display: 'flex', alignItems: 'center', gap: 12, background: T.color.paper }}>
        <IconBtn size={36} onClick={onBack}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </IconBtn>
        <Label>기록 / 트렌드</Label>
      </div>

      <div style={{ maxWidth: 460, margin: '0 auto', padding: '0 18px 80px' }}>
        {/* range tabs */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 14, background: T.color.card, padding: 4, borderRadius: T.radius.pill, border: `1px solid ${T.color.ink08}`, width: 'fit-content' }}>
          {([7, 30] as const).map(r => (
            <button
              key={r}
              type="button"
              onClick={() => setRange(r)}
              style={{
                padding: '6px 16px', borderRadius: T.radius.pill,
                background: range === r ? T.color.ink : 'transparent',
                color: range === r ? T.color.paper : T.color.ink70,
                border: 'none', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              {r === 7 ? '주간' : '월간'}
            </button>
          ))}
        </div>

        {/* chart card */}
        <Card style={{ padding: '18px 16px', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 6 }}>
            <div>
              <Label>평균 칼로리</Label>
              <div className="cal-num" style={{ fontSize: 32, fontWeight: 700, marginTop: 2 }}>
                {avgKcal.toLocaleString()}
                <span style={{ fontSize: 13, color: T.color.ink55, marginLeft: 4 }}>kcal</span>
              </div>
            </div>
            <Chip color={avgKcal > targets.kcal ? T.color.protein : T.color.vita} sm>
              목표 {targets.kcal.toLocaleString()} kcal
            </Chip>
          </div>
          <Chart daily={daily} target={targets.kcal} />
        </Card>

        {/* nutrient avg */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 14 }}>
          <AvgCard label="탄수화물" value={avgCarb} target={targets.carbG} color={T.color.carb} soft={T.color.carbSoft} icon="🍞" />
          <AvgCard label="단백질" value={avgProtein} target={targets.proteinG} color={T.color.protein} soft={T.color.proteinSoft} icon="🥩" />
          <AvgCard label="지방" value={avgFat} target={targets.fatG} color={T.color.fat} soft={T.color.fatSoft} icon="🧀" />
        </div>

        {/* streak */}
        <Card style={{ padding: 16, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ fontSize: 34 }}>🔥</div>
          <div style={{ flex: 1 }}>
            <div className="cal-num" style={{ fontSize: 26, fontWeight: 700, lineHeight: 1 }}>
              {streak}일
            </div>
            <div style={{ fontSize: 12, color: T.color.ink55, marginTop: 4, fontWeight: 700 }}>
              {streak > 0 ? '연속 기록 중' : '오늘 첫 기록을 남겨보세요'}
            </div>
          </div>
        </Card>

        {/* recent list */}
        <div style={{ padding: '4px 4px 10px' }}>
          <Label>최근 {range}일 · {meals.length}건</Label>
        </div>
        {meals.length === 0 ? (
          <Card style={{ padding: '28px 18px', textAlign: 'center', border: `1.5px dashed ${T.color.ink15}`, boxShadow: 'none' }}>
            <div style={{ fontSize: 32, marginBottom: 6 }}>🍽</div>
            <div style={{ fontSize: 13, fontWeight: 700 }}>아직 기록이 없어요</div>
          </Card>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[...meals].reverse().slice(0, 30).map(m => {
              const d = new Date(m.eaten_at);
              const when = `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
              return (
                <Card key={m.id} style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: 'none' }}>
                  <div className="cal-mono" style={{ fontSize: 11, color: T.color.ink55, fontWeight: 700, width: 70 }}>{when}</div>
                  <div style={{ flex: 1, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    <MiniBar color={T.color.carb} value={m.total_carb_g} max={targets.carbG} />
                    <MiniBar color={T.color.protein} value={m.total_protein_g} max={targets.proteinG} />
                    <MiniBar color={T.color.fat} value={m.total_fat_g} max={targets.fatG} />
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="cal-num" style={{ fontSize: 15, fontWeight: 700 }}>{m.total_kcal}</div>
                    <div style={{ fontSize: 10, color: T.color.ink55, fontWeight: 700 }}>kcal</div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function buildDaily(meals: MealRow[], days: number): DailyAgg[] {
  const result: DailyAgg[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    result.push({
      date: d.toISOString().slice(0, 10),
      ymd: d,
      kcal: 0, carb: 0, protein: 0, fat: 0, count: 0,
    });
  }

  const indexByDate = new Map(result.map((a, i) => [a.date, i]));
  for (const m of meals) {
    const key = new Date(m.eaten_at).toISOString().slice(0, 10);
    const idx = indexByDate.get(key);
    if (idx === undefined) continue;
    const a = result[idx];
    a.kcal += m.total_kcal;
    a.carb += m.total_carb_g;
    a.protein += m.total_protein_g;
    a.fat += m.total_fat_g;
    a.count += 1;
  }
  return result;
}

function computeStreak(daily: DailyAgg[]): number {
  let s = 0;
  for (let i = daily.length - 1; i >= 0; i--) {
    if (daily[i].count > 0) s++;
    else break;
  }
  return s;
}

function Chart({ daily, target }: { daily: DailyAgg[]; target: number }) {
  const W = 420;
  const H = 140;
  const padL = 8;
  const padR = 8;
  const padT = 16;
  const padB = 22;

  const chartW = W - padL - padR;
  const chartH = H - padT - padB;

  const maxKcal = Math.max(target * 1.1, ...daily.map(d => d.kcal));
  const minKcal = 0;
  const scaleY = (v: number) => padT + chartH - ((v - minKcal) / (maxKcal - minKcal || 1)) * chartH;

  const n = daily.length;
  const stepX = chartW / Math.max(1, n - 1);
  const xAt = (i: number) => padL + i * stepX;

  const nonEmptyIdx = daily.map((d, i) => ({ d, i })).filter(x => x.d.count > 0);
  const path = nonEmptyIdx.map((x, idx) => `${idx === 0 ? 'M' : 'L'}${xAt(x.i).toFixed(1)},${scaleY(x.d.kcal).toFixed(1)}`).join(' ');
  const targetY = scaleY(target);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
      {/* target line */}
      <line x1={padL} x2={W - padR} y1={targetY} y2={targetY}
        stroke={T.color.vita} strokeDasharray="4 4" strokeWidth={1.2} opacity={0.7} />
      <text x={W - padR - 4} y={targetY - 4} fontSize="9" fill={T.color.vita}
        textAnchor="end" fontWeight={700}>목표</text>

      {/* path */}
      {path && (
        <path d={path} fill="none" stroke={T.color.ink} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
      )}

      {/* dots + today highlight */}
      {daily.map((d, i) => {
        if (d.count === 0) return null;
        const isLast = i === daily.length - 1;
        return (
          <g key={i}>
            <circle cx={xAt(i)} cy={scaleY(d.kcal)} r={isLast ? 5 : 3} fill={isLast ? T.color.vita : T.color.ink} />
            {isLast && <circle cx={xAt(i)} cy={scaleY(d.kcal)} r={9} fill="none" stroke={T.color.vita} strokeWidth={1.5} opacity={0.5} />}
          </g>
        );
      })}

      {/* x axis labels */}
      {daily.map((d, i) => {
        const show = daily.length <= 7 || i % Math.ceil(daily.length / 7) === 0 || i === daily.length - 1;
        if (!show) return null;
        const label = `${d.ymd.getMonth() + 1}/${d.ymd.getDate()}`;
        return (
          <text key={`x${i}`} x={xAt(i)} y={H - 4} fontSize="9" fill={T.color.ink55}
            textAnchor="middle" fontWeight={700}>{label}</text>
        );
      })}
    </svg>
  );
}

function AvgCard({ label, value, target, color, soft, icon }: {
  label: string; value: number; target: number; color: string; soft: string; icon: string;
}) {
  const pct = Math.round((value / Math.max(1, target)) * 100);
  return (
    <div style={{ padding: 12, borderRadius: T.radius.md, background: soft, border: `1px solid ${T.color.ink08}` }}>
      <div style={{ fontSize: 16 }}>{icon}</div>
      <div style={{ fontSize: 11, fontWeight: 700, color: T.color.ink70, marginTop: 4 }}>{label}</div>
      <div className="cal-num" style={{ fontSize: 20, fontWeight: 700, marginTop: 2 }}>
        {value}<span style={{ fontSize: 10, color: T.color.ink55, fontWeight: 700 }}>g</span>
      </div>
      <div style={{ fontSize: 10, color, fontWeight: 700, marginTop: 2 }}>목표 {pct}%</div>
    </div>
  );
}

function MiniBar({ color, value, max }: { color: string; value: number; max: number }) {
  const pct = Math.min(1, value / Math.max(1, max));
  return (
    <div style={{ flex: 1, minWidth: 30, height: 6, borderRadius: 3, background: T.color.ink08, overflow: 'hidden' }}>
      <div style={{ width: pct * 100 + '%', height: '100%', background: color, borderRadius: 3 }} />
    </div>
  );
}
