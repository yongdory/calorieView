// ─── Gallery · 앨범에서 선택 ──────────────────────────────────
window.GalleryScreen = function GalleryScreen({ onClose, onAnalyze }) {
  const C = window.CAL;
  const [sel, setSel] = React.useState(new Set([2]));

  // user-uploaded or generic food pics — using placeholders for now
  const photos = [
    { photo: 'hifi/assets/burger.jpg', tag: '지금' },
    { emoji: '🥗', tag: '1시간 전' },
    { emoji: '🍳', tag: '아침' },
    { emoji: '🍎', tag: '어제' },
    { emoji: '🥐', tag: '어제' },
    { emoji: '☕', tag: '어제' },
    { emoji: '🍱', tag: '2일 전' },
    { emoji: '🥑', tag: '2일 전' },
    { emoji: '🍝', tag: '3일 전' },
    { emoji: '🍣', tag: '3일 전' },
    { emoji: '🥙', tag: '4일 전' },
    { emoji: '🍛', tag: '4일 전' },
  ];

  const toggle = (i) => {
    const s = new Set(sel);
    s.has(i) ? s.delete(i) : s.add(i);
    setSel(s);
  };

  const tabs = ['최근', '음식', '즐겨찾기', '공유됨'];
  const [tab, setTab] = React.useState('최근');

  return (
    <div className="cal" style={{ height: '100%', background: C.paper, position: 'relative', overflow: 'hidden' }}>
      {/* header */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 30, paddingTop: 48, background: C.paper, borderBottom: `1px solid ${C.ink08}` }}>
        <div style={{ padding: '10px 18px 8px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <window.IconBtn onClick={onClose} size={36}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </window.IconBtn>
          <div style={{ flex: 1 }}>
            <div className="cal-display" style={{ fontSize: 20, fontWeight: 700 }}>사진 고르기</div>
            <div style={{ fontSize: 11, color: C.ink55, fontWeight: 700, marginTop: 1 }}>{sel.size}장 선택됨</div>
          </div>
          <window.IconBtn size={36}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
          </window.IconBtn>
        </div>
        {/* tabs */}
        <div style={{ padding: '4px 18px 10px', display: 'flex', gap: 6 }}>
          {tabs.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '6px 12px', borderRadius: C.rPill,
              background: tab === t ? C.ink : 'transparent',
              color: tab === t ? C.paper : C.ink70,
              border: `1px solid ${tab === t ? C.ink : C.ink15}`,
              fontSize: 12, fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer',
            }}>{t}</button>
          ))}
        </div>
      </div>

      {/* photo grid */}
      <div className="cal-scroll" style={{ height: '100%', paddingTop: 142, paddingBottom: 110, paddingLeft: 4, paddingRight: 4 }}>
        <div style={{ padding: '8px 14px 4px', fontSize: 11, color: C.ink55, fontWeight: 700, fontFamily: C.fontMono, letterSpacing: 0.5 }}>오늘</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4, padding: '0 4px' }}>
          {photos.slice(0, 3).map((p, i) => <PhotoTile key={i} i={i} p={p} selected={sel.has(i)} onToggle={() => toggle(i)} order={[...sel].indexOf(i) + 1} />)}
        </div>
        <div style={{ padding: '14px 14px 4px', fontSize: 11, color: C.ink55, fontWeight: 700, fontFamily: C.fontMono, letterSpacing: 0.5 }}>어제</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4, padding: '0 4px' }}>
          {photos.slice(3, 6).map((p, i) => <PhotoTile key={i+3} i={i+3} p={p} selected={sel.has(i+3)} onToggle={() => toggle(i+3)} order={[...sel].indexOf(i+3) + 1} />)}
        </div>
        <div style={{ padding: '14px 14px 4px', fontSize: 11, color: C.ink55, fontWeight: 700, fontFamily: C.fontMono, letterSpacing: 0.5 }}>지난 주</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4, padding: '0 4px' }}>
          {photos.slice(6).map((p, i) => <PhotoTile key={i+6} i={i+6} p={p} selected={sel.has(i+6)} onToggle={() => toggle(i+6)} order={[...sel].indexOf(i+6) + 1} />)}
        </div>
      </div>

      {/* bottom action */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '12px 18px 26px', background: `linear-gradient(to top, ${C.paper} 72%, transparent)`, zIndex: 20 }}>
        <window.BigBtn onClick={onAnalyze} variant={sel.size > 0 ? 'primary' : 'ghost'}>
          {sel.size > 0 ? `${sel.size}장 분석하기` : '사진을 선택하세요'}
          {sel.size > 0 && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>}
        </window.BigBtn>
      </div>
    </div>
  );
};

function PhotoTile({ p, selected, onToggle, order }) {
  const C = window.CAL;
  return (
    <button onClick={onToggle} style={{
      position: 'relative', aspectRatio: '1 / 1',
      borderRadius: 14, overflow: 'hidden',
      border: selected ? `3px solid ${C.vita}` : `1px solid ${C.ink08}`,
      padding: 0, background: 'transparent', cursor: 'pointer', fontFamily: 'inherit',
    }}>
      {p.photo ? (
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${p.photo})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
      ) : (
        <div style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(circle at 30% 25%, ${C.cardAlt}, ${C.paperDeep})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 42,
        }}>{p.emoji}</div>
      )}
      {/* time tag */}
      <div style={{ position: 'absolute', bottom: 4, left: 4, padding: '2px 6px', borderRadius: 6, background: 'rgba(0,0,0,0.55)', color: '#fff', fontSize: 9, fontWeight: 700, fontFamily: C.fontMono }}>
        {p.tag}
      </div>
      {/* select indicator */}
      <div style={{
        position: 'absolute', top: 6, right: 6,
        width: 22, height: 22, borderRadius: 11,
        background: selected ? C.vita : 'rgba(255,255,255,0.35)',
        border: selected ? 'none' : '1.5px solid #fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#14231a', fontSize: 11, fontWeight: 700, fontFamily: C.fontNum,
      }}>
        {selected ? order : ''}
      </div>
    </button>
  );
}
