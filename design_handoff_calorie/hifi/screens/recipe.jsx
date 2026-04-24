// ─── Recipe · 보충식 추천 ────────────────────────────────────
window.RecipeScreen = function RecipeScreen({ onTab }) {
  const C = window.CAL;

  const needs = [
    { k: '단백질', short: 32, target: 90, color: C.protein, icon: '🥚' },
    { k: '비타민C', short: 35, target: 100, color: C.vita, icon: '🍋' },
    { k: '식이섬유', short: 8, target: 25, color: C.carb, icon: '🥬' },
  ];

  const picks = [
    { name: '두부 김치말이', kcal: 240, tags: ['단백질 18g', '저탄수'], emoji: '🥟', time: '15분', fix: 'protein' },
    { name: '연어 아보카도 볼', kcal: 420, tags: ['오메가3', '단백질 28g'], emoji: '🥗', time: '10분', fix: 'protein' },
    { name: '레몬 치킨 샐러드', kcal: 380, tags: ['비타민C', '단백질 32g'], emoji: '🥗', time: '20분', fix: 'vita' },
    { name: '콩나물 들깨볶음', kcal: 160, tags: ['식이섬유 6g'], emoji: '🥬', time: '12분', fix: 'fiber' },
  ];

  return (
    <div className="cal" style={{ height: '100%', background: C.paper, position: 'relative', overflow: 'hidden' }}>
      <div className="cal-scroll" style={{ height: '100%', paddingTop: 52, paddingBottom: 100 }}>

        <div style={{ padding: '8px 22px 14px' }}>
          <window.Label>오늘의 추천</window.Label>
          <div className="cal-display" style={{ fontSize: 28, fontWeight: 700, marginTop: 2 }}>
            지금 필요한 한 끼
          </div>
          <div style={{ fontSize: 12, color: C.ink55, fontWeight: 700, marginTop: 4 }}>
            오늘 부족한 영양소를 분석해서 골랐어요 🌱
          </div>
        </div>

        {/* need summary */}
        <div style={{ margin: '0 18px 16px', padding: 16, borderRadius: C.rLg, background: C.card, border: `1px solid ${C.ink08}` }}>
          <window.Label style={{ marginBottom: 10 }}>지금 부족해요</window.Label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {needs.map(n => {
              const pct = Math.min(1, (n.target - n.short) / n.target);
              return (
                <div key={n.k} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 17, background: n.color + '33', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>{n.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                      <div style={{ fontSize: 13, fontWeight: 700 }}>{n.k}</div>
                      <div style={{ flex: 1 }} />
                      <div className="cal-num" style={{ fontSize: 11, color: C.ink55, fontWeight: 700 }}>-{n.short}{n.k === '비타민C' ? 'mg' : 'g'} 부족</div>
                    </div>
                    <div style={{ height: 5, borderRadius: 3, background: C.ink08, marginTop: 5 }}>
                      <div style={{ width: pct*100 + '%', height: '100%', background: n.color, borderRadius: 3 }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* top pick — featured */}
        <div style={{ padding: '0 22px 8px', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <div className="cal-display" style={{ fontSize: 20, fontWeight: 700 }}>👑 오늘의 탑픽</div>
          <div style={{ fontSize: 11, color: C.ink55, fontWeight: 700 }}>AI 매칭 94%</div>
        </div>

        <div style={{ margin: '0 18px 18px', borderRadius: C.rXl, overflow: 'hidden', background: C.card, border: `1px solid ${C.ink08}`, boxShadow: C.shadowSm, position: 'relative' }}>
          <div style={{ aspectRatio: '16 / 9', background: `radial-gradient(circle at 30% 30%, ${C.cardAlt}, ${C.paperDeep})`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <div style={{ fontSize: 92 }}>🥗</div>
            <div style={{ position: 'absolute', top: 10, right: 10 }}>
              <window.Sticker bg={C.protein} color="#fff" rot={5} size={11}>
                <span>단백질 풍부 🥚</span>
              </window.Sticker>
            </div>
            <div style={{ position: 'absolute', bottom: -10, left: 16 }}>
              <window.Sticker bg={C.ink} color={C.paper} rot={-4} size={12}>
                <span>⏱</span><span>20분</span>
              </window.Sticker>
            </div>
          </div>
          <div style={{ padding: '18px 18px 14px' }}>
            <div className="cal-display" style={{ fontSize: 22, fontWeight: 700 }}>레몬 치킨 샐러드</div>
            <div style={{ fontSize: 12, color: C.ink70, marginTop: 4, lineHeight: 1.5 }}>
              부족한 <b style={{ color: C.protein }}>단백질</b>과 <b style={{ color: C.vita }}>비타민C</b>를 한 번에 채워주는 가벼운 한 끼.
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 12 }}>
              <div>
                <div className="cal-num" style={{ fontSize: 22, fontWeight: 700 }}>380</div>
                <div style={{ fontSize: 10, color: C.ink55, fontWeight: 700 }}>kcal</div>
              </div>
              <div style={{ width: 1, height: 30, background: C.ink15 }} />
              <window.NutrientStack c={22} p={32} f={14} compact />
              <div style={{ flex: 1 }} />
              <window.IconBtn size={40} bg={C.vita} fg="#14231a">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
              </window.IconBtn>
            </div>
          </div>
        </div>

        {/* list — 더 추천 */}
        <div style={{ padding: '0 22px 8px' }}>
          <window.Label>다른 추천 {picks.length - 1}개</window.Label>
        </div>
        <div style={{ padding: '0 18px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {picks.slice(0, 3).map((r, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 10, borderRadius: C.rLg, background: C.card, border: `1px solid ${C.ink08}` }}>
              <window.FoodImg emoji={r.emoji} size={56} radius={18} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{r.name}</div>
                <div style={{ display: 'flex', gap: 5, marginTop: 5, flexWrap: 'wrap' }}>
                  {r.tags.map((t, j) => <window.Chip key={j} sm color={j === 0 ? C.protein : C.vita}>{t}</window.Chip>)}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="cal-num" style={{ fontSize: 15, fontWeight: 700 }}>{r.kcal}</div>
                <div style={{ fontSize: 10, color: C.ink55, fontWeight: 700 }}>{r.time}</div>
              </div>
            </div>
          ))}
        </div>

        {/* refresh */}
        <div style={{ padding: '16px 18px 0' }}>
          <window.BigBtn variant="ghost">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-3-6.7L21 8"/><path d="M21 3v5h-5"/></svg>
            새로운 추천 받기
          </window.BigBtn>
        </div>
      </div>

      <window.TabBar active="recipe" onTab={onTab} />
    </div>
  );
};
