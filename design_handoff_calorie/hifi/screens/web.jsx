// ─── Web Landing ──────────────────────────────────────────────
window.WebLanding = function WebLanding() {
  const C = window.CAL;
  return (
    <div className="cal" style={{ width: 1280, height: 820, background: C.paper, overflow: 'hidden', position: 'relative' }}>
      {/* decorative */}
      <div style={{ position: 'absolute', top: -120, right: -100, width: 420, height: 420, borderRadius: '50%', background: C.glow, opacity: 0.5, filter: 'blur(20px)' }} />
      <div style={{ position: 'absolute', bottom: -180, left: -140, width: 480, height: 480, borderRadius: '50%', background: C.cardAlt, opacity: 0.4, filter: 'blur(24px)' }} />

      {/* nav */}
      <div style={{ position: 'relative', padding: '22px 48px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 36, height: 36, borderRadius: 18, background: C.vita, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🌱</div>
          <div className="cal-display" style={{ fontSize: 22, fontWeight: 700 }}>Calorie</div>
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', gap: 28, fontSize: 14, fontWeight: 700, color: C.ink70 }}>
          <span>기능</span><span>가격</span><span>블로그</span><span>자주 묻는 질문</span>
        </div>
        <window.BigBtn variant="accent" style={{ height: 44, width: 'auto', padding: '0 20px', fontSize: 14 }}>무료로 시작</window.BigBtn>
      </div>

      {/* hero */}
      <div style={{ position: 'relative', padding: '40px 48px 0', display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 40 }}>
        <div style={{ paddingTop: 40 }}>
          <window.Chip color={C.vita} sm>AI 영양사가 24시간 대기중</window.Chip>
          <div className="cal-display" style={{ fontSize: 68, fontWeight: 700, lineHeight: 1.05, marginTop: 18 }}>
            사진 한 장으로<br />
            <span style={{ color: C.vita }}>자연스럽게</span><br />
            챙기는 한 끼
          </div>
          <div style={{ fontSize: 17, color: C.ink70, marginTop: 20, lineHeight: 1.55, maxWidth: 460 }}>
            복잡한 계산은 그만. 식사 사진을 찍으면 AI가 칼로리와 영양소를 알아서 기록해줘요. 부족한 건 귀엽게 알려드릴게요 🌿
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
            <window.BigBtn variant="primary" style={{ width: 'auto', padding: '0 28px', height: 56 }}>
              📷 사진으로 시작하기
            </window.BigBtn>
            <window.BigBtn variant="ghost" style={{ width: 'auto', padding: '0 24px', height: 56 }}>데모 보기</window.BigBtn>
          </div>
          <div style={{ display: 'flex', gap: 18, marginTop: 24, fontSize: 12, color: C.ink55, fontWeight: 700 }}>
            <span>✓ 7일 무료</span>
            <span>✓ 카드 등록 필요 없음</span>
            <span>✓ 한국 음식 최적화</span>
          </div>
        </div>

        {/* hero visual — phone + stickers */}
        <div style={{ position: 'relative', height: 560, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ transform: 'rotate(-4deg) scale(0.82)' }}>
            <window.Phone width={300} height={620}>
              <window.HomeScreen dataState="normal" />
            </window.Phone>
          </div>

          {/* floating stickers */}
          <div style={{ position: 'absolute', top: 40, right: 30 }}>
            <window.Sticker bg={C.ink} color={C.paper} rot={8} size={14} style={{ padding: '10px 16px' }}>
              <span className="cal-num" style={{ fontSize: 22 }}>620</span>
              <span style={{ opacity: 0.7, fontSize: 11 }}>kcal</span>
            </window.Sticker>
          </div>
          <div style={{ position: 'absolute', top: 160, left: 10 }}>
            <window.Sticker bg={C.vita} color="#14231a" rot={-6}>
              <span>✓ 92% 정확</span>
            </window.Sticker>
          </div>
          <div style={{ position: 'absolute', bottom: 120, right: 0 }}>
            <window.Sticker bg={C.carb} color="#3a2a10" rot={6}>
              <span>🍚 탄수 82g</span>
            </window.Sticker>
          </div>
          <div style={{ position: 'absolute', bottom: 60, left: 30 }}>
            <window.Sticker bg={C.protein} color="#fff" rot={-8}>
              <span>🥚 단백 18g</span>
            </window.Sticker>
          </div>
        </div>
      </div>

      {/* bottom feature strip */}
      <div style={{ position: 'absolute', left: 48, right: 48, bottom: 36, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {[
          { e: '📷', t: '사진 한 장', d: '자동 인식' },
          { e: '🧮', t: '정확한 계산', d: '92% 신뢰도' },
          { e: '💡', t: '맞춤 제안', d: '부족한 영양소' },
          { e: '🌿', t: '자연스럽게', d: '압박 없이' },
        ].map((f, i) => (
          <div key={i} style={{ padding: '16px 18px', borderRadius: C.rLg, background: C.card, border: `1px solid ${C.ink08}`, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ fontSize: 26 }}>{f.e}</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{f.t}</div>
              <div style={{ fontSize: 11, color: C.ink55, fontWeight: 700, marginTop: 2 }}>{f.d}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Web Dashboard ────────────────────────────────────────────
window.WebDashboard = function WebDashboard() {
  const C = window.CAL;
  return (
    <div className="cal" style={{ width: 1280, height: 820, background: C.paper, display: 'flex', overflow: 'hidden' }}>
      {/* sidebar */}
      <div style={{ width: 220, background: C.card, borderRight: `1px solid ${C.ink08}`, padding: '22px 14px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 6px 20px' }}>
          <div style={{ width: 32, height: 32, borderRadius: 16, background: C.vita, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🌱</div>
          <div className="cal-display" style={{ fontSize: 20, fontWeight: 700 }}>Calorie</div>
        </div>

        {[
          { l: '대시보드', i: '◐', sel: true },
          { l: '기록',     i: '▤' },
          { l: '추천',     i: '⭐' },
          { l: '목표',     i: '🎯' },
          { l: '리포트',   i: '📊' },
        ].map(n => (
          <div key={n.l} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '9px 12px', borderRadius: C.rMd, marginBottom: 3,
            background: n.sel ? C.ink : 'transparent',
            color: n.sel ? C.paper : C.ink70,
            fontSize: 13, fontWeight: 700, cursor: 'pointer',
          }}>
            <span style={{ fontSize: 15 }}>{n.i}</span>
            <span>{n.l}</span>
          </div>
        ))}

        <div style={{ flex: 1 }} />

        <div style={{ padding: 14, borderRadius: C.rLg, background: C.cardAlt, textAlign: 'center' }}>
          <div style={{ fontSize: 28 }}>🌿</div>
          <div style={{ fontSize: 12, fontWeight: 700, marginTop: 6 }}>프로로 업그레이드</div>
          <div style={{ fontSize: 10, color: C.ink55, fontWeight: 700, marginTop: 3, marginBottom: 10 }}>AI 영양사 24시간</div>
          <div style={{ padding: '7px 10px', borderRadius: C.rPill, background: C.ink, color: C.paper, fontSize: 11, fontWeight: 700 }}>3,900원/월</div>
        </div>
      </div>

      {/* main */}
      <div style={{ flex: 1, padding: '24px 32px', overflow: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
          <div>
            <div style={{ fontSize: 12, color: C.ink55, fontWeight: 700 }}>수요일 · 4월 23일</div>
            <div className="cal-display" style={{ fontSize: 28, fontWeight: 700 }}>오늘 대시보드</div>
          </div>
          <div style={{ flex: 1 }} />
          <window.IconBtn size={40}><span style={{ fontSize: 16 }}>🔔</span></window.IconBtn>
          <div style={{ width: 40, height: 40, borderRadius: 20, background: C.vitaSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🌱</div>
        </div>

        {/* top row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr 1fr', gap: 14, marginBottom: 14 }}>
          <div style={{ padding: 22, borderRadius: C.rLg, background: C.card, border: `1px solid ${C.ink08}`, display: 'flex', gap: 20, alignItems: 'center' }}>
            <window.MultiRing size={140} stroke={10} gap={3} rings={[
              { value: 0.62, color: C.vita },
              { value: 0.61, color: C.carb },
              { value: 0.38, color: C.protein },
            ]}>
              <div className="cal-num" style={{ fontSize: 32, fontWeight: 700, lineHeight: 1 }}>62%</div>
              <div style={{ fontSize: 10, color: C.ink55, fontWeight: 700, marginTop: 2 }}>오늘 달성</div>
            </window.MultiRing>
            <div style={{ flex: 1 }}>
              <window.Label>TODAY</window.Label>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 4 }}>
                <div className="cal-num" style={{ fontSize: 36, fontWeight: 700 }}>1,156</div>
                <div style={{ fontSize: 14, color: C.ink55, fontWeight: 700 }}>/ 1,850</div>
              </div>
              <div style={{ fontSize: 12, color: C.ink70, fontWeight: 700, marginTop: 4 }}>앞으로 694 kcal 여유 있어요 🌤</div>
              <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
                <window.Chip color={C.carb} sm>🍚 92g</window.Chip>
                <window.Chip color={C.protein} sm>🥚 34g</window.Chip>
                <window.Chip color={C.fat} sm>🥑 28g</window.Chip>
              </div>
            </div>
          </div>

          <div style={{ padding: 18, borderRadius: C.rLg, background: C.cardAlt, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', bottom: -12, right: -8, fontSize: 90, opacity: 0.2 }}>🔥</div>
            <window.Label>STREAK</window.Label>
            <div className="cal-num" style={{ fontSize: 48, fontWeight: 700, marginTop: 4, lineHeight: 1 }}>7</div>
            <div style={{ fontSize: 12, color: C.ink70, fontWeight: 700, marginTop: 2 }}>일 연속 기록중</div>
            <div style={{ fontSize: 11, color: C.ink55, fontWeight: 700, marginTop: 6 }}>최고 기록 10일까지 3일</div>
          </div>

          <div style={{ padding: 18, borderRadius: C.rLg, background: C.card, border: `1px solid ${C.ink08}` }}>
            <window.Label>이번달 평균</window.Label>
            <div className="cal-num" style={{ fontSize: 30, fontWeight: 700, marginTop: 4, lineHeight: 1 }}>1,768</div>
            <div style={{ fontSize: 11, color: C.ink55, fontWeight: 700 }}>kcal / 일</div>
            <div style={{ marginTop: 12, height: 40, display: 'flex', alignItems: 'flex-end', gap: 3 }}>
              {[60,55,72,65,58,70,82,68,60,75,66,72,55,68].map((h,i) => (
                <div key={i} style={{ flex: 1, height: h+'%', background: i === 13 ? C.vita : C.ink15, borderRadius: 2 }} />
              ))}
            </div>
          </div>
        </div>

        {/* meal row */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 14 }}>
          <div style={{ padding: 18, borderRadius: C.rLg, background: C.card, border: `1px solid ${C.ink08}` }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 14 }}>
              <div className="cal-display" style={{ fontSize: 20, fontWeight: 700 }}>오늘의 식사</div>
              <div style={{ flex: 1 }} />
              <window.Chip sm>4개</window.Chip>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
              {[
                { e: '🥑', t: '아침 · 08:10', n: '아보카도 토스트', k: 320 },
                { p: 'hifi/assets/burger.jpg', t: '점심 · 13:10', n: '치즈버거 + 감자튀김', k: 960 },
                { e: '🍎', t: '간식 · 15:30', n: '사과 한 개', k: 95 },
                { e: '🥛', t: '저녁 · 18:00', n: '그릭요거트', k: 120 },
              ].map((m, i) => (
                <div key={i} style={{ padding: 12, borderRadius: C.rMd, background: C.paper, border: `1px solid ${C.ink08}` }}>
                  {m.p ? (
                    <div style={{ width: '100%', aspectRatio: '1 / 1', borderRadius: 10, backgroundImage: `url(${m.p})`, backgroundSize: 'cover', backgroundPosition: 'center', marginBottom: 2 }} />
                  ) : (
                    <div style={{ fontSize: 36 }}>{m.e}</div>
                  )}
                  <div style={{ fontSize: 10, color: C.ink55, fontWeight: 700, marginTop: 4, fontFamily: C.fontMono }}>{m.t}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.n}</div>
                  <div className="cal-num" style={{ fontSize: 16, fontWeight: 700, marginTop: 4 }}>{m.k}<span style={{ fontSize: 10, color: C.ink55 }}> kcal</span></div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ padding: 18, borderRadius: C.rLg, background: C.vitaSoft, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ fontSize: 30 }}>💡</div>
            <div className="cal-display" style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.3 }}>
              저녁엔 단백질<br />한 스푼 더 어때요?
            </div>
            <div style={{ fontSize: 12, color: C.ink70, lineHeight: 1.5 }}>
              오늘 단백질 34g — 목표의 38%예요. 두부, 닭가슴살, 계란 중에 골라보세요.
            </div>
            <div style={{ flex: 1 }} />
            <div style={{ padding: '9px 14px', borderRadius: C.rPill, background: C.ink, color: C.paper, fontSize: 12, fontWeight: 700, textAlign: 'center' }}>추천 받기 →</div>
          </div>
        </div>
      </div>
    </div>
  );
};
