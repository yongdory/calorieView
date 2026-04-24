import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { dailyKcalTarget, type UserProfile } from '../lib/nutrition';
import { tokens as T } from '../lib/tokens';
import { BigBtn, Chip } from './ui/primitives';

interface Props {
  userId: string;
  onDone: () => void;
}

export function Onboarding({ userId, onDone }: Props) {
  const [step, setStep] = useState(0);
  const [nickname, setNickname] = useState('');
  const [sex, setSex] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState(30);
  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(65);
  const [activity, setActivity] = useState<UserProfile['activity']>('light');
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const profile: UserProfile = { sex, ageYears: age, weightKg: weight, heightCm: height, activity };
  const kcalTarget = dailyKcalTarget(profile);
  const trimmedNick = nickname.trim();
  const canNext = step === 0 ? trimmedNick.length >= 1 : true;

  async function save() {
    setSaving(true);
    setErr(null);
    const { error } = await supabase.from('profiles').update({
      nickname: trimmedNick,
      sex, age_years: age, height_cm: height, weight_kg: weight,
      activity, daily_kcal_target: kcalTarget,
    }).eq('id', userId);
    setSaving(false);
    if (error) { setErr(error.message); return; }
    onDone();
  }

  return (
    <div className="cal" style={{ minHeight: '100vh', background: T.color.paper, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '24px 22px 8px', display: 'flex', gap: 6, justifyContent: 'center' }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: step === i ? 22 : 8, height: 8, borderRadius: 4,
            background: step >= i ? T.color.vita : T.color.ink15,
            transition: 'all 0.3s',
          }} />
        ))}
      </div>

      <div style={{ flex: 1, padding: '20px 22px', maxWidth: 440, width: '100%', margin: '0 auto' }}>
        {step === 0 && (
          <StepBasic
            nickname={nickname} setNickname={setNickname}
            sex={sex} setSex={setSex}
            age={age} setAge={setAge}
            height={height} setHeight={setHeight}
            weight={weight} setWeight={setWeight}
          />
        )}
        {step === 1 && <StepActivity activity={activity} setActivity={setActivity} />}
        {step === 2 && <StepConfirm nickname={trimmedNick} profile={profile} kcalTarget={kcalTarget} />}
      </div>

      <div style={{ padding: '12px 22px 28px', maxWidth: 440, width: '100%', margin: '0 auto', display: 'flex', gap: 10 }}>
        {step > 0 && (
          <BigBtn variant="ghost" onClick={() => setStep(s => s - 1)} style={{ flex: 1 }}>
            이전
          </BigBtn>
        )}
        {step < 2 ? (
          <BigBtn variant="accent" onClick={() => setStep(s => s + 1)} disabled={!canNext} style={{ flex: 2 }}>
            다음
          </BigBtn>
        ) : (
          <BigBtn variant="accent" onClick={save} disabled={saving} style={{ flex: 2 }}>
            {saving ? '저장 중...' : '시작하기 🌱'}
          </BigBtn>
        )}
      </div>
      {err && <div style={{ padding: '0 22px 16px', color: T.color.protein, fontSize: 13, fontWeight: 700, textAlign: 'center' }}>{err}</div>}
    </div>
  );
}

function StepBasic(props: {
  nickname: string; setNickname: (v: string) => void;
  sex: 'male' | 'female'; setSex: (v: 'male' | 'female') => void;
  age: number; setAge: (v: number) => void;
  height: number; setHeight: (v: number) => void;
  weight: number; setWeight: (v: number) => void;
}) {
  return (
    <div>
      <div className="cal-display" style={{ fontSize: 28, fontWeight: 700, marginBottom: 6 }}>기본 정보</div>
      <div style={{ color: T.color.ink55, fontSize: 14, fontWeight: 600, marginBottom: 24 }}>
        뭐라고 불러드릴까요?
      </div>

      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: T.color.ink70, marginBottom: 8 }}>닉네임</div>
        <input
          type="text"
          value={props.nickname}
          onChange={e => props.setNickname(e.target.value)}
          maxLength={20}
          placeholder="예: 용도리"
          style={{
            width: '100%', padding: '14px 16px', fontSize: 16,
            background: T.color.card, border: `1.5px solid ${T.color.ink08}`,
            borderRadius: T.radius.md, outline: 'none',
            fontFamily: 'inherit', color: T.color.ink,
          }}
        />
      </div>

      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: T.color.ink70, marginBottom: 8 }}>성별</div>
        <div style={{ display: 'flex', gap: 8 }}>
          {(['male', 'female'] as const).map(s => (
            <button
              key={s}
              type="button"
              onClick={() => props.setSex(s)}
              style={{
                flex: 1, padding: '14px 8px', borderRadius: T.radius.md,
                background: props.sex === s ? T.color.vitaSoft : T.color.card,
                border: `1.5px solid ${props.sex === s ? T.color.vita : T.color.ink08}`,
                color: T.color.ink, fontWeight: 700, fontSize: 15,
                fontFamily: 'inherit', cursor: 'pointer',
              }}
            >
              {s === 'male' ? '👨 남성' : '👩 여성'}
            </button>
          ))}
        </div>
      </div>

      <NumRow label="나이" value={props.age} setValue={props.setAge} unit="세" min={12} max={100} step={1} />
      <NumRow label="키" value={props.height} setValue={props.setHeight} unit="cm" min={120} max={220} step={0.1} decimals={1} />
      <NumRow label="체중" value={props.weight} setValue={props.setWeight} unit="kg" min={30} max={200} step={0.1} decimals={1} />
    </div>
  );
}

function NumRow({ label, value, setValue, unit, min, max, step, decimals = 0 }: {
  label: string; value: number; setValue: (v: number) => void;
  unit: string; min: number; max: number; step: number; decimals?: number;
}) {
  const round = (v: number) => Math.round(v * 10 ** decimals) / 10 ** decimals;
  const clamp = (v: number) => Math.min(max, Math.max(min, v));
  const [draft, setDraft] = useState<string>(String(value));

  useEffect(() => { setDraft(String(value)); }, [value]);

  const stepAndSet = (next: number) => {
    const v = round(clamp(next));
    setValue(v);
    setDraft(String(v));
  };

  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: T.color.ink70, marginBottom: 8 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: T.color.card, border: `1.5px solid ${T.color.ink08}`, borderRadius: T.radius.md, padding: '10px 14px' }}>
        <button type="button" onClick={() => stepAndSet(value - step)}
          style={{ width: 32, height: 32, borderRadius: 16, background: T.color.paper, border: `1px solid ${T.color.ink08}`, fontSize: 18, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>−</button>
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
              setValue(v);
              setDraft(String(v));
            }}
            className="cal-num"
            style={{
              width: 90, textAlign: 'center', fontSize: 22, fontWeight: 700,
              background: 'transparent', border: 'none', outline: 'none',
              color: T.color.ink, padding: 0,
            }}
          />
          <span style={{ fontSize: 13, color: T.color.ink55, fontWeight: 700 }}>{unit}</span>
        </div>
        <button type="button" onClick={() => stepAndSet(value + step)}
          style={{ width: 32, height: 32, borderRadius: 16, background: T.color.paper, border: `1px solid ${T.color.ink08}`, fontSize: 18, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>+</button>
      </div>
    </div>
  );
}

function StepActivity({ activity, setActivity }: { activity: UserProfile['activity']; setActivity: (v: UserProfile['activity']) => void }) {
  const options: Array<{ key: UserProfile['activity']; emoji: string; label: string; desc: string }> = [
    { key: 'sedentary', emoji: '😴', label: '거의 안 움직임', desc: '사무직, 운동 없음' },
    { key: 'light', emoji: '🚶', label: '가벼움', desc: '주 1~3회 가벼운 운동' },
    { key: 'moderate', emoji: '🏃', label: '보통', desc: '주 3~5회 운동' },
    { key: 'active', emoji: '⚡', label: '많이 움직임', desc: '주 6회 이상, 고강도' },
  ];
  return (
    <div>
      <div className="cal-display" style={{ fontSize: 28, fontWeight: 700, marginBottom: 6 }}>활동량</div>
      <div style={{ color: T.color.ink55, fontSize: 14, fontWeight: 600, marginBottom: 24 }}>
        평소 움직임 수준을 골라주세요
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {options.map(o => (
          <button
            key={o.key}
            type="button"
            onClick={() => setActivity(o.key)}
            style={{
              padding: '14px 16px', borderRadius: T.radius.md, textAlign: 'left',
              background: activity === o.key ? T.color.vitaSoft : T.color.card,
              border: `1.5px solid ${activity === o.key ? T.color.vita : T.color.ink08}`,
              display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            <div style={{ fontSize: 28 }}>{o.emoji}</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: T.color.ink }}>{o.label}</div>
              <div style={{ fontSize: 12, color: T.color.ink55, marginTop: 2 }}>{o.desc}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function StepConfirm({ nickname, profile, kcalTarget }: { nickname: string; profile: UserProfile; kcalTarget: number }) {
  const activityLabel = {
    sedentary: '거의 안 움직임', light: '가벼움', moderate: '보통', active: '많이 움직임',
  }[profile.activity];
  return (
    <div>
      <div className="cal-display" style={{ fontSize: 28, fontWeight: 700, marginBottom: 6 }}>맞나요?</div>
      <div style={{ color: T.color.ink55, fontSize: 14, fontWeight: 600, marginBottom: 24 }}>
        입력 정보를 한 번 더 확인해주세요
      </div>

      <div style={{ background: T.color.card, borderRadius: T.radius.lg, border: `1px solid ${T.color.ink08}`, padding: 18, marginBottom: 16 }}>
        {nickname && <SummaryRow label="닉네임" value={nickname} />}
        <SummaryRow label="성별" value={profile.sex === 'male' ? '남성' : '여성'} />
        <SummaryRow label="나이" value={`${profile.ageYears}세`} />
        <SummaryRow label="키" value={`${profile.heightCm}cm`} />
        <SummaryRow label="체중" value={`${profile.weightKg}kg`} />
        <SummaryRow label="활동량" value={activityLabel} />
      </div>

      <div style={{ padding: '20px 18px', borderRadius: T.radius.lg, background: T.color.vitaSoft, textAlign: 'center' }}>
        <Chip color={T.color.vita} sm>하루 권장 칼로리</Chip>
        <div className="cal-num" style={{ fontSize: 48, fontWeight: 700, lineHeight: 1, marginTop: 8 }}>
          {kcalTarget.toLocaleString()}
          <span style={{ fontSize: 18, color: T.color.ink55, marginLeft: 4 }}>kcal</span>
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${T.color.ink08}`, fontSize: 14 }}>
      <span style={{ color: T.color.ink55, fontWeight: 700 }}>{label}</span>
      <span style={{ fontWeight: 700 }}>{value}</span>
    </div>
  );
}
