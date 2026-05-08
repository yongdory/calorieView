import { useEffect, useRef, useState } from 'react';
import { analyzeFoodImage, type AnalyzeResponse } from './lib/api';
import { dailyMacroTargets, type MacroTargets } from './lib/nutrition';
import { supabase, getAccessToken } from './lib/supabase';
import { fetchProfile, isProfileComplete, targetsFromProfile, type ProfileRow } from './lib/profile';
import { AuthGate } from './components/AuthGate';
import { HomeView } from './components/HomeView';
import { HistoryView } from './components/HistoryView';
import { LoadingView } from './components/LoadingView';
import { ResultView } from './components/ResultView';
import { Onboarding } from './components/Onboarding';
import { FriendsView } from './components/FriendsView';
import { FriendDayView } from './components/FriendDayView';
import { Settings } from './components/Settings';
import type { FriendSummary } from './lib/friends';
import { tokens as T } from './lib/tokens';
import './App.css';

const FALLBACK_TARGETS = dailyMacroTargets({
  sex: 'male', ageYears: 30, weightKg: 70, heightCm: 175, activity: 'light',
});

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8787';

type Stage =
  | { kind: 'home' }
  | { kind: 'history' }
  | { kind: 'friends' }
  | { kind: 'friend-day'; friend: FriendSummary }
  | { kind: 'settings' }
  | { kind: 'loading'; previewSrc: string }
  | { kind: 'result'; previewSrc: string; result: AnalyzeResponse }
  | { kind: 'error'; message: string };

export default function App() {
  return (
    <AuthGate>
      {(session) => <Shell userId={session.user.id} email={session.user.email ?? ''} />}
    </AuthGate>
  );
}

function Shell({ userId, email }: { userId: string; email: string }) {
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [stage, setStage] = useState<Stage>({ kind: 'home' });
  const [refreshKey, setRefreshKey] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProfile(userId).then(p => {
      setProfile(p);
      setProfileLoading(false);
    });
  }, [userId]);

  const targets: MacroTargets = profile && isProfileComplete(profile) ? targetsFromProfile(profile) : FALLBACK_TARGETS;

  function openPicker() { fileRef.current?.click(); }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const previewSrc = URL.createObjectURL(file);
    setStage({ kind: 'loading', previewSrc });
    try {
      const result = await analyzeFoodImage(file);
      setStage({ kind: 'result', previewSrc, result });
    } catch (err: unknown) {
      setStage({ kind: 'error', message: err instanceof Error ? err.message : '분석 실패' });
    } finally {
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  async function signOut() { await supabase.auth.signOut(); }

  async function deleteAccount() {
    if (!confirm('정말 계정을 삭제하시겠습니까? 모든 기록이 함께 삭제되며 복구할 수 없습니다.')) return;
    try {
      const token = await getAccessToken();
      const res = await fetch(`${API_BASE}/account`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error(await res.text());
      await supabase.auth.signOut();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : '삭제 실패');
    }
  }

  function backToHome() {
    setStage({ kind: 'home' });
    setRefreshKey(k => k + 1);
  }

  if (profileLoading) {
    return (
      <div className="cal" style={{ minHeight: '100vh', background: T.color.paper, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.color.ink55 }}>
        불러오는 중...
      </div>
    );
  }

  if (!isProfileComplete(profile)) {
    return <Onboarding userId={userId} onDone={() => fetchProfile(userId).then(setProfile)} />;
  }

  return (
    <>
      <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={onFile} hidden />

      {stage.kind === 'home' && (
        <HomeView
          email={email}
          nickname={profile?.nickname}
          targets={targets}
          onPickPhoto={openPicker}
          onOpenHistory={() => setStage({ kind: 'history' })}
          onOpenFriends={() => setStage({ kind: 'friends' })}
          onOpenSettings={() => setStage({ kind: 'settings' })}
          refreshKey={refreshKey}
        />
      )}
      {stage.kind === 'settings' && profile && (
        <Settings
          profile={profile}
          email={email}
          onBack={() => setStage({ kind: 'home' })}
          onProfileChanged={() => fetchProfile(userId).then(p => p && setProfile(p))}
          onSignOut={signOut}
          onDeleteAccount={deleteAccount}
        />
      )}
      {stage.kind === 'history' && (
        <HistoryView targets={targets} onBack={() => setStage({ kind: 'home' })} />
      )}
      {stage.kind === 'friends' && (
        <FriendsView
          onBack={() => setStage({ kind: 'home' })}
          onOpenFriendDay={(friend) => setStage({ kind: 'friend-day', friend })}
        />
      )}
      {stage.kind === 'friend-day' && (
        <FriendDayView
          friend={stage.friend}
          onBack={() => setStage({ kind: 'friends' })}
        />
      )}
      {stage.kind === 'loading' && <LoadingView previewSrc={stage.previewSrc} />}
      {stage.kind === 'result' && (
        <ResultView result={stage.result} targets={targets} imageSrc={stage.previewSrc} onBack={backToHome} />
      )}
      {stage.kind === 'error' && (
        <div className="cal" style={{ minHeight: '100vh', background: T.color.paper, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, textAlign: 'center', gap: 16 }}>
          <div style={{ fontSize: 48 }}>😿</div>
          <div className="cal-display" style={{ fontSize: 22, fontWeight: 700 }}>분석에 실패했어요</div>
          <div style={{ fontSize: 13, color: T.color.ink55, maxWidth: 320 }}>{stage.message}</div>
          <button
            type="button"
            onClick={backToHome}
            style={{ marginTop: 8, padding: '12px 28px', borderRadius: T.radius.pill, background: T.color.ink, color: T.color.paper, border: 'none', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
          >
            다시 시도
          </button>
        </div>
      )}
    </>
  );
}
