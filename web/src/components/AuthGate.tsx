import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { tokens as T } from '../lib/tokens';
import { BigBtn } from './ui/primitives';

interface Props {
  children: (session: Session) => React.ReactNode;
}

export function AuthGate({ children }: Props) {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  if (!ready) {
    return (
      <div className="cal" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.color.ink55 }}>
        로딩 중...
      </div>
    );
  }
  if (!session) return <AuthForm />;
  return <>{children(session)}</>;
}

function AuthForm() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    setMsg(null);
    try {
      if (mode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMsg('확인 이메일을 보냈어요. 메일함을 확인하세요.');
      }
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : '오류');
    } finally {
      setLoading(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px 18px',
    fontSize: 16,
    fontFamily: T.font.sans,
    color: T.color.ink,
    background: T.color.card,
    border: `1.5px solid ${T.color.ink08}`,
    borderRadius: T.radius.md,
    outline: 'none',
  };

  return (
    <div className="cal" style={{ minHeight: '100vh', background: T.color.paper, display: 'flex', flexDirection: 'column' }}>
      {/* decorative blobs */}
      <div style={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, borderRadius: '50%', background: T.color.glow, filter: 'blur(40px)', opacity: 0.6, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -60, left: -60, width: 220, height: 220, borderRadius: '50%', background: T.color.vitaSoft, filter: 'blur(50px)', opacity: 0.8, pointerEvents: 'none' }} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '24px 22px', maxWidth: 440, width: '100%', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div className="cal-bob" style={{ fontSize: 56, lineHeight: 1, marginBottom: 8 }}>🌱</div>
          <div className="cal-display" style={{ fontSize: 40, fontWeight: 700, lineHeight: 1.1 }}>
            calorieView
          </div>
          <div style={{ marginTop: 8, fontSize: 14, color: T.color.ink55, fontWeight: 600 }}>
            사진 한 장으로 챙기는 한 끼
          </div>
        </div>

        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="cal-display" style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>
            {mode === 'signin' ? '다시 만나서 반가워요' : '처음이시군요 🌿'}
          </div>

          <input
            type="email"
            required
            placeholder="이메일"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={inputStyle}
          />
          <input
            type="password"
            required
            minLength={6}
            placeholder="비밀번호 (6자 이상)"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={inputStyle}
          />

          <div style={{ marginTop: 8 }}>
            <BigBtn type="submit" variant="accent" disabled={loading}>
              {loading ? '처리 중...' : mode === 'signin' ? '로그인' : '가입하기'}
            </BigBtn>
          </div>

          {err && (
            <div style={{ padding: '10px 14px', borderRadius: T.radius.sm, background: T.color.proteinSoft, color: T.color.protein, fontSize: 13, fontWeight: 700 }}>
              {err}
            </div>
          )}
          {msg && (
            <div style={{ padding: '10px 14px', borderRadius: T.radius.sm, background: T.color.vitaSoft, color: '#1e4a2d', fontSize: 13, fontWeight: 700 }}>
              {msg}
            </div>
          )}

          <button
            type="button"
            onClick={() => {
              setErr(null);
              setMsg(null);
              setMode(mode === 'signin' ? 'signup' : 'signin');
            }}
            style={{
              marginTop: 4,
              background: 'transparent',
              border: 'none',
              color: T.color.ink55,
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              padding: 8,
            }}
          >
            {mode === 'signin' ? '계정이 없으신가요? 가입' : '이미 계정이 있으신가요? 로그인'}
          </button>
        </form>
      </div>
    </div>
  );
}
