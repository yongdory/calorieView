# Handoff: Calorie — AI Food Photo Calorie Tracker

## Overview
Calorie는 음식 사진을 업로드하면 이미지 분석 AI(Gemma 4 Vision)가 음식을 인식하고,
탄수화물·단백질·지방·비타민&미네랄의 칼로리·영양소를 추출해서 하루 권장 칼로리 대비 % 로 보여주는
**웹 + 모바일(iOS/Android) 서비스**입니다.

핵심 가치: "압박 없이, 자연스럽게, 사진 한 장으로 챙기는 한 끼."
디자인 톤은 **자연 · 따뜻함 · 귀여움** — 자연 녹색 배경 + 손글씨 폰트 + 스티커 스타일 결과.

## About the Design Files
이 번들에 포함된 파일은 **HTML로 만든 디자인 레퍼런스(프로토타입)**입니다.
최종 룩앤필과 인터랙션을 보여주는 목적이며, **그대로 빌드해 쓰는 프로덕션 코드가 아닙니다.**

개발 작업의 목표는 이 HTML 디자인을 **타겟 코드베이스(React / React Native / Next.js / SwiftUI 등)의
기존 패턴과 라이브러리를 사용해 재구현**하는 것입니다.
아직 코드베이스가 없다면, 이 프로젝트에 가장 적합한 프레임워크를 선택해서 새로 시작하세요.

권장 스택 (이미 없는 경우):
- **웹**: Next.js 14 (App Router) + Tailwind CSS + shadcn/ui
- **모바일**: React Native (Expo) 또는 Flutter
- **공용 디자인 토큰**: 아래 "Design Tokens" 섹션을 CSS variables / Tailwind config / Theme 파일로 이식

## Fidelity
**High-fidelity (hifi)** — 최종 색상, 타이포그래피, 간격, 상호작용이 확정된 목업입니다.
색상·폰트·반경·그림자 수치를 그대로 사용하세요.
다만 이모지 placeholder(🥑, 🍎 등)는 **실제 음식 이미지로 교체**가 필요합니다 — 사용자가 업로드한 사진(`burger.jpg`)만 실제 이미지로 적용되어 있습니다.

## Screens / Views

### 1. Onboarding (3-step flow)
- **Purpose**: 신규 사용자 목표·활동량·식단 선호 파악 → 일일 권장 칼로리 산출
- **Layout**: 상단 3-dot progress + 중앙 콘텐츠 + 하단 CTA 고정
- **Step 1 — 목표**: 감량/유지/증량 3개 카드 (Radio-style, emoji + 부제) + 현재/목표 체중 NumCard 2개 (-/+ 스텝퍼)
- **Step 2 — 활동량**: 4단계 (😴 거의 안 움직임 → ⚡ 많이 움직임) + 하단 "하루 권장 칼로리" 프리뷰 카드 (1650~2280 kcal)
- **Step 3 — 식단 선호**: 3 그룹 (식단 스타일·선호 음식·피하는 것) pill 토글 multi-select
- **CTA**: "다음" 버튼 → 마지막 스텝에서 "시작하기" (accent 그린)
- 파일: `hifi/screens/onboarding.jsx`

### 2. Home Dashboard (빅 링)
- **Purpose**: 오늘의 총 섭취량, 영양소 분포, 식사 기록 한눈에
- **Layout**: 헤더 (인사) → 메인 링 카드 → Quick add (3버튼) → 오늘의 식사 리스트 → 인사이트 카드 → 하단 탭바
- **메인 링**: `MultiRing` (3중 도넛 · 탄수/단백/지방) 150×150, stroke 9, gap 3
  - 중앙: "오늘 먹은 양" + 큰 숫자 (1,156 kcal) + "/ 1,850 kcal"
  - 오른쪽: 영양소 pill 3개 (아이콘 + 이름 + g / target + progress bar)
- **Quick add**: 📷 사진으로 · 🔍 검색으로 · ⭐ 즐겨찾기
- **오늘의 식사**: 카드 리스트 (FoodImg 52px + 시간 + 이름 + kcal)
- **데이터 상태**: `empty` / `normal` / `achieved` 3종 지원 (Tweaks에서 토글)
- 파일: `hifi/screens/home.jsx`

### 3. Gallery (앨범에서 선택)
- **Purpose**: 이미 찍어둔 사진을 앨범에서 골라 분석
- **Layout**: 상단 헤더 (뒤로 + 제목 + 선택개수 + 검색) + 탭 (최근/음식/즐겨찾기/공유됨) + 3-column photo grid (날짜 섹션별) + 하단 고정 "N장 분석하기" CTA
- **Photo tile**: 1:1 aspect-ratio, 선택 시 vita 3px border + 우상단 번호 뱃지 (선택 순서)
- 파일: `hifi/screens/gallery.jsx`

### 4. Analysis Loading
- **Purpose**: AI가 사진 분석 중임을 알려주는 대기 화면
- **Layout**: 상단 "GEMMA 4 · VISION" 라벨 + 분석중 뱃지 → 중앙 빅 Ring (220px, stroke 14) + % 숫자 + 현재 단계 라벨 → 하단 4-step chips (읽기/찾기/계산/마무리) + fun fact 카드
- **Progress**: 자동 애니메이션 (45ms/1.4%씩), 100% 도달 시 `onDone` 호출
- 파일: `hifi/screens/loading.jsx`

### 5. Result (스티커 스타일)
- **Purpose**: 분석 결과 — 인식된 음식, 칼로리, 영양소 분포, AI 코멘트
- **Layout**: 닫기/공유 아이콘 → 히어로 사진 카드 (1:0.92 비율, 실제 사진) + 5개 스티커 오버레이 (kcal, confidence, 탄수, 단백, 지방, 시간) → 음식명 + AI 뱃지 → 인식된 음식 리스트 → 웰니스 팁 → 하단 CTA
- **Stickers**: rotation(-8°~+7°), 다색 배경, border-radius 16~22px, drop-shadow
- **인식된 음식**: 40px thumbnail + 이름 + 그램 + kcal
- 파일: `hifi/screens/result.jsx`

### 6. History (트렌드 라인)
- **Purpose**: 주/월/연간 칼로리 트렌드 + 영양소 평균 + 스트릭
- **Layout**: 상단 라벨 + 범위 탭 (주간/월간/연간) → 메인 차트 카드 (평균 숫자 + SVG 꺾은선 + 목표 점선 + 오늘 강조점) → 영양소 3-칼럼 카드 (탄수/단백/지방 avg + trend%) → 스트릭 카드 (🔥 7일 연속) → 최근 기록 리스트
- **Chart**: 14일 데이터, SVG path, goal line dashed, 오늘 시점 vita ring + 5px 강조
- 파일: `hifi/screens/history.jsx`

### 7. Recipe (보충식 추천)
- **Purpose**: 오늘 부족한 영양소 기반 맞춤 추천
- **Layout**: 헤더 → "지금 부족해요" progress 3종 (단백질/비타민C/식이섬유) → 👑 오늘의 탑픽 (16:9 사진 카드 + 스티커 + NutrientStack + 추가 버튼) → 추천 리스트 3개 → "새로운 추천 받기" 고스트 버튼
- 파일: `hifi/screens/recipe.jsx`

### 8. Profile (웰니스)
- **Purpose**: 내 정보, 목표 진행도, 배지, 기분 체크인, 설정
- **Layout**: 히어로 카드 (아바타 + 인사 + 3 스탯 칩) → 목표 진행 트랙 (체중 64.3 → 58.0 kg) → 배지 갤러리 (가로 스크롤, 획득/잠금) → 주간 기분 체크인 (이모지 7일) → 설정 리스트 (목표/알림/다크/테마)
- 파일: `hifi/screens/profile.jsx`

### 9. Web — Landing (1280×820)
- **Purpose**: 마케팅 홈
- **Layout**: Nav (로고 + 메뉴 + CTA) → Hero 2-column (좌: 카피 + CTA, 우: Phone mockup + floating stickers) → 하단 4-feature 그리드
- 파일: `hifi/screens/web.jsx` (`WebLanding`)

### 10. Web — Dashboard (1280×820)
- **Purpose**: 데스크탑 앱 대시보드
- **Layout**: 사이드바 220px (로고 + 5메뉴 + Pro CTA) + 메인 (헤더 → Top row 3카드 [빅 링 / 스트릭 / 월 평균] → Meal row 2카드 [오늘의 식사 4-grid / 인사이트])
- 파일: `hifi/screens/web.jsx` (`WebDashboard`)

## Interactions & Behavior

### Navigation (모바일)
- **하단 탭바 5종**: Home / History / [+카메라] / Recipe / Profile
- **카메라 버튼**: 중앙 floating FAB, vita color, 크게 + 강조
- **Flow**: Home → Gallery → Loading → Result → Home (저장)

### Animations
- **Ring fill**: stroke-dashoffset CSS transition, 300ms ease
- **Loading progress**: 45ms interval × 1.4%/tick → 약 3.2초
- **Sticker**: `drop-shadow(0 2px 6px rgba(0,0,0,0.12))`, rotation static
- **Bob animation**: `cal-bob` class — 작은 상하 움직임 (emoji 아이콘)
- **Pulse**: `cal-pulse` class — opacity 1↔0.4, 1.2s infinite

### Loading States
- Gallery: photo 선택 시 border 변화 + 번호 뱃지
- Home: `empty` 상태 — 빈 대시보드 + "오늘 첫 식사" 인사 + 점선 empty state
- Result: AI confidence 뱃지 (92~94%)

## State Management
```
AppState {
  user: { goal, currentWeight, targetWeight, activityLevel, preferences[], dailyKcalGoal }
  today: { totalKcal, carb, protein, fat, meals[] }
  history: { dailyKcal[], weeklyAvg, streak, badges[] }
}
MealEntry { id, timestamp, photoUrl, aiConfidence, items[{name, kcal, g, emoji}], totalKcal, carb, protein, fat }
```

- **사진 업로드 → 분석**: POST image to Gemma 4 Vision API → JSON {items, macros, confidence} 반환
- **저장**: MealEntry 생성 → today.meals 추가 → total 재계산
- **타임라인**: 최근 14일 집계 → trend chart 데이터

## Design Tokens

### Colors (자연 녹색 · warm tone 기준)
```
paper        #eaf1e1   // 배경 (연한 연두)
paperDeep    #d8e4c7   // 배경 깊은 톤
card         #f5f8ee   // 카드
cardAlt      #cfe0b8   // 선택/강조 카드 (풀잎색)
glow         #e8f0d8   // 블러 블롭

ink          #2d3a28   // 메인 텍스트 (짙은 녹)
ink70        rgba(45,58,40,0.70)
ink55        rgba(45,58,40,0.55)
ink40        rgba(45,58,40,0.40)
ink25        rgba(45,58,40,0.25)
ink15        rgba(45,58,40,0.15)
ink08        rgba(45,58,40,0.08)

// 영양소 팔레트
carb         #f4b942   // 탄수 · amber
protein      #e07a5f   // 단백 · terracotta
fat          #c79fe0   // 지방 · lavender
vita         #6bbf8a   // 비타민&미네랄 · fresh green (primary accent)

carbSoft     #f4b94222
proteinSoft  #e07a5f22
fatSoft      #c79fe022
vitaSoft     #6bbf8a26
```

### Typography
```
fontDisplay  "Gaegu", cursive              // 제목, 귀여운 감성
fontSans     "Gaegu", "Quicksand", system-ui
fontNum      "Gaegu", "Fredoka", system-ui // 숫자
fontMono     "JetBrains Mono", monospace   // 타임스탬프, 라벨

// 크기 스케일
display-xl  68px / 1.05
display-lg  34px / 1.15
display-md  28px / 1.2
display-sm  22px / 1.3
body        14-15px / 1.5
caption     11-12px / 1.4
label       10-11px uppercase letter-spacing 0.5
num-xl      42-48px (숫자 전용)
num-lg      32-36px
num-md      17-20px
```

### Spacing
- 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 28, 32, 48
- 모바일 기본 좌우 패딩 18~22px
- 카드 내부 패딩 14~22px

### Radius
```
rSm    10px
rMd    14px
rLg    18px   // 기본 카드
rXl    24px   // 큰 카드, 히어로
rPill  999px
```

### Shadows
```
shadowSm   0 2px 8px rgba(45,58,40,0.04)
shadowMd   0 4px 16px rgba(45,58,40,0.08)
shadowLg   0 12px 40px rgba(45,58,40,0.16)
```

## Assets
- `hifi/assets/burger.jpg` — 사용자 업로드 샘플 (치즈버거 + 감자튀김) — 홈/갤러리/결과/웹 대시보드에서 공통 사용
- 다른 음식은 이모지 placeholder(🥑 🍎 🥛 🥣 🥗 🐟 🍫 등) — 실제 운영 시 사용자 촬영 사진 또는 stock photo로 교체

## Files (Design References in this bundle)
```
hifi/
├── tokens.jsx              디자인 토큰 정의 (색/폰트/반경/그림자 + Tweaks 지원)
├── components.jsx          공용 컴포넌트
│   ├── Phone               iOS 프레임 (status bar, home indicator)
│   ├── Ring / MultiRing    도넛 차트
│   ├── Sticker             회전 스티커 뱃지
│   ├── Chip                라운드 칩
│   ├── IconBtn             원형 아이콘 버튼
│   ├── BigBtn              primary/accent/ghost variants
│   ├── FoodImg             음식 사진/이모지 플레이스홀더
│   ├── Card / TabBar / Label / NutrientStack
│   └── Dot                 스테퍼 dot
├── screens/
│   ├── onboarding.jsx
│   ├── home.jsx
│   ├── gallery.jsx
│   ├── loading.jsx
│   ├── result.jsx
│   ├── history.jsx
│   ├── recipe.jsx
│   ├── profile.jsx
│   └── web.jsx             (WebLanding + WebDashboard)
└── assets/
    └── burger.jpg

Calorie Hi-Fi.html          최종 디자인 · DesignCanvas 래퍼 + Tweaks 패널 + Interactive Flow
```

## Implementation Notes for Claude Code

1. **먼저 토큰을 이식하세요.** 위 "Design Tokens" 값을 `theme.ts` / `tailwind.config.js` / `variables.css` 등 타겟 환경에 맞는 포맷으로 옮깁니다. 하드코딩된 hex를 그대로 쓰지 말고 반드시 토큰 참조로 사용하세요.

2. **공용 컴포넌트를 먼저 구현**: Ring/MultiRing, Sticker, IconBtn, BigBtn, FoodImg, TabBar — 이후 화면 조립이 훨씬 빨라집니다.

3. **Ring/MultiRing**는 SVG로 구현 — `hifi/components.jsx` 구현 참고. stroke-dasharray + stroke-dashoffset 트릭 사용.

4. **Gemma 4 Vision API 연동**: 이미지 → base64 or multipart → POST → {items[], macros, confidence} JSON 파싱. 실패 시 수동 입력 폴백 UI 필요 (현재 디자인엔 없음, 추가 디자인 요청 가능).

5. **이모지 placeholder 전략**: MVP에선 이모지 유지해도 OK. 이후 Unsplash/자체 DB의 음식 사진으로 교체.

6. **Gaegu 폰트**는 한글 손글씨 — Google Fonts에서 import. 영문 fallback은 Quicksand / Fredoka.

7. **반응형**: 모바일 디자인이 기준. 웹은 1280px 기준 고정 레이아웃이지만 실 제품에선 반응형으로 재작업 필요.

8. **다크모드**는 토큰 레벨에 정의되어 있음 (`dark: true` 토글) — CSS variable 기반 theme switching으로 구현 권장.
