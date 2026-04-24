// ─── Result · 스티커 스타일 ──────────────────────────────────
window.ResultScreen = function ResultScreen({ onClose, onSave }) {
  const C = window.CAL;

  const meal = {
    name: '치즈버거 + 감자튀김',
    time: '13:10',
    kcal: 960, pct: 52,
    c: 98, p: 42, f: 48,
    confidence: 94,
    photo: 'hifi/assets/burger.jpg',
    items: [
      { name: '치즈버거',     kcal: 620, g: 240, emoji: '🍔' },
      { name: '감자튀김',     kcal: 310, g: 150, emoji: '🍟' },
      { name: '양상추 · 토마토', kcal: 20,  g: 30,  emoji: '🥬' },
      { name: '베이컨',       kcal: 80,  g: 20,  emoji: '🥓' },
    ],
  };

  return (
    <div className="cal" style={{ height: '100%', background: C.paper, position: 'relative', overflow: 'hidden' }}>
      {/* close */}
      <div style={{ position: 'absolute', top: 52, left: 18, zIndex: 30 }}>
        <window.IconBtn onClick={onClose} size={36}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </window.IconBtn>
      </div>
      <div style={{ position: 'absolute', top: 52, right: 18, zIndex: 30, display: 'flex', gap: 8 }}>
        <window.IconBtn size={36}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 10.5l6.8-4M8.6 13.5l6.8 4"/></svg>
        </window.IconBtn>
        <window.IconBtn size={36}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
        </window.IconBtn>
      </div>

      <div className="cal-scroll" style={{ height: '100%', paddingTop: 100, paddingBottom: 110 }}>
        {/* sticker hero */}
        <div style={{ padding: '0 20px 20px', position: 'relative' }}>
          {/* photo card with stickers */}
          <div style={{ position: 'relative', borderRadius: C.rXl, overflow: 'visible', aspectRatio: '1 / 0.92', backgroundImage: `url(${meal.photo})`, backgroundSize: 'cover', backgroundPosition: 'center', boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.06)' }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: C.rXl, background: 'linear-gradient(180deg, transparent 55%, rgba(0,0,0,0.15))' }} />

            {/* kcal sticker */}
            <div style={{ position: 'absolute', top: -14, right: 16 }}>
              <window.Sticker bg={C.ink} color={C.paper} rot={6} size={14} style={{ padding: '10px 16px', borderRadius: 22 }}>
                <span className="cal-num" style={{ fontSize: 22, fontWeight: 700 }}>960</span>
                <span style={{ fontSize: 11, opacity: 0.7 }}>kcal</span>
              </window.Sticker>
            </div>

            {/* confidence sticker */}
            <div style={{ position: 'absolute', top: 20, left: -6 }}>
              <window.Sticker bg={C.vita} color="#14231a" rot={-8} size={12}>
                <span>✓</span>
                <span>{meal.confidence}%</span>
                <span style={{ opacity: 0.7, fontWeight: 600 }}>정확</span>
              </window.Sticker>
            </div>

            {/* carb sticker */}
            <div style={{ position: 'absolute', bottom: 14, left: 14 }}>
              <window.Sticker bg={C.carb} color="#3a2a10" rot={-5} size={12}>
                <span>🍞</span>
                <span>탄수</span>
                <span className="cal-num" style={{ fontSize: 14 }}>{meal.c}g</span>
              </window.Sticker>
            </div>

            {/* protein sticker */}
            <div style={{ position: 'absolute', bottom: 40, right: 16 }}>
              <window.Sticker bg={C.protein} color="#fff" rot={4} size={12}>
                <span>🥩</span>
                <span>단백</span>
                <span className="cal-num" style={{ fontSize: 14 }}>{meal.p}g</span>
              </window.Sticker>
            </div>

            {/* fat sticker */}
            <div style={{ position: 'absolute', bottom: 10, right: 30 }}>
              <window.Sticker bg={C.fat} color="#3a2740" rot={7} size={12}>
                <span>🧀</span>
                <span>지방</span>
                <span className="cal-num" style={{ fontSize: 14 }}>{meal.f}g</span>
              </window.Sticker>
            </div>

            {/* time tag */}
            <div style={{ position: 'absolute', top: 18, right: 100 }}>
              <window.Sticker bg={C.card} color={C.ink70} rot={-3} size={11} style={{ padding: '5px 10px' }}>
                <span className="cal-mono">{meal.time}</span>
                <span style={{ opacity: 0.6 }}>· 점심</span>
              </window.Sticker>
            </div>
          </div>
        </div>

        {/* title */}
        <div style={{ padding: '0 22px 14px' }}>
          <div className="cal-display" style={{ fontSize: 28, fontWeight: 700, lineHeight: 1.2 }}>{meal.name}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 6 }}>
            <window.Chip color={C.vita} sm>AI 자동 분석</window.Chip>
            <span style={{ fontSize: 12, color: C.ink55, fontWeight: 700 }}>오늘 목표의 <b style={{ color: C.ink }}>{meal.pct}%</b></span>
          </div>
        </div>

        {/* items breakdown */}
        <div style={{ padding: '6px 18px' }}>
          <window.Label style={{ padding: '0 4px 8px' }}>인식된 음식 {meal.items.length}개</window.Label>
          <div style={{ background: C.card, borderRadius: C.rLg, border: `1px solid ${C.ink08}`, overflow: 'hidden' }}>
            {meal.items.map((it, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 14px',
                borderBottom: i < meal.items.length - 1 ? `1px solid ${C.ink08}` : 'none',
              }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 12,
                  background: C.paper, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20,
                }}>{it.emoji}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{it.name}</div>
                  <div style={{ fontSize: 11, color: C.ink55, fontFamily: C.fontNum, fontWeight: 700, marginTop: 1 }}>{it.g}g</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="cal-num" style={{ fontSize: 16, fontWeight: 700 }}>{it.kcal}</div>
                  <div style={{ fontSize: 10, color: C.ink55, fontWeight: 700 }}>kcal</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* wellness tip */}
        <div style={{ margin: '14px 18px 0', padding: 14, borderRadius: C.rLg, background: C.vitaSoft, display: 'flex', gap: 10 }}>
          <div style={{ fontSize: 22 }}>🌿</div>
          <div style={{ flex: 1, fontSize: 12, lineHeight: 1.5, color: C.ink }}>
            <b>오늘 목표의 52%</b>를 이 한 끼로 쓰셨네요. 저녁엔 가벼운 샐러드나 두부 요리 어때요?
          </div>
        </div>
      </div>

      {/* bottom action */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '12px 18px 28px', background: `linear-gradient(to top, ${C.paper} 72%, transparent)`, display: 'flex', gap: 10, zIndex: 20 }}>
        <window.IconBtn size={54} bg={C.card} style={{ borderRadius: C.rPill }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 1 1 3 3L7 19l-4 1 1-4z"/></svg>
        </window.IconBtn>
        <window.BigBtn onClick={onSave} variant="accent" style={{ flex: 1 }}>
          오늘에 기록하기 🌱
        </window.BigBtn>
      </div>
    </div>
  );
};
