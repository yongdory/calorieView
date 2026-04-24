// ─── History · 트렌드 라인 ────────────────────────────────────
window.HistoryScreen = function HistoryScreen({ onTab }) {
  const C = window.CAL;
  const [range, setRange] = React.useState('주간');

  // kcal data (last 14 days)
  const data = [1920, 1760, 1820, 2050, 1680, 1890, 1756, 1950, 1820, 1720, 1680, 1950, 1860, 1756];
  const goal = 1850;
  const min = 1500, max = 2200;
  const W = 284, H = 130;

  const pts = data.map((v, i) => ({
    x: (i / (data.length - 1)) * W,
    y: H - ((v - min) / (max - min)) * H,
  }));
  const path = pts.map((p, i) => (i === 0 ? 'M' : 'L') + p.x + ' ' + p.y).join(' ');
  const area = path + ` L${W} ${H} L0 ${H} Z`;
  const avg = Math.round(data.reduce((s, x) => s + x, 0) / data.length);

  const ranges = ['주간', '월간', '연간'];

  return (
    <div className="cal" style={{ height: '100%', background: C.paper, position: 'relative', overflow: 'hidden' }}>
      <div className="cal-scroll" style={{ height: '100%', paddingTop: 52, paddingBottom: 100 }}>
        {/* header */}
        <div style={{ padding: '8px 22px 14px' }}>
          <window.Label>YOUR JOURNEY</window.Label>
          <div className="cal-display" style={{ fontSize: 28, fontWeight: 700, marginTop: 2 }}>내 기록</div>
        </div>

        {/* range tabs */}
        <div style={{ padding: '0 18px 14px', display: 'flex', gap: 6 }}>
          {ranges.map(r => (
            <button key={r} onClick={() => setRange(r)} style={{
              padding: '7px 14px', borderRadius: C.rPill,
              background: range === r ? C.ink : C.card,
              color: range === r ? C.paper : C.ink70,
              border: `1px solid ${range === r ? C.ink : C.ink08}`,
              fontSize: 12, fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer',
            }}>{r}</button>
          ))}
          <div style={{ flex: 1 }} />
          <window.IconBtn size={32} style={{ fontSize: 14 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M7 12h10M11 18h2"/></svg>
          </window.IconBtn>
        </div>

        {/* main chart card */}
        <div style={{ margin: '0 18px 14px', padding: 18, borderRadius: C.rLg, background: C.card, border: `1px solid ${C.ink08}` }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <div>
              <window.Label>AVG DAILY · 14일</window.Label>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 2 }}>
                <div className="cal-num" style={{ fontSize: 40, fontWeight: 700, lineHeight: 1 }}>{avg.toLocaleString()}</div>
                <div style={{ fontSize: 13, color: C.ink70, fontWeight: 700 }}>kcal</div>
              </div>
            </div>
            <div style={{ flex: 1 }} />
            <window.Chip color={C.vita} filled sm>↓ 4% vs 지난주</window.Chip>
          </div>

          <svg width={W} height={H + 26} style={{ marginTop: 16, overflow: 'visible' }}>
            {/* goal line */}
            <line x1={0} x2={W} y1={H - ((goal-min)/(max-min))*H} y2={H - ((goal-min)/(max-min))*H}
              stroke={C.vita} strokeWidth="1.2" strokeDasharray="4 3" />
            <text x={W} y={H - ((goal-min)/(max-min))*H - 5} fill={C.vita} fontSize="9" fontWeight="700" textAnchor="end" fontFamily={C.fontMono}>목표 {goal}</text>

            {/* area */}
            <path d={area} fill={C.ink} opacity="0.05" />
            {/* line */}
            <path d={path} fill="none" stroke={C.ink} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
            {/* points */}
            {pts.map((p, i) => {
              const today = i === data.length - 1;
              return (
                <g key={i}>
                  {today && <circle cx={p.x} cy={p.y} r="10" fill={C.vita} opacity="0.22" />}
                  <circle cx={p.x} cy={p.y} r={today ? 5 : 2.5} fill={today ? C.vita : C.paper} stroke={C.ink} strokeWidth="1.5" />
                </g>
              );
            })}
            {/* x labels */}
            {[0, 7, 13].map(i => (
              <text key={i} x={pts[i].x} y={H + 18} fill={C.ink55} fontSize="9" fontWeight="700" textAnchor={i === 0 ? 'start' : i === 13 ? 'end' : 'middle'} fontFamily={C.fontMono}>
                {['2주전','1주전','오늘'][[0,7,13].indexOf(i)]}
              </text>
            ))}
          </svg>
        </div>

        {/* nutrient average cards */}
        <div style={{ padding: '0 18px 14px' }}>
          <window.Label style={{ marginBottom: 8, padding: '0 4px' }}>이번주 평균 영양소</window.Label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            {[
              { name: '탄수', v: 128, g: 150, c: C.carb, trend: '-3%' },
              { name: '단백', v: 58,  g: 90,  c: C.protein, trend: '-8%' },
              { name: '지방', v: 42,  g: 60,  c: C.fat, trend: '+2%' },
            ].map(x => (
              <div key={x.name} style={{ padding: 12, borderRadius: C.rMd, background: x.c + '22', border: `1px solid ${x.c}44` }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: C.ink70 }}>{x.name}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, marginTop: 2 }}>
                  <div className="cal-num" style={{ fontSize: 20, fontWeight: 700 }}>{x.v}</div>
                  <div style={{ fontSize: 10, color: C.ink55, fontWeight: 700 }}>g</div>
                </div>
                <div style={{ fontSize: 10, color: C.ink55, fontWeight: 700, marginTop: 2 }}>{x.trend}</div>
              </div>
            ))}
          </div>
        </div>

        {/* streak / badges */}
        <div style={{ margin: '0 18px 14px', padding: 16, borderRadius: C.rLg, background: C.cardAlt, display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ fontSize: 38 }}>🔥</div>
          <div style={{ flex: 1 }}>
            <div className="cal-display" style={{ fontSize: 22, fontWeight: 700 }}>7일 연속 기록!</div>
            <div style={{ fontSize: 11, color: C.ink70, fontWeight: 700 }}>4/17 이후 · 최고 기록까지 3일 남음</div>
          </div>
        </div>

        {/* recent meals */}
        <div style={{ padding: '0 22px 8px' }}>
          <window.Label>최근 기록</window.Label>
        </div>
        <div style={{ padding: '0 18px' }}>
          {[
            { day: '어제 · 화', kcal: 1820, meals: 3, tag: '🎯 목표 달성' },
            { day: '4월 21일 · 월', kcal: 2050, meals: 4, tag: '📈 조금 초과' },
            { day: '4월 20일 · 일', kcal: 1680, meals: 3, tag: '✨ 좋아요' },
          ].map((d, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', marginBottom: 6, borderRadius: C.rLg, background: C.card, border: `1px solid ${C.ink08}` }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{d.day}</div>
                <div style={{ fontSize: 11, color: C.ink55, fontWeight: 700, marginTop: 1 }}>{d.tag} · {d.meals}끼</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="cal-num" style={{ fontSize: 17, fontWeight: 700 }}>{d.kcal.toLocaleString()}</div>
                <div style={{ fontSize: 10, color: C.ink55, fontWeight: 700 }}>kcal</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <window.TabBar active="history" onTab={onTab} />
    </div>
  );
};
