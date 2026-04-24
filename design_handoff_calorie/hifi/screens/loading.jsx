// ─── Loading · 분석 중 ───────────────────────────────────────
window.LoadingScreen = function LoadingScreen({ onDone }) {
  const C = window.CAL;
  const [progress, setProgress] = React.useState(0);
  const [stepIdx, setStepIdx] = React.useState(0);

  const steps = [
    { label: '사진 읽는 중', icon: '👀' },
    { label: '음식 찾는 중', icon: '🔍' },
    { label: '영양소 계산', icon: '🧮' },
    { label: '마무리 중',   icon: '✨' },
  ];

  React.useEffect(() => {
    const t = setInterval(() => {
      setProgress(p => {
        const n = p + 1.4;
        if (n >= 100) { clearInterval(t); setTimeout(() => onDone && onDone(), 300); return 100; }
        return n;
      });
    }, 45);
    return () => clearInterval(t);
  }, []);

  React.useEffect(() => {
    setStepIdx(Math.min(3, Math.floor(progress / 25)));
  }, [progress]);

  return (
    <div className="cal" style={{ height: '100%', background: C.paper, position: 'relative', overflow: 'hidden' }}>
      {/* background blobs */}
      <div style={{ position: 'absolute', top: -80, right: -60, width: 260, height: 260, borderRadius: '50%', background: C.glow, opacity: 0.5, filter: 'blur(10px)' }} />
      <div style={{ position: 'absolute', bottom: -90, left: -60, width: 220, height: 220, borderRadius: '50%', background: C.vitaSoft, opacity: 0.8, filter: 'blur(10px)' }} />

      <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', padding: '52px 22px 32px' }}>
        {/* header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <window.Label>GEMMA 4 · VISION</window.Label>
          <div style={{ flex: 1 }} />
          <div style={{ padding: '3px 10px', borderRadius: C.rPill, background: C.vitaSoft, color: C.vita, fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 6, height: 6, borderRadius: 3, background: C.vita }} className="cal-pulse" />
            분석중
          </div>
        </div>

        <div style={{ flex: 1 }} />

        {/* big donut */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'inline-block', position: 'relative' }}>
            <window.Ring value={progress / 100} color={C.vita} size={220} stroke={14} track={C.ink08}>
              <div style={{ fontSize: 40, marginBottom: 4 }} className="cal-bob">{steps[stepIdx].icon}</div>
              <div className="cal-num" style={{ fontSize: 42, fontWeight: 700, lineHeight: 1 }}>{Math.round(progress)}<span style={{ fontSize: 18, color: C.ink55 }}>%</span></div>
            </window.Ring>
          </div>
          <div className="cal-display" style={{ fontSize: 26, fontWeight: 700, marginTop: 24 }}>
            {steps[stepIdx].label}...
          </div>
          <div style={{ fontSize: 12, color: C.ink55, fontWeight: 700, marginTop: 4 }}>
            약 2.8초 · 이미지 1장
          </div>
        </div>

        <div style={{ flex: 1 }} />

        {/* step chips */}
        <div style={{ display: 'flex', gap: 6 }}>
          {steps.map((s, i) => {
            const done = i < stepIdx;
            const active = i === stepIdx;
            return (
              <div key={i} style={{
                flex: 1, padding: '8px 6px', borderRadius: C.rMd,
                background: active ? C.vita : (done ? C.vitaSoft : C.card),
                color: active ? '#14231a' : (done ? C.vita : C.ink40),
                textAlign: 'center', fontSize: 10, fontWeight: 700,
                border: `1px solid ${active ? C.vita : (done ? C.vita + '55' : C.ink08)}`,
              }}>
                <div style={{ fontSize: 14 }}>{done ? '✓' : s.icon}</div>
                <div style={{ marginTop: 2 }}>{s.label.replace(' 중', '')}</div>
              </div>
            );
          })}
        </div>

        {/* fun fact */}
        <div style={{ marginTop: 16, padding: 12, borderRadius: C.rLg, background: C.card, border: `1px solid ${C.ink08}`, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ fontSize: 20 }}>💭</div>
          <div style={{ flex: 1, fontSize: 12, color: C.ink70 }}>
            <b>알고 계셨어요?</b> 치즈버거 한 개에는 평균 520 kcal, 감자튀김 한 봉엔 310 kcal 정도 들어있어요.
          </div>
        </div>
      </div>
    </div>
  );
};
