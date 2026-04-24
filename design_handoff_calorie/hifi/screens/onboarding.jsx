// ─── Onboarding A · 따뜻한 단계별 (3 steps) ───────────────────
// Step 1: 목표 선택 (감량/유지/증량 + 현재/목표 체중)
// Step 2: 활동량 + 권장 칼로리 확정
// Step 3: 식단 선호 + 완료

window.OnboardingScreen = function OnboardingScreen({ step: stepProp = 1, onNext, onBack, onDone }) {
  const C = window.CAL;
  const [step, setStep] = React.useState(stepProp);
  React.useEffect(() => setStep(stepProp), [stepProp]);

  const next = () => {
    if (step < 3) setStep(step + 1);
    else onDone && onDone();
  };
  const back = () => {
    if (step > 1) setStep(step - 1);
    else onBack && onBack();
  };

  return (
    <div className="cal" style={{ height: '100%', background: C.paper, position: 'relative', overflow: 'hidden' }}>
      {/* soft blobs */}
      <div style={{ position: 'absolute', top: -80, right: -60, width: 240, height: 240, borderRadius: '50%', background: C.glow, opacity: 0.6, filter: 'blur(8px)' }} />
      <div style={{ position: 'absolute', bottom: -100, left: -80, width: 220, height: 220, borderRadius: '50%', background: C.cardAlt, opacity: 0.5, filter: 'blur(10px)' }} />

      <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', padding: '52px 22px 28px' }}>
        {/* top nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
          <window.IconBtn onClick={back} size={36} bg={C.card}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          </window.IconBtn>
          {/* progress */}
          <div style={{ flex: 1, display: 'flex', gap: 6 }}>
            {[1,2,3].map(i => (
              <div key={i} style={{ flex: 1, height: 5, borderRadius: 3, background: i <= step ? C.ink : C.ink15, transition: 'background .2s' }} />
            ))}
          </div>
          <div style={{ fontSize: 12, color: C.ink55, fontFamily: C.fontNum, fontWeight: 700 }}>{step}/3</div>
        </div>

        {step === 1 && <Step1 />}
        {step === 2 && <Step2 />}
        {step === 3 && <Step3 />}

        <div style={{ flex: 1 }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 16 }}>
          {step === 3 ? (
            <window.BigBtn onClick={next} variant="accent">
              시작하기
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
            </window.BigBtn>
          ) : (
            <window.BigBtn onClick={next}>
              다음
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
            </window.BigBtn>
          )}
        </div>
      </div>
    </div>
  );
};

// ─ Step 1: 목표 ──────────────────────────────────────────
function Step1() {
  const C = window.CAL;
  const [goal, setGoal] = React.useState('감량');
  const [weight, setWeight] = React.useState(64);
  const [target, setTarget] = React.useState(58);

  const goals = [
    { id: '감량', emoji: '🌱', sub: '천천히 건강하게' },
    { id: '유지', emoji: '🌿', sub: '지금 이대로' },
    { id: '증량', emoji: '🌳', sub: '근육을 키워요' },
  ];

  return (
    <>
      <div>
        <div style={{ fontSize: 13, color: C.ink55, fontWeight: 700 }}>안녕하세요 👋</div>
        <div className="cal-display" style={{ fontSize: 34, fontWeight: 700, marginTop: 4, lineHeight: 1.15 }}>
          어떤 목표를<br />세우고 계신가요?
        </div>
      </div>

      <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {goals.map(g => {
          const sel = goal === g.id;
          return (
            <button key={g.id} onClick={() => setGoal(g.id)} style={{
              padding: '16px 18px', borderRadius: C.rLg,
              background: sel ? C.ink : C.card,
              color: sel ? C.paper : C.ink,
              border: `1.5px solid ${sel ? C.ink : C.ink08}`,
              display: 'flex', alignItems: 'center', gap: 14,
              cursor: 'pointer', fontFamily: 'inherit',
              boxShadow: sel ? C.shadowMd : 'none',
              transition: 'all .15s',
            }}>
              <div style={{
                width: 46, height: 46, borderRadius: 23,
                background: sel ? 'rgba(255,255,255,0.15)' : C.paperDeep,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22,
              }}>{g.emoji}</div>
              <div style={{ flex: 1, textAlign: 'left' }}>
                <div style={{ fontSize: 17, fontWeight: 700 }}>{g.id}</div>
                <div style={{ fontSize: 12, opacity: 0.65, marginTop: 1 }}>{g.sub}</div>
              </div>
              <div style={{
                width: 22, height: 22, borderRadius: 11,
                border: `2px solid ${sel ? C.paper : C.ink25}`,
                background: sel ? C.paper : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {sel && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.ink} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7"/></svg>}
              </div>
            </button>
          );
        })}
      </div>

      <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
        <NumCard label="현재 체중" value={weight} unit="kg" onMinus={() => setWeight(weight-0.5)} onPlus={() => setWeight(weight+0.5)} />
        <NumCard label="목표 체중" value={target} unit="kg" accent onMinus={() => setTarget(target-0.5)} onPlus={() => setTarget(target+0.5)} />
      </div>
    </>
  );
}

function NumCard({ label, value, unit, accent, onMinus, onPlus }) {
  const C = window.CAL;
  return (
    <div style={{ flex: 1, padding: 14, borderRadius: C.rLg, background: accent ? C.vitaSoft : C.card, border: `1px solid ${accent ? C.vita + '55' : C.ink08}` }}>
      <div style={{ fontSize: 11, color: C.ink55, fontWeight: 700 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
        <button onClick={onMinus} style={{ width: 26, height: 26, borderRadius: 13, border: `1px solid ${C.ink15}`, background: C.paper, color: C.ink, cursor: 'pointer', fontSize: 14, fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
        <div className="cal-num" style={{ flex: 1, textAlign: 'center', fontSize: 24, fontWeight: 700 }}>
          {value}<span style={{ fontSize: 12, color: C.ink55, marginLeft: 2 }}>{unit}</span>
        </div>
        <button onClick={onPlus} style={{ width: 26, height: 26, borderRadius: 13, border: `1px solid ${C.ink15}`, background: C.paper, color: C.ink, cursor: 'pointer', fontSize: 14, fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
      </div>
    </div>
  );
}

// ─ Step 2: 활동 ──────────────────────────────────────────
function Step2() {
  const C = window.CAL;
  const [act, setAct] = React.useState(2);
  const levels = [
    { id: 0, label: '거의 안 움직여요', emoji: '😴', sub: '앉아서 보내는 시간이 많음' },
    { id: 1, label: '가끔 움직여요',     emoji: '🚶', sub: '주 1-2회 가벼운 활동' },
    { id: 2, label: '꾸준히 움직여요',   emoji: '🏃', sub: '주 3-5회 규칙적인 운동' },
    { id: 3, label: '많이 움직여요',     emoji: '⚡', sub: '매일 강도 높은 활동' },
  ];
  const kcalTable = [1650, 1850, 2050, 2280];
  const kcal = kcalTable[act];

  return (
    <>
      <div>
        <div style={{ fontSize: 13, color: C.ink55, fontWeight: 700 }}>거의 다 왔어요</div>
        <div className="cal-display" style={{ fontSize: 34, fontWeight: 700, marginTop: 4, lineHeight: 1.15 }}>
          얼마나 자주<br />움직이세요?
        </div>
      </div>

      <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {levels.map(l => {
          const sel = act === l.id;
          return (
            <button key={l.id} onClick={() => setAct(l.id)} style={{
              padding: '12px 14px', borderRadius: C.rMd,
              background: sel ? C.vita : C.card,
              color: sel ? '#14231a' : C.ink,
              border: `1.5px solid ${sel ? C.vita : C.ink08}`,
              display: 'flex', alignItems: 'center', gap: 12,
              cursor: 'pointer', fontFamily: 'inherit',
              boxShadow: sel ? C.shadowSm : 'none',
            }}>
              <div style={{ fontSize: 24 }}>{l.emoji}</div>
              <div style={{ flex: 1, textAlign: 'left' }}>
                <div style={{ fontSize: 15, fontWeight: 700 }}>{l.label}</div>
                <div style={{ fontSize: 11, opacity: 0.65, marginTop: 1 }}>{l.sub}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* recommended kcal preview */}
      <div style={{ marginTop: 18, padding: 16, borderRadius: C.rLg, background: C.cardAlt, display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ fontSize: 32 }}>🎯</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.ink70 }}>하루 권장 칼로리</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 2 }}>
            <div className="cal-num" style={{ fontSize: 28, fontWeight: 700 }}>{kcal.toLocaleString()}</div>
            <div style={{ fontSize: 13, color: C.ink70, fontWeight: 700 }}>kcal</div>
          </div>
        </div>
      </div>
    </>
  );
}

// ─ Step 3: 식단 선호 ────────────────────────────────────
function Step3() {
  const C = window.CAL;
  const [picks, setPicks] = React.useState(new Set(['일반식', '한식']));
  const toggle = (x) => { const s = new Set(picks); s.has(x) ? s.delete(x) : s.add(x); setPicks(s); };

  const tags = [
    { g: '식단 스타일', items: ['일반식', '비건', '채식', '저탄고지', '고단백', '지중해식'] },
    { g: '선호 음식',   items: ['한식', '양식', '일식', '중식', '간편식', '샐러드'] },
    { g: '피하는 것',   items: ['매운맛 🌶', '유제품 🥛', '글루텐 🌾', '견과류 🥜'] },
  ];

  return (
    <>
      <div>
        <div style={{ fontSize: 13, color: C.ink55, fontWeight: 700 }}>마지막이에요!</div>
        <div className="cal-display" style={{ fontSize: 34, fontWeight: 700, marginTop: 4, lineHeight: 1.15 }}>
          어떤 음식을<br />좋아하세요?
        </div>
      </div>

      <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 16, overflowY: 'auto' }}>
        {tags.map(g => (
          <div key={g.g}>
            <window.Label style={{ marginBottom: 8 }}>{g.g}</window.Label>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {g.items.map(it => {
                const sel = picks.has(it);
                return (
                  <button key={it} onClick={() => toggle(it)} style={{
                    padding: '7px 13px', borderRadius: C.rPill,
                    background: sel ? C.ink : 'transparent',
                    color: sel ? C.paper : C.ink70,
                    border: `1.5px solid ${sel ? C.ink : C.ink15}`,
                    fontSize: 13, fontWeight: 700, fontFamily: 'inherit',
                    cursor: 'pointer',
                  }}>{it}</button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
