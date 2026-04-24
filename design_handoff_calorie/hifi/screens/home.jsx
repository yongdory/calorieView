// ─── Home · 빅 링 대시보드 ────────────────────────────────────
window.HomeScreen = function HomeScreen({ onTab, onPlus, dataState = 'normal' }) {
  const C = window.CAL;

  // data states: empty | normal | achieved
  const states = {
    empty:    { kcal: 0,    goal: 1850, c: 0,  p: 0,  f: 0,  meals: [] },
    normal:   { kcal: 1495, goal: 1850, c: 168, p: 52, f: 58, meals: [
      { time: '08:10', name: '아보카도 토스트', kcal: 320, emoji: '🥑' },
      { time: '13:10', name: '치즈버거 + 감자튀김', kcal: 960, photo: 'hifi/assets/burger.jpg' },
      { time: '15:30', name: '사과 한 개', kcal: 95, emoji: '🍎' },
      { time: '18:00', name: '그릭요거트', kcal: 120, emoji: '🥛' },
    ]},
    achieved: { kcal: 1820, goal: 1850, c: 148, p: 72, f: 56, meals: [
      { time: '08:10', name: '오트밀 볼', kcal: 380, emoji: '🥣' },
      { time: '12:30', name: '닭가슴살 샐러드', kcal: 520, emoji: '🥗' },
      { time: '19:00', name: '연어 스테이크', kcal: 720, emoji: '🐟' },
      { time: '21:00', name: '다크초코', kcal: 200, emoji: '🍫' },
    ]},
  };
  const D = states[dataState] || states.normal;
  const pct = D.goal ? D.kcal / D.goal : 0;
  const left = Math.max(0, D.goal - D.kcal);

  const totalN = D.c + D.p + D.f || 1;
  const rings = [
    { value: D.c / 150, color: C.carb },
    { value: D.p / 90,  color: C.protein },
    { value: D.f / 60,  color: C.fat },
  ];

  const greet = dataState === 'achieved' ? '오늘도 잘 해냈어요 🎉' :
                dataState === 'empty'    ? '오늘 첫 식사 어땠어요?' :
                                            '오늘도 천천히 🍃';

  return (
    <div className="cal" style={{ height: '100%', background: C.paper, position: 'relative', overflow: 'hidden' }}>
      <div className="cal-scroll" style={{ height: '100%', paddingTop: 48, paddingBottom: 100 }}>

        {/* header */}
        <div style={{ padding: '12px 22px 6px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: C.ink55, fontWeight: 700 }}>수요일 · 4월 23일</div>
            <div className="cal-display" style={{ fontSize: 24, fontWeight: 700, marginTop: 2 }}>{greet}</div>
          </div>
          <window.IconBtn size={38}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M10 22a2 2 0 0 0 4 0"/></svg>
          </window.IconBtn>
        </div>

        {/* big ring card */}
        <div style={{ margin: '14px 18px 16px', padding: '24px 20px 20px', borderRadius: C.rXl, background: C.card, border: `1px solid ${C.ink08}`, position: 'relative', overflow: 'hidden', boxShadow: C.shadowSm }}>
          {/* decorative leaves */}
          <div style={{ position: 'absolute', top: -8, right: -6, fontSize: 40, opacity: 0.22, transform: 'rotate(18deg)' }}>🌿</div>
          <div style={{ position: 'absolute', bottom: 10, left: 14, fontSize: 22, opacity: 0.22, transform: 'rotate(-12deg)' }}>🌱</div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <window.MultiRing rings={rings} size={150} stroke={9} gap={3}>
              <div style={{ fontSize: 11, color: C.ink55, fontWeight: 700 }}>오늘 먹은 양</div>
              <div className="cal-num" style={{ fontSize: 36, fontWeight: 700, lineHeight: 1, marginTop: 4 }}>{D.kcal.toLocaleString()}</div>
              <div style={{ fontSize: 11, color: C.ink55, fontWeight: 600, marginTop: 4 }}>/ {D.goal.toLocaleString()} kcal</div>
            </window.MultiRing>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <NutrientPill color={C.carb}    name="탄수" val={D.c} target={150} icon="🍚" />
              <NutrientPill color={C.protein} name="단백" val={D.p} target={90}  icon="🍗" />
              <NutrientPill color={C.fat}     name="지방" val={D.f} target={60}  icon="🥑" />
            </div>
          </div>

          <div style={{ marginTop: 18, padding: '12px 14px', borderRadius: C.rMd, background: C.paper, display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ fontSize: 18 }}>{left > 0 ? '🌤' : '✨'}</div>
            <div style={{ flex: 1, fontSize: 13, fontWeight: 700 }}>
              {left > 0 ? (<>앞으로 <span style={{ color: C.vita }}>{left.toLocaleString()} kcal</span> 더 먹을 수 있어요</>) :
                          (<>목표를 <span style={{ color: C.vita }}>완벽하게</span> 달성했어요</>)}
            </div>
          </div>
        </div>

        {/* quick add row */}
        <div style={{ padding: '0 18px 14px', display: 'flex', gap: 8 }}>
          {[
            { emoji: '📷', label: '사진으로', cb: onPlus },
            { emoji: '🔍', label: '검색으로' },
            { emoji: '⭐', label: '즐겨찾기' },
          ].map(q => (
            <button key={q.label} onClick={q.cb} style={{
              flex: 1, padding: '12px 10px', borderRadius: C.rLg,
              background: C.card, border: `1px solid ${C.ink08}`,
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              fontFamily: 'inherit', cursor: 'pointer', color: C.ink,
            }}>
              <div style={{ fontSize: 22 }}>{q.emoji}</div>
              <div style={{ fontSize: 12, fontWeight: 700 }}>{q.label}</div>
            </button>
          ))}
        </div>

        {/* today's meals */}
        <div style={{ padding: '4px 22px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="cal-display" style={{ fontSize: 22, fontWeight: 700 }}>오늘의 식사</div>
          <div style={{ fontSize: 12, color: C.ink55, fontWeight: 700 }}>{D.meals.length}개</div>
        </div>

        <div style={{ padding: '0 18px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {D.meals.length === 0 && (
            <div style={{ padding: '30px 20px', borderRadius: C.rLg, border: `1.5px dashed ${C.ink15}`, textAlign: 'center', background: C.card }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>🍽</div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>아직 기록이 없어요</div>
              <div style={{ fontSize: 12, color: C.ink55, marginTop: 4 }}>사진으로 시작해보세요</div>
            </div>
          )}
          {D.meals.map((m, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 10, borderRadius: C.rLg, background: C.card, border: `1px solid ${C.ink08}` }}>
              <window.FoodImg src={m.photo} emoji={m.emoji} size={52} radius={18} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ fontSize: 10, color: C.ink55, fontFamily: C.fontNum, fontWeight: 700 }}>{m.time}</div>
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.name}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="cal-num" style={{ fontSize: 17, fontWeight: 700 }}>{m.kcal}</div>
                <div style={{ fontSize: 10, color: C.ink55, fontWeight: 700 }}>kcal</div>
              </div>
            </div>
          ))}
        </div>

        {/* insight */}
        {dataState !== 'empty' && (
          <div style={{ margin: '16px 18px 0', padding: 14, borderRadius: C.rLg, background: dataState === 'achieved' ? C.vitaSoft : C.carbSoft, display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ fontSize: 28 }}>{dataState === 'achieved' ? '🏆' : '💡'}</div>
            <div style={{ flex: 1, fontSize: 13, lineHeight: 1.45 }}>
              {dataState === 'achieved'
                ? <><b>7일 연속</b> 목표 달성! 이번주 평균 1,790 kcal 🌟</>
                : <><b>단백질</b>이 조금 부족해요. 저녁에 두부나 닭가슴살 어때요?</>}
            </div>
          </div>
        )}
      </div>

      <window.TabBar active="home" onTab={onTab} />
    </div>
  );
};

function NutrientPill({ color, name, val, target, icon }) {
  const C = window.CAL;
  const pct = Math.min(1, val / target);
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 3 }}>
        <span style={{ fontSize: 11 }}>{icon}</span>
        <span style={{ fontSize: 11, fontWeight: 700, color: C.ink70 }}>{name}</span>
        <div style={{ flex: 1 }} />
        <span className="cal-num" style={{ fontSize: 12, fontWeight: 700 }}>{val}</span>
        <span style={{ fontSize: 10, color: C.ink55, fontWeight: 700 }}>/{target}g</span>
      </div>
      <div style={{ height: 6, borderRadius: 3, background: C.ink08, overflow: 'hidden' }}>
        <div style={{ width: pct*100 + '%', height: '100%', background: color, borderRadius: 3, transition: 'width .3s' }} />
      </div>
    </div>
  );
}
