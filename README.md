# AirChart - 항공권 가격 추적 서비스

[![Next.js](https://img.shields.io/badge/Next.js-15.0.3-black)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-2.46.1-green)](https://supabase.io/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.1-blue)](https://tailwindcss.com/)

AirChart는 일본행 항공권의 가격 변동을 추적하고 시각화하여 최적의 구매 시점을 찾을 수 있도록 도와주는 서비스입니다.

## 주요 기능

- 🔍 **항공권 검색**: 인천 출발, 일본 주요 도시(도쿄, 오사카, 후쿠오카, 삿포로) 도착 항공권 검색
- 📊 **가격 추이 시각화**: 선택한 경로의 항공권 가격 변동을 차트로 확인
- 📧 **가격 알림**: 목표 가격 도달 시 이메일 알림 제공
- 📅 **날짜별 최저가**: 선택한 경로의 날짜별 최저가 정보 제공

## 시작하기

### 필수 요구사항

- Node.js 18.17.0 이상
- npm 또는 yarn

### 설치 방법

```bash
# 저장소 클론
git clone https://github.com/hiimjayson/airchart-frontend.git

# 디렉토리 이동
cd airchart

# 의존성 설치
npm install
# 또는
yarn install

# 개발 서버 실행
npm run dev
# 또는
yarn dev
```

## 기술 스택

### 프론트엔드

- Next.js 15.0.3
- TailwindCSS
- Recharts (차트 시각화)
- SWR (데이터 페칭)

### 백엔드

- Supabase (데이터베이스)
- Vercel (호스팅)

## 프로젝트 구조

```
airchart/
├── src/
│   ├── app/          # Next.js 13+ App Router
│   ├── components/   # 재사용 가능한 컴포넌트
│   ├── lib/         # 유틸리티 함수
│   └── remote/      # API 관련 로직
├── public/          # 정적 파일
└── docs/           # 프롬프팅용 문서
```

## 기여하기

1. 이 저장소를 포크합니다
2. 새로운 브랜치를 생성합니다 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋합니다 (`git commit -m 'Add some amazing feature'`)
4. 브랜치에 푸시합니다 (`git push origin feature/amazing-feature`)
5. Pull Request를 생성합니다

## License

이 프로젝트는 MIT 라이선스를 따릅니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## Contact

프로젝트 관리자 - [@cursormatfia](https://www.threads.net/@cursormatfia)
