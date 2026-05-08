import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { tokens as T } from '../lib/tokens';
import { BigBtn, Card, IconBtn, Label } from './ui/primitives';
import { syncKakaoFriends, getKakaoToken } from '../lib/friends';
import type { ProfileRow } from '../lib/profile';
import { dailyKcalTarget, type UserProfile } from '../lib/nutrition';

const ACTIVITY_LABEL: Record<UserProfile['activity'], string> = {
  sedentary: '거의 안 움직임',
  light: '가벼움',
  moderate: '보통',
  active: '많이 움직임',
};

interface Props {
  profile: ProfileRow;
  email: string;
  onBack: () => void;
  onProfileChanged: () => void;
  onSignOut: () => void;
  onDeleteAccount: () => void;
}

export function Settings({ profile, email, onBack, onProfileChanged, onSignOut, onDeleteAccount }: Props) {
  const [nickname, setNickname] = useState(profile.nickname ?? '');
  const [savingNick, setSavingNick] = useState(false);
  const [share, setShare] = useState(profile.share_with_friends ?? true);
  const [syncing, setSyncing] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const nickDirty = (profile.nickname ?? '') !== nickname.trim() && nickname.trim().length > 0;

  async function saveNickname() {
    setSavingNick(true); setErr(null); setMsg(null);
    const { error } = await supabase.from('profiles').update({ nickname: nickname.trim() }).eq('id', profile.id);
    setSavingNick(false);
    if (error) { setErr(error.message); return; }
    setMsg('닉네임을 저장했어요');
    onProfileChanged();
  }

  async function toggleShare(next: boolean) {
    setShare(next); setErr(null); setMsg(null);
    const { error } = await supabase.from('profiles').update({ share_with_friends: next }).eq('id', profile.id);
    if (error) { setShare(!next); setErr(error.message); return; }
    setMsg(next ? '친구에게 공개 ON' : '친구에게 공개 OFF');
    onProfileChanged();
  }

  async function onSync() {
    setErr(null); setMsg(null);
    if (!getKakaoToken()) {
      setErr('카카오로 로그인한 후에 동기화할 수 있어요');
      return;
    }
    setSyncing(true);
    try {
      const r = await syncKakaoFriends();
      setMsg(`친구 ${r.matched}명 매칭`);
      onProfileChanged();
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : '동기화 실패');
    } finally {
      setSyncing(false);
    }
  }

  const lastSync = profile.kakao_friends_synced_at
    ? new Date(profile.kakao_friends_synced_at).toLocaleString('ko-KR', { dateStyle: 'short', timeStyle: 'short' })
    : '아직 없음';

  return (
    <div className="cal" style={{ minHeight: '100vh', background: T.color.paper }}>
      <div className="cal-scroll" style={{ maxWidth: 460, margin: '0 auto', padding: '16px 0 60px' }}>
        <div style={{ padding: '8px 18px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <IconBtn onClick={onBack} size={36}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </IconBtn>
          <div className="cal-display" style={{ fontSize: 22, fontWeight: 700 }}>설정</div>
        </div>

        {(msg || err) && (
          <div style={{ padding: '0 18px 8px' }}>
            <div style={{
              padding: '10px 14px', borderRadius: T.radius.sm,
              background: err ? T.color.proteinSoft : T.color.vitaSoft,
              color: err ? T.color.protein : '#1e4a2d',
              fontSize: 12, fontWeight: 700,
            }}>{err ?? msg}</div>
          </div>
        )}

        {/* 프로필 */}
        <div style={{ padding: '4px 18px 12px' }}>
          <Label style={{ padding: '0 4px 8px' }}>프로필</Label>
          <Card style={{ padding: 16, boxShadow: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <Avatar src={profile.avatar_url} fallback={(nickname || profile.display_name || '?').slice(0, 1)} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: T.color.ink70 }}>로그인 계정</div>
                <div style={{ fontSize: 12, color: T.color.ink55, fontWeight: 700, wordBreak: 'break-all' }}>{email || '카카오 로그인'}</div>
              </div>
            </div>

            <div style={{ fontSize: 12, fontWeight: 700, color: T.color.ink70, marginBottom: 6 }}>닉네임</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="text"
                value={nickname}
                onChange={e => setNickname(e.target.value)}
                maxLength={20}
                placeholder="예: 용도리"
                style={{
                  flex: 1, padding: '12px 14px', fontSize: 15,
                  background: T.color.paper, border: `1.5px solid ${T.color.ink08}`,
                  borderRadius: T.radius.sm, outline: 'none',
                  fontFamily: 'inherit', color: T.color.ink,
                }}
              />
              <button
                type="button"
                onClick={saveNickname}
                disabled={!nickDirty || savingNick}
                style={{
                  padding: '0 18px', borderRadius: T.radius.sm,
                  background: nickDirty ? T.color.ink : T.color.ink08,
                  color: nickDirty ? T.color.paper : T.color.ink55,
                  border: 'none', fontSize: 13, fontWeight: 700,
                  cursor: nickDirty && !savingNick ? 'pointer' : 'not-allowed',
                  fontFamily: 'inherit',
                }}
              >
                {savingNick ? '저장 중' : '저장'}
              </button>
            </div>
          </Card>
        </div>

        {/* 신체 정보 */}
        <BodySection profile={profile} onSaved={() => { setMsg('신체 정보를 저장했어요'); onProfileChanged(); }} />

        {/* 공유 */}
        <div style={{ padding: '4px 18px 12px' }}>
          <Label style={{ padding: '0 4px 8px' }}>공유</Label>
          <Card style={{ padding: 0, boxShadow: 'none', overflow: 'hidden' }}>
            <Row>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700 }}>친구에게 식단 공개</div>
                <div style={{ fontSize: 11, color: T.color.ink55, fontWeight: 700, marginTop: 2 }}>
                  꺼두면 친구가 내 오늘 kcal·식사를 못 봅니다
                </div>
              </div>
              <Toggle on={share} onChange={toggleShare} />
            </Row>
            <Divider />
            <Row>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700 }}>카톡 친구 동기화</div>
                <div style={{ fontSize: 11, color: T.color.ink55, fontWeight: 700, marginTop: 2 }}>
                  마지막 동기화: {lastSync}
                </div>
              </div>
              <button
                type="button"
                onClick={onSync}
                disabled={syncing}
                style={{
                  padding: '8px 14px', borderRadius: T.radius.pill,
                  background: '#FEE500', color: '#3B1E1E',
                  border: 'none', fontSize: 12, fontWeight: 700,
                  cursor: syncing ? 'not-allowed' : 'pointer',
                  opacity: syncing ? 0.6 : 1, fontFamily: 'inherit',
                }}
              >{syncing ? '동기화 중' : '동기화'}</button>
            </Row>
          </Card>
        </div>

        {/* 계정 */}
        <div style={{ padding: '4px 18px 24px' }}>
          <Label style={{ padding: '0 4px 8px' }}>계정</Label>
          <Card style={{ padding: 12, boxShadow: 'none' }}>
            <BigBtn variant="ghost" onClick={onSignOut} style={{ marginBottom: 8 }}>로그아웃</BigBtn>
            <BigBtn
              variant="ghost"
              onClick={onDeleteAccount}
              style={{ borderColor: T.color.protein, color: T.color.protein }}
            >
              계정 삭제
            </BigBtn>
            <div style={{ fontSize: 11, color: T.color.ink55, fontWeight: 700, textAlign: 'center', marginTop: 10 }}>
              계정 삭제 시 모든 식사 기록과 친구 관계가 함께 사라집니다
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Avatar({ src, fallback }: { src: string | null; fallback: string }) {
  if (src) {
    return (
      <div style={{
        width: 48, height: 48, borderRadius: 24,
        backgroundImage: `url(${src})`, backgroundSize: 'cover', backgroundPosition: 'center',
        border: `1px solid ${T.color.ink08}`, flexShrink: 0,
      }}/>
    );
  }
  return (
    <div style={{
      width: 48, height: 48, borderRadius: 24,
      background: T.color.vitaSoft, color: '#1e4a2d',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 20, fontWeight: 700, flexShrink: 0,
    }}>{fallback}</div>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>{children}</div>;
}

function Divider() {
  return <div style={{ height: 1, background: T.color.ink08, margin: '0 16px' }} />;
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!on)}
      style={{
        width: 46, height: 26, borderRadius: 13, padding: 0,
        background: on ? T.color.vita : T.color.ink15,
        border: 'none', cursor: 'pointer', position: 'relative',
        transition: 'background 0.2s', flexShrink: 0,
      }}
    >
      <span style={{
        position: 'absolute', top: 3, left: on ? 23 : 3,
        width: 20, height: 20, borderRadius: 10,
        background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        transition: 'left 0.2s',
      }} />
    </button>
  );
}

function BodySection({ profile, onSaved }: { profile: ProfileRow; onSaved: () => void }) {
  const [editing, setEditing] = useState(false);
  const [sex, setSex] = useState<UserProfile['sex']>(profile.sex ?? 'male');
  const [age, setAge] = useState<number>(profile.age_years ?? 30);
  const [height, setHeight] = useState<number>(profile.height_cm ? Number(profile.height_cm) : 170);
  const [weight, setWeight] = useState<number>(profile.weight_kg ? Number(profile.weight_kg) : 65);
  const [activity, setActivity] = useState<UserProfile['activity']>(profile.activity ?? 'light');
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    setSex(profile.sex ?? 'male');
    setAge(profile.age_years ?? 30);
    setHeight(profile.height_cm ? Number(profile.height_cm) : 170);
    setWeight(profile.weight_kg ? Number(profile.weight_kg) : 65);
    setActivity(profile.activity ?? 'light');
  }, [profile]);

  const kcal = dailyKcalTarget({ sex, ageYears: age, weightKg: weight, heightCm: height, activity });

  async function save() {
    setSaving(true); setErr(null);
    const { error } = await supabase.from('profiles').update({
      sex, age_years: age, height_cm: height, weight_kg: weight,
      activity, daily_kcal_target: kcal,
    }).eq('id', profile.id);
    setSaving(false);
    if (error) { setErr(error.message); return; }
    setEditing(false);
    onSaved();
  }

  function cancel() {
    setEditing(false);
    setErr(null);
  }

  return (
    <div style={{ padding: '4px 18px 12px' }}>
      <Label style={{ padding: '0 4px 8px' }}>신체 정보</Label>
      <Card style={{ padding: 16, boxShadow: 'none' }}>
        {!editing ? (
          <div>
            <ReadRow label="성별" value={sex === 'male' ? '남성' : '여성'} />
            <ReadRow label="나이" value={`${age}세`} />
            <ReadRow label="키" value={`${height}cm`} />
            <ReadRow label="체중" value={`${weight}kg`} />
            <ReadRow label="활동량" value={ACTIVITY_LABEL[activity]} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 10, padding: '10px 12px', background: T.color.vitaSoft, borderRadius: T.radius.sm }}>
              <span style={{ fontSize: 11, color: T.color.ink55, fontWeight: 700 }}>하루 권장</span>
              <span className="cal-num" style={{ fontSize: 18, fontWeight: 700 }}>{kcal.toLocaleString()}</span>
              <span style={{ fontSize: 11, color: T.color.ink55, fontWeight: 700 }}>kcal</span>
              <div style={{ flex: 1 }} />
              <button
                type="button"
                onClick={() => setEditing(true)}
                style={{
                  padding: '6px 14px', borderRadius: T.radius.pill,
                  background: T.color.ink, color: T.color.paper,
                  border: 'none', fontSize: 12, fontWeight: 700,
                  cursor: 'pointer', fontFamily: 'inherit',
                }}
              >수정</button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Field label="성별">
              <div style={{ display: 'flex', gap: 8 }}>
                {(['male', 'female'] as const).map(s => (
                  <button
                    key={s} type="button" onClick={() => setSex(s)}
                    style={{
                      flex: 1, padding: '10px 8px', borderRadius: T.radius.sm,
                      background: sex === s ? T.color.vitaSoft : T.color.paper,
                      border: `1.5px solid ${sex === s ? T.color.vita : T.color.ink08}`,
                      fontWeight: 700, fontSize: 13, fontFamily: 'inherit', cursor: 'pointer',
                      color: T.color.ink,
                    }}
                  >{s === 'male' ? '👨 남성' : '👩 여성'}</button>
                ))}
              </div>
            </Field>
            <NumField label="나이" value={age} setValue={setAge} unit="세" min={12} max={100} step={1} />
            <NumField label="키" value={height} setValue={setHeight} unit="cm" min={120} max={220} step={0.1} decimals={1} />
            <NumField label="체중" value={weight} setValue={setWeight} unit="kg" min={30} max={200} step={0.1} decimals={1} />
            <Field label="활동량">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {(Object.keys(ACTIVITY_LABEL) as Array<UserProfile['activity']>).map(a => (
                  <button
                    key={a} type="button" onClick={() => setActivity(a)}
                    style={{
                      padding: '10px 12px', borderRadius: T.radius.sm, textAlign: 'left',
                      background: activity === a ? T.color.vitaSoft : T.color.paper,
                      border: `1.5px solid ${activity === a ? T.color.vita : T.color.ink08}`,
                      fontWeight: 700, fontSize: 13, fontFamily: 'inherit', cursor: 'pointer',
                      color: T.color.ink,
                    }}
                  >{ACTIVITY_LABEL[a]}</button>
                ))}
              </div>
            </Field>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '10px 12px', background: T.color.vitaSoft, borderRadius: T.radius.sm }}>
              <span style={{ fontSize: 11, color: T.color.ink55, fontWeight: 700 }}>새 하루 권장</span>
              <span className="cal-num" style={{ fontSize: 18, fontWeight: 700 }}>{kcal.toLocaleString()}</span>
              <span style={{ fontSize: 11, color: T.color.ink55, fontWeight: 700 }}>kcal</span>
            </div>
            {err && <div style={{ fontSize: 12, color: T.color.protein, fontWeight: 700 }}>{err}</div>}
            <div style={{ display: 'flex', gap: 8 }}>
              <BigBtn variant="ghost" onClick={cancel} style={{ flex: 1 }}>취소</BigBtn>
              <BigBtn variant="accent" onClick={save} disabled={saving} style={{ flex: 2 }}>
                {saving ? '저장 중...' : '저장'}
              </BigBtn>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

function ReadRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 13 }}>
      <span style={{ color: T.color.ink55, fontWeight: 700 }}>{label}</span>
      <span style={{ fontWeight: 700 }}>{value}</span>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontSize: 12, fontWeight: 700, color: T.color.ink70, marginBottom: 6 }}>{label}</div>
      {children}
    </div>
  );
}

function NumField({ label, value, setValue, unit, min, max, step, decimals = 0 }: {
  label: string; value: number; setValue: (v: number) => void;
  unit: string; min: number; max: number; step: number; decimals?: number;
}) {
  const round = (v: number) => Math.round(v * 10 ** decimals) / 10 ** decimals;
  const clamp = (v: number) => Math.min(max, Math.max(min, v));
  const [draft, setDraft] = useState<string>(String(value));
  useEffect(() => { setDraft(String(value)); }, [value]);

  const stepAndSet = (n: number) => {
    const v = round(clamp(n)); setValue(v); setDraft(String(v));
  };

  return (
    <div>
      <div style={{ fontSize: 12, fontWeight: 700, color: T.color.ink70, marginBottom: 6 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: T.color.paper, border: `1.5px solid ${T.color.ink08}`, borderRadius: T.radius.sm, padding: '8px 12px' }}>
        <button type="button" onClick={() => stepAndSet(value - step)}
          style={{ width: 30, height: 30, borderRadius: 15, background: T.color.card, border: `1px solid ${T.color.ink08}`, fontSize: 16, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>−</button>
        <div style={{ flex: 1, display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 6 }}>
          <input
            type="text"
            inputMode={decimals > 0 ? 'decimal' : 'numeric'}
            value={draft}
            onChange={e => {
              const raw = e.target.value.replace(/[^\d.]/g, '');
              setDraft(raw);
              const n = Number(raw);
              if (raw !== '' && Number.isFinite(n)) setValue(n);
            }}
            onBlur={() => {
              const n = Number(draft);
              const v = Number.isFinite(n) ? round(clamp(n)) : round(clamp(value));
              setValue(v); setDraft(String(v));
            }}
            className="cal-num"
            style={{
              width: 80, textAlign: 'center', fontSize: 18, fontWeight: 700,
              background: 'transparent', border: 'none', outline: 'none',
              color: T.color.ink, padding: 0, fontFamily: 'inherit',
            }}
          />
          <span style={{ fontSize: 12, color: T.color.ink55, fontWeight: 700 }}>{unit}</span>
        </div>
        <button type="button" onClick={() => stepAndSet(value + step)}
          style={{ width: 30, height: 30, borderRadius: 15, background: T.color.card, border: `1px solid ${T.color.ink08}`, fontSize: 16, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>+</button>
      </div>
    </div>
  );
}
