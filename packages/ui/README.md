# Sud UI

쉽고 빠르게 사용할 수 있는 React UI 컴포넌트 라이브러리입니다.

## ✨ 특징

- 다양한 실무형 UI 컴포넌트 제공
- 다크/라이트 테마 지원
- 직관적인 API와 타입 지원
- 커스텀 스타일 및 테마 확장 가능

---

## 📦 설치

```bash
npm install @sud/ui
# 또는
yarn add @sud/ui
```

---

## 🔨 빠른 시작

```jsx
import React from "react";
import { Button, Modal } from "@sud/ui";
import "@sud/ui/dist/index.css"; // 스타일 적용

function App() {
  const [open, setOpen] = React.useState(false);

  return (
    <div>
      <Button type="primary" onClick={() => setOpen(true)}>
        모달 열기
      </Button>
      <Modal open={open} onClose={() => setOpen(false)} title="안녕하세요">
        Sud UI를 사용해주셔서 감사합니다!
      </Modal>
    </div>
  );
}
```

---

## 🧩 주요 컴포넌트

- **Button**: 다양한 스타일과 크기 지원
- **Modal**: 알림, 확인, 커스텀 모달
- **Accordion**: 아코디언 UI
- **Table**: 정렬/필터/페이지네이션 지원
- **Input**: 텍스트, 숫자, 패스워드 등 다양한 입력
- **Select**: 싱글/멀티 셀렉트
- **Tabs**: 탭 UI
- **Tooltip**: 툴팁
- **Toast/Notification**: 알림 메시지
- **Spinner/Progress**: 로딩 표시
- ...외 다수

전체 컴포넌트 목록과 상세 API는 [문서](https://sud-ui-docs.example.com)에서 확인하세요.

---

## 🎨 테마 & 커스터마이징

- 기본 제공 테마 외에, 직접 색상/폰트/사이즈를 커스터마이징할 수 있습니다.
- ThemeProvider로 전역 테마 적용 가능

```jsx
import { ThemeProvider, darkTheme } from "@sud/ui";

<ThemeProvider theme={darkTheme}>
  <App />
</ThemeProvider>;
```

---

## 📚 문서 & 데모

- [공식 문서](https://sud-ui-docs.example.com)
- [Storybook 데모](https://sud-ui-storybook.example.com)

---

## 🛠️ 개발 및 빌드

```bash
# 개발 서버 실행
npm run dev

# 라이브러리 빌드
npm run build
```

---

## 🤝 기여하기

- 이슈/PR 환영합니다!
- 컨트리뷰션 가이드는 [CONTRIBUTING.md](./CONTRIBUTING.md) 참고

---

## 📄 라이선스

MIT

---

> Sud UI는 실무에서 바로 쓸 수 있는 컴포넌트와 개발 경험을 제공합니다.  
> 더 많은 정보와 예제는 공식 문서를 참고하세요!
