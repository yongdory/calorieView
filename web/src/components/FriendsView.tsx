import { useEffect, useState } from 'react';
import { tokens as T } from '../lib/tokens';
import { Card, IconBtn } from './ui/primitives';
import { fetchFriendsToday, syncKakaoFriends, getKakaoToken, type FriendSummary } from '../lib/friends';

interface Props {
  onBack: () => void;
  onOpenFriendDay: (friend: FriendSummary) => void;
}

export function FriendsView({ onBack, onOpenFriendDay }: Props) {
  const [friends, setFriends] = useState<FriendSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function refresh() {
    try {
      const list = await fetchFriendsToday();
      setFriends(list);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : '불러오기 실패');
    }
  }

  useEffect(() => { refresh().finally(() => setLoading(false)); }, []);

  async function onSync() {
    setErr(null); setMsg(null);
    if (!getKakaoToken()) {
      setErr('카카오 친구 동기화는 카카오 로그인 후에만 가능해요. 다시 로그인해 주세요.');
      return;
    }
    setSyncing(true);
    try {
      const r = await syncKakaoFriends();
      setMsg(`친구 ${r.matched}명 매칭 완료`);
      await refresh();
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : '동기화 실패');
    } finally {
      setSyncing(false);
    }
  }

  return (
    <div className="cal" style={{ minHeight: '100vh', background: T.color.paper }}>
      <div className="cal-scroll" style={{ maxWidth: 460, margin: '0 auto', padding: '16px 0 100px' }}>
        <div style={{ padding: '8px 18px 6px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <IconBtn onClick={onBack} size={36}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </IconBtn>
          <div style={{ flex: 1 }}>
            <div className="cal-display" style={{ fontSize: 22, fontWeight: 700 }}>친구들의 오늘</div>
            <div style={{ fontSize: 12, color: T.color.ink55, fontWeight: 700 }}>같은 앱을 쓰는 카톡 친구</div>
          </div>
          <button
            type="button"
            onClick={onSync}
            disabled={syncing}
            style={{
              padding: '8px 14px',
              borderRadius: T.radius.pill,
              background: '#FEE500',
              color: '#3B1E1E',
              border: 'none',
              fontSize: 12,
              fontWeight: 700,
              cursor: syncing ? 'not-allowed' : 'pointer',
              opacity: syncing ? 0.6 : 1,
              fontFamily: 'inherit',
            }}
          >
            {syncing ? '동기화 중…' : '카톡 친구 동기화'}
          </button>
        </div>

        {(msg || err) && (
          <div style={{ padding: '0 18px 8px' }}>
            <div style={{
              padding: '10px 14px',
              borderRadius: T.radius.sm,
              background: err ? T.color.proteinSoft : T.color.vitaSoft,
              color: err ? T.color.protein : '#1e4a2d',
              fontSize: 12, fontWeight: 700,
            }}>{err ?? msg}</div>
          </div>
        )}

        <div style={{ padding: '8px 18px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {loading && <Card style={{ textAlign: 'center', color: T.color.ink55, padding: '24px 18px' }}>불러오는 중...</Card>}

          {!loading && friends.length === 0 && (
            <Card style={{ padding: '30px 20px', border: `1.5px dashed ${T.color.ink15}`, textAlign: 'center', boxShadow: 'none' }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>🌱</div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>아직 친구가 없어요</div>
              <div style={{ fontSize: 12, color: T.color.ink55, marginTop: 6, lineHeight: 1.5 }}>
                같은 앱을 쓰는 카톡 친구가 있다면<br/>위에서 동기화 해보세요.
              </div>
            </Card>
          )}

          {friends.map(f => {
            const name = f.display_name || f.nickname || '친구';
            const initials = name.slice(0, 1);
            return (
              <Card key={f.friend_id} onClick={() => onOpenFriendDay(f)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, boxShadow: 'none' }}>
                <Avatar src={f.avatar_url} fallback={initials} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</div>
                  <div className="cal-mono" style={{ fontSize: 10, color: T.color.ink55, fontWeight: 700, marginTop: 2 }}>
                    {f.last_eaten_at
                      ? `마지막 식사 ${new Date(f.last_eaten_at).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}`
                      : '오늘 기록 없음'}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="cal-num" style={{ fontSize: 18, fontWeight: 700 }}>{f.today_kcal.toLocaleString()}</div>
                  <div style={{ fontSize: 10, color: T.color.ink55, fontWeight: 700 }}>kcal · 오늘</div>
                </div>
                <div style={{ color: T.color.ink40, fontSize: 16, marginLeft: 4 }}>›</div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Avatar({ src, fallback }: { src: string | null; fallback: string }) {
  if (src) {
    return (
      <div style={{
        width: 44, height: 44, borderRadius: 22,
        backgroundImage: `url(${src})`, backgroundSize: 'cover', backgroundPosition: 'center',
        border: `1px solid ${T.color.ink08}`, flexShrink: 0,
      }}/>
    );
  }
  return (
    <div style={{
      width: 44, height: 44, borderRadius: 22,
      background: T.color.vitaSoft, color: '#1e4a2d',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 18, fontWeight: 700, flexShrink: 0,
    }}>{fallback}</div>
  );
}
