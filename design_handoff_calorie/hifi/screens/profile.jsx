// ─── Profile · 웰니스 대시보드 ────────────────────────────────
window.ProfileScreen = function ProfileScreen({ onTab }) {
  const C = window.CAL;

  return (
    <div className="cal" style={{ height: '100%', background: C.paper, position: 'relative', overflow: 'hidden' }}>
      <div className="cal-scroll" style={{ height: '100%', paddingTop: 52, paddingBottom: 100 }}>

        {/* hero card */}
        <div style={{ margin: '8px 18px 14px', padding: 18, borderRadius: C.rXl, background: C.cardAlt, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -10, right: -6, fontSize: 54, opacity: 0.3, transform: 'rotate(14deg)' }}>🌿</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 64, height: 64, borderRadius: 32,
              background: `radial-gradient(circle at 30% 30%, ${C.paper}, ${C.card})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 30,
              border: `3px solid ${C.paper}`,
              boxShadow: C.shadowSm,
            }}>🌱</div>
            <div style={{ flex: 1 }}>
              <div className="cal-display" style={{ fontSize: 22, fontWeight: 700 }}>안녕, 지민님!</div>
              <div style={{ fontSize: 12, color: C.ink70, fontWeight: 700 }}>함께한 지 47일째 🎉</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            {[
              { n: '7', l: '연속 일수' },
              { n: '-3.2kg', l: '체중 변화' },
              { n: '94%', l: '기록률' },
            ].map((s, i) => (
              <div key={i} style={{ flex: 1, padding: '10px 8px', borderRadius: C.rMd, background: C.paper, textAlign: 'center' }}>
                <div className="cal-num" style={{ fontSize: 18, fontWeight: 700 }}>{s.n}</div>
                <div style={{ fontSize: 10, color: C.ink55, fontWeight: 700, marginTop: 2 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* goal progress */}
        <div style={{ margin: '0 18px 14px', padding: 16, borderRadius: C.rLg, background: C.card, border: `1px solid ${C.ink08}` }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <window.Label>목표까지</window.Label>
            <span style={{ fontSize: 11, color: C.ink55, fontWeight: 700 }}>64.3 → 58.0 kg</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 6 }}>
            <div className="cal-num" style={{ fontSize: 32, fontWeight: 700 }}>3.2</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.ink70 }}>kg 남았어요</div>
          </div>
          {/* track with markers */}
          <div style={{ position: 'relative', marginTop: 14, height: 24 }}>
            <div style={{ position: 'absolute', left: 0, right: 0, top: 10, height: 6, borderRadius: 3, background: C.ink08 }}>
              <div style={{ width: '52%', height: '100%', background: C.vita, borderRadius: 3 }} />
            </div>
            <div style={{ position: 'absolute', left: '52%', top: '50%', transform: 'translate(-50%,-50%)', width: 18, height: 18, borderRadius: 9, background: C.paper, border: `3px solid ${C.vita}` }} />
            <div style={{ position: 'absolute', left: 0, top: 22, fontSize: 10, color: C.ink55, fontFamily: C.fontMono, fontWeight: 700 }}>67.5</div>
            <div style={{ position: 'absolute', right: 0, top: 22, fontSize: 10, color: C.ink55, fontFamily: C.fontMono, fontWeight: 700 }}>58.0</div>
          </div>
        </div>

        {/* badges */}
        <div style={{ padding: '0 22px 8px' }}>
          <window.Label>받은 배지 <span style={{ fontSize: 10, opacity: 0.55 }}>· 8/30</span></window.Label>
        </div>
        <div style={{ padding: '0 14px 14px', display: 'flex', gap: 6, overflowX: 'auto' }}>
          {[
            { e: '🌱', l: '첫 걸음', got: true, bg: C.vitaSoft },
            { e: '🔥', l: '7일 연속', got: true, bg: C.carbSoft },
            { e: '📸', l: '50장 기록', got: true, bg: C.proteinSoft },
            { e: '⚖️', l: '-3kg', got: true, bg: C.fatSoft },
            { e: '🌙', l: '30일', got: false, bg: C.card },
            { e: '🏆', l: '목표 달성', got: false, bg: C.card },
          ].map((b, i) => (
            <div key={i} style={{
              flexShrink: 0, width: 74, padding: '12px 6px',
              borderRadius: C.rMd, background: b.bg,
              textAlign: 'center',
              border: `1px solid ${b.got ? 'transparent' : C.ink08}`,
              opacity: b.got ? 1 : 0.5,
            }}>
              <div style={{ fontSize: 28 }}>{b.got ? b.e : '🔒'}</div>
              <div style={{ fontSize: 10, fontWeight: 700, marginTop: 4, color: C.ink70 }}>{b.l}</div>
            </div>
          ))}
        </div>

        {/* wellness check-ins */}
        <div style={{ margin: '0 18px 14px' }}>
          <window.Label style={{ marginBottom: 8, padding: '0 4px' }}>이번주 기분</window.Label>
          <div style={{ padding: 14, borderRadius: C.rLg, background: C.card, border: `1px solid ${C.ink08}`, display: 'flex', justifyContent: 'space-around' }}>
            {['😊', '🙂', '😊', '😴', '😊', '🌟', '?'].map((e, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 18,
                  background: i === 6 ? C.ink08 : C.paper,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20, opacity: i === 6 ? 0.4 : 1,
                  border: i === 6 ? `1.5px dashed ${C.ink15}` : 'none',
                }}>{e}</div>
                <div style={{ fontSize: 9, color: C.ink55, marginTop: 4, fontWeight: 700 }}>{['월','화','수','목','금','토','일'][i]}</div>
              </div>
            ))}
          </div>
        </div>

        {/* settings list */}
        <div style={{ padding: '0 22px 8px' }}>
          <window.Label>설정</window.Label>
        </div>
        <div style={{ margin: '0 18px', borderRadius: C.rLg, background: C.card, border: `1px solid ${C.ink08}`, overflow: 'hidden' }}>
          {[
            { i: '🎯', l: '목표 수정', v: '1,850 kcal' },
            { i: '🔔', l: '알림 설정', v: '켜짐' },
            { i: '🌙', l: '다크 모드', v: '자동' },
            { i: '🌱', l: '앱 테마', v: '자연' },
          ].map((s, i, arr) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '14px 14px',
              borderBottom: i < arr.length - 1 ? `1px solid ${C.ink08}` : 'none',
            }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: C.paper, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>{s.i}</div>
              <div style={{ flex: 1, fontSize: 14, fontWeight: 700 }}>{s.l}</div>
              <div style={{ fontSize: 12, color: C.ink55, fontWeight: 700 }}>{s.v}</div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.ink40} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6"/></svg>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', fontSize: 10, color: C.ink40, fontFamily: C.fontMono, fontWeight: 700, padding: '18px 0 0' }}>
          Calorie v0.4 · made with 🌿
        </div>
      </div>

      <window.TabBar active="profile" onTab={onTab} />
    </div>
  );
};
