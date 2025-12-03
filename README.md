# 📓 Taskify

> 일정 관리와 공유 기능을 제공하는 웹 애플리케이션

## 🌟 프로젝트 소개

Taskify는 커뮤니티를 생성하고 멤버를 초대하여 일정과 할 일을 함께 관리할 수 있습니다. 할 일 카드를 자유롭게 추가, 수정, 삭제할 수 있으며, 멤버 초대, 목록 분류, 댓글 기능을 제공하는 협업 플랫폼입니다.

## 🗓️ 프로젝트 기간

2025/11/18 (화) ~ 2025/12/04 (목)

### ✨ 주요 기능

- 💰 **칼럼 생성 및 멤버 초대**: 원하는 칼럼을 만들고 멤버를 초대하여 협업 시작
- 🗳️ **할 일 카드 관리**: 일정을 카드 형태로 생성, 수정, 삭제하며 시각적으로 관리
- 📊 **실시간 소통**: 카드별 댓글 기능으로 팀원과 즉시 소통
- 👤 **계정 및 멤버 관리**: 개인 계정 생성 및 커뮤니티 멤버 관리

## 🌐 배포 주소

➡️ [[Taskify]()](https://taskify-ten-pi.vercel.app/)

## 🛠 기술 스택

| 구분                | 사용 기술                                                                                                                                                                                                                                                                                                           |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Frontend**        | ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white) ![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=flat-square&logo=javascript&logoColor=white) |
| **Styling**         | ![SCSS](https://img.shields.io/badge/SCSS-CC6699?style=flat-square&logo=sass&logoColor=white)                                                                                                                                                                                                                       |
| **상태 관리**       | ![Context-API](https://img.shields.io/badge/Context--Api-000000?style=for-the-badge&logo=react)                                                                                                                                                                                                                     |
| **HTTP 클라이언트** | ![axios](https://img.shields.io/badge/axios-API-blue)                                                                                                                                                                                                                                                               |
| **Routing**         | ![Next.js Pages Router](https://img.shields.io/badge/Next.js_Pages_Router-000000?style=for-the-badge&logo=next.js&logoColor=white)                                                                                                                                                                                  |
| **배포**            | [![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)](https://taskify-ten-pi.vercel.app/)                                                                                                                                                                           |
| **협업**            | ![Discord](https://img.shields.io/badge/Discord-5865F2?style=flat-square&logo=discord&logoColor=white) ![Notion](https://img.shields.io/badge/Notion-000000?style=flat-square&logo=notion)                                                                                                                          |

## 🚀 시작하기

### 필수 조건

- Node.js 18.0 이상
- npm

### 설치 및 실행

`````bash
# 저장소 클론
git clone https://github.com/Sprint-19-part3-1team-Taksify/taskify.git

# 프로젝트 디렉토리로 이동
cd taskify

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

````markdown
## 📁 프로젝트 구조

📦 project
├── 📂 public
│ ├── 🔷 favicon.svg # 파비콘 파일
│ ├── 📂 images # UI 이미지 저장
│ └── 📂 fonts # Pretendard 등 폰트 파일
│
├── 📂 src
│ ├── 📂 api # API 통신 함수 모음
│ ├── 📂 components
│ │ ├── 📂 button # 버튼 UI
│ │ ├── 📂 card # 카드 UI
│ │ ├── 📂 cardtable # 카드 + 테이블 UI
│ │ ├── 📂 column # 테이블 컬럼 UI
│ │ ├── 📂 common # 공통 UI(아이콘, 컬러 등)
│ │ ├── 📂 dashboard # 대시보드 전용 UI
│ │ ├── 📂 header # 상단 헤더
│ │ ├── 📂 input # 인풋 UI
│ │ ├── 📂 modal # 모달 UI
│ │ └── 📂 sidemenu # 사이드 메뉴 UI
│ │
│ ├── 📂 context # 전역 상태관리(Context API)
│ ├── 📂 hook # 커스텀 훅
│ ├── 📂 lib # 유틸 함수
│ ├── 📂 pages
│ │ ├── 📂 api
│ │ │ ├── 📂 auth # 인증 API
│ │ │ └── 📂 external # 외부 연동 API
│ │ ├── 📂 dashboard
│ │ │ └── 📂 [id] # 동적 라우트
│ │ ├── 📂 guide # 가이드 페이지
│ │ ├── 📂 login # 로그인 페이지
│ │ ├── 📂 mydashboard # 나의 대시보드 관리
│ │ ├── 📂 mypage # 마이페이지
│ │ ├── 📂 signup # 회원가입
│ │ ├── 📄 _app.js # 전역 레이아웃/Provider
│ │ ├── 📄 _document.js # HTML 문서 커스텀
│ │ ├── 📄 [...slug].js # 나머지 라우트 처리
│ │ ├── 📄 index.js # 홈 페이지
│ │ └── 📄 index.module.scss # 홈 스타일
│ │
│ ├── 📂 styles
│ │ ├── _mixins.scss # SCSS 믹스인
│ │ ├── _variables.scss # SCSS 변수
│ │ ├── font.scss # 폰트 스타일
│ │ ├── globals.scss # 글로벌 스타일
│ │ ├── input.scss # 인풋 스타일
│ │ ├── layout.scss # 레이아웃 스타일
│ │ └── reset.scss # Reset CSS
│
├── ⚙️ .env # 환경 변수
├── 📝 .eslintrc.json # ESLint 설정
├── 📝 .gitignore # Git 제외 파일
├── 📝 .prettierrc # Prettier 설정
├── 📝 .eslint.config.mjs # ESLint 확장 설정
├── 📦 jsconfig.json # 절대 경로 설정
├── ▲ next.config.mjs # Next.js 설정
├── 📦 package-lock.json # 패키지 버전 고정
├── 📦 package.json # 의존성 목록
└── 📝 README.md # 프로젝트 설명

`````

## 🔗 API 문서

- **Swagger UI**: https://sp-taskify-api.vercel.app/docs/
- **Base URL**:

## 👥 팀원

| 이름       | GitHub                                                                                                                             | 역할          |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| **최희락** | [![GitHub](https://img.shields.io/badge/GitHub-Greensod--96-181717?style=flat-square&logo=github)](https://github.com/Greensod-96) | 공통 컴포넌트 |
| **이선영** | [![GitHub](https://img.shields.io/badge/GitHub-sylee86-181717?style=flat-square&logo=github)](https://github.com/sylee86)          | 공통 컴포넌트 |
| **이동국** | [![GitHub](https://img.shields.io/badge/GitHub-cadst-181717?style=flat-square&logo=github)](https://github.com/cadst)              | API 통신      |

## 🎓 학습 포인트

- **React 컴포넌트 설계**: 재사용 가능한 공용 컴포넌트 개발
- **Next.js Pages Router**: 파일 기반 라우팅 및 SSR 구현
- **비동기 통신**: axios를 활용한 서버 데이터 처리
- **상태 관리**: 전역 상태 관리 및 Context API 활용
- **Vercel**: Next.js 프로젝트 배포, 환경 변수 관리 및 자동 빌드 파이프라인 구성
- **팀 협업**: Git 브랜치 전략 및 코드 리뷰 프로세스

## 📜 라이센스

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 감사의 글

이 프로젝트는 **코드잇 스프린트 Front-End 19기** 교육 과정의 팀 프로젝트로 제작되었습니다.

```

```
