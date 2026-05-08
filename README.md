# calorieView

음식 사진을 업로드하면 Gemini 2.5 Flash-Lite가 분석하여 탄수화물/단백질/지방 수치와 하루 권장 칼로리 대비 %를 보여주는 웹+하이브리드 앱.

## 스택

- **Frontend**: React + Vite + TypeScript (Capacitor로 iOS/Android 래핑)
- **Backend API**: Cloudflare Workers (`worker/`)
- **LLM**: Google Gemini 2.5 Flash-Lite
- **DB / Auth**: Supabase (Postgres + Auth + RLS)

## 폴더 구조

```
calorieView/
├── web/                    # React + Vite + Capacitor
├── worker/                 # Cloudflare Worker API
└── supabase/migrations/    # DB 스키마
```

## 초기 셋업 (1회만)

### 1. Supabase 프로젝트 설정
1. [supabase.com](https://supabase.com) 프로젝트는 이미 생성됨 (URL/anon key는 `.env.local`에 설정됨)
2. 대시보드 → **SQL Editor**에서 `supabase/migrations/0001_init.sql` 내용 붙여넣고 실행
3. **Authentication → Providers → Email**에서 "Confirm email" 설정 확인 (개발 시 off 권장)
4. (계정 삭제 기능용) **Project Settings → API**에서 `service_role` 키 복사

### 2. Cloudflare Worker 시크릿 등록
```bash
cd worker
npx wrangler login                                    # 최초 1회
npx wrangler secret put GEMINI_API_KEY                # Gemini 키
npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY     # 계정 삭제 기능용
```
> Gemini 키 발급: https://aistudio.google.com/app/apikey

### 3. 로컬 실행
```bash
# 터미널 1: Worker (API)
cd worker && npm run dev           # http://localhost:8787

# 터미널 2: Web
cd web && npm run dev              # http://localhost:5173
```

## 모바일 앱 빌드 (Capacitor)

```bash
cd web
npm run build
npx cap add ios                    # 또는 android
npx cap sync
npx cap open ios                   # Xcode에서 실행
```

## 배포

```bash
# Worker
cd worker && npm run deploy
# → https://calorieview-api.<subdomain>.workers.dev

# Web
cd web && npm run build
npx wrangler pages deploy dist --project-name calorieview
# → https://calorieview.pages.dev
```

## 보안 메모

- `web/.env.local`과 `worker/wrangler.toml`에는 **공개 안전 키**(anon key, URL)만 들어감
- **service_role** 키는 절대 프론트/git에 커밋하지 말 것 → `wrangler secret`으로만 관리
- RLS(Row Level Security)가 활성화되어 사용자는 자기 행만 읽고 쓸 수 있음

## API 엔드포인트

| Method | Path | 인증 | 설명 |
|---|---|---|---|
| GET | `/health` | - | 헬스체크 |
| POST | `/analyze` | Bearer | 이미지 분석 (Gemini) |
| DELETE | `/account` | Bearer | 계정+데이터 전체 삭제 |

## DB 테이블

- `profiles` — 사용자 프로필 (가입 시 자동 생성)
- `meals` — 식사 분석 기록 (RLS로 본인 것만 접근)

## 비용 (테스트 단계 기준)

| 항목 | 월 예상 |
|---|---|
| Cloudflare Workers | $0 (무료 10만 req/일) |
| Cloudflare Pages | $0 |
| Supabase | $0 (무료 티어) |
| Gemini 2.5 Flash-Lite | ~$0 (테스트, 무료 티어 내) |
| **총** | **~$0** |

## 주의

- LLM 영양 추정은 ±18% 오차 가능(향후 모델 업그레이드 예정) → "참고용" UI 표기 필수
- 앱스토어 출시 전 필수:
  - 개인정보처리방침 (`web/public/privacy.html` — 이메일 수정 필요)
  - 계정 삭제 기능 (구현됨)
  - 애플 로그인 (iOS 심사 시 추가)
