# sud-ui 개선안 (v1.9.1 기준 코드 리뷰)

> 이 문서는 코드 전수 검토 결과를 우선순위별로 정리한 작업 지시서입니다.
> 각 항목에 대상 파일, 현재 동작, 문제점, 구체적 수정 방법을 기술했습니다.

---

## P0 — 실사용 버그 / 배포 품질 문제 (즉시 수정 권장)

### P0-1. Button에 `type="button"` 기본값이 없어 form 안에서 submit이 발생함

- **파일**: `src/components/general/Button.jsx`
- **현재**: `<button>` 요소에 `type` 속성을 전혀 지정하지 않음. HTML 기본값은 `type="submit"`이므로, `<form>` 내부에서 이 Button을 쓰면 클릭할 때마다 폼이 제출됨.
- **수정**:
  1. props에 `type = "button"` 추가.
  2. `<button type={type} ...>`으로 전달.
  3. `src/components/general/Button.d.ts`에 `type?: "button" | "submit" | "reset"` 추가.
- **동일 점검 대상**: `src/components/general/FloatButton.jsx`, `Pagination.jsx`, `Card.jsx`(닫기 버튼), 그 외 raw `<button>`을 렌더하는 모든 컴포넌트. `grep -rn "<button" src/` 로 전수 확인 후 전부 `type="button"` 명시.

### P0-2. Button이 `...rest`를 스프레드하지 않아 표준 DOM props가 전달 불가

- **파일**: `src/components/general/Button.jsx`
- **현재**: props를 화이트리스트로만 받음. `onMouseEnter`, `onFocus`, `data-*`, `id`, `tabIndex`, `form` 등 표준 속성을 사용자가 전달할 방법이 없음.
- **수정**: 시그니처 마지막에 `...rest`를 받고 `<button {...rest}>`로 전달(명시 props가 rest보다 뒤에 오지 않도록 스프레드 순서 주의 — rest를 먼저 스프레드하고 컴포넌트가 제어하는 `style`, `className`, `disabled`, `onClick`은 뒤에 배치).
- **동일 점검 대상**: 라이브러리 전반. 특히 `Input.jsx`, `Checkbox.jsx`, `Radio.jsx`, `Switch.jsx` 등 폼 컴포넌트는 `name`, `autoComplete`, `form` 등이 반드시 통과돼야 함.

### P0-3. `forwardRef` 미지원 — 사용자가 DOM ref를 얻을 수 없음

- **파일**: `src/components/general/Button.jsx` (내부에서 `useRef`만 사용), `Input.jsx` 등 대부분의 leaf 컴포넌트.
- **현재**: `grep -rn "forwardRef" src/components/general/Button.jsx src/components/dataEntry/Input.jsx` → 0건. focus 제어, 외부 라이브러리(popper, react-hook-form 등) 연동이 불가능.
- **수정**: 최소한 Button, Input, Textarea, Select, Checkbox, Radio, Switch, Slider에 `React.forwardRef` 적용. 내부 ref가 필요한 경우 `useImperativeHandle` 또는 ref 병합 유틸(`mergeRefs`)을 `src/utils`에 추가해 사용.
- **주의**: React 19에서는 ref-as-prop이 되지만 peerDeps가 `^18.0.0 || ^19.0.0`이므로 forwardRef로 작성해야 18 호환 유지.

### P0-4. 빌드 산출물에서 `"use client"` 지시어가 제거됨 (Next.js App Router 파손)

- **파일**: `vite.config.js`, 산출물 `dist/index.js`
- **현재**: 소스 전반에 `"use client"`가 있으나 `grep -c "use client" dist/index.js` → **0**. Rollup이 번들링하면서 지시어를 제거함. Next.js App Router에서 이 라이브러리를 import하면 서버 컴포넌트로 취급되어 hooks 사용 시 런타임 에러 발생. (README/문서에서 수동으로 "use client" 래핑을 안내하고 있다면 그 우회책에 의존 중인 상태.)
- **수정**: `vite.config.js`의 `rollupOptions.output`에 banner 추가:
  ```js
  output: {
    banner: '"use client";',
    ...
  }
  ```
  단일 파일 번들(formats: ["es"], 1개 청크)이므로 banner 방식으로 충분. P1-1(모듈 보존)을 적용할 경우에는 `rollup-plugin-preserve-directives` 또는 vite 플러그인으로 파일별 지시어 보존 필요.
- **검증**: `pnpm build` 후 `head -1 dist/index.js`에 `"use client";` 확인.

### P0-5. `package.json` exports 맵에서 `types` 조건 순서 오류

- **파일**: `package.json`
- **현재**:
  ```json
  ".": { "import": "./dist/index.js", "types": "./dist/index.d.ts", "style": "./dist/index.css" }
  ```
  TypeScript는 exports 조건을 **선언 순서대로** 매칭하므로 `types`가 반드시 첫 번째여야 함. 현재는 `import`가 먼저라 `moduleResolution: "bundler" | "node16"` 환경에서 타입 해석이 깨질 수 있음.
- **수정**:
  ```json
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "style": "./dist/index.css",
      "default": "./dist/index.js"
    },
    "./dist/index.css": "./dist/index.css",
    "./index.css": "./dist/index.css",
    "./package.json": "./package.json"
  }
  ```
  (`./index.css` 별칭과 `./package.json` 서브패스는 도구 호환성용 — 선택이지만 권장.)

### P0-6. ToastRoot / NotificationRoot 전역 핸들러의 수명주기 누수

- **파일**: `src/components/feedback/ToastRoot.jsx`, `src/components/feedback/NotificationRoot.jsx`
- **현재**: `useEffect`에서 모듈 전역 `addToastHandler`에 setState 클로저를 대입하고 **cleanup이 없음**. 문제 3가지:
  1. ToastRoot가 unmount된 후 `toast.success(...)` 호출 시 unmount된 컴포넌트의 setState 호출(경고/누수).
  2. ToastRoot가 2개 이상 마운트되면 마지막 것만 동작하고, 그중 하나가 unmount되면 전부 무동작.
  3. mount 전에 호출된 toast는 소실됨(큐 없음).
- **수정**:
  ```js
  useEffect(() => {
    addToastHandler = (t) => { ... };
    flushQueuedToasts(); // mount 전 호출분 처리
    return () => { if (addToastHandler === myHandler) addToastHandler = null; };
  }, []);
  ```
  - 모듈 레벨에 `pendingQueue = []`를 두고 핸들러가 null일 때 push, mount 시 flush.
  - NotificationRoot도 동일 패턴 적용.

### P0-7. Modal: 스크롤 락 / 포커스 트랩 / 포커스 복원 부재

- **파일**: `src/components/dataDisplay/Modal.jsx` (Drawer도 동일: `src/components/dataDisplay/Drawer.jsx`)
- **현재**: `grep -n "overflow" Modal.jsx Drawer.jsx` → 0건. 모달이 열려도 배경이 스크롤되고, Tab 키로 모달 밖 요소에 포커스가 나가며, 닫힐 때 트리거로 포커스가 복원되지 않음. `aria-modal="true"`를 선언만 하고 실제 동작이 뒷받침되지 않는 상태.
- **수정** (공용 훅으로 구현해 Modal/Drawer가 공유):
  1. `src/utils/useScrollLock.js`: open 시 `document.body.style.overflow = "hidden"` + scrollbar-gutter 보정, close/unmount 시 원복. 중첩 모달 대비 카운터 방식.
  2. `src/utils/useFocusTrap.js`: 컨테이너 내 focusable 요소 수집, Tab/Shift+Tab 순환, open 시 첫 focusable(또는 컨테이너)로 포커스 이동, close 시 이전 activeElement 복원.
  3. Modal의 `role="dialog"`는 overlay가 아니라 **다이얼로그 패널 요소**에 붙여야 함(현재 overlay div에 붙어 있음).
- **추가 버그**: `opacity: open ? 1 : 0, transition: ...`은 무의미함 — `if (!open) return null`이라 open은 항상 true. 진입/퇴장 애니메이션을 원하면 mount 후 상태 토글 방식(ToastItem과 동일 패턴)으로 구현하고, 아니면 해당 스타일 제거.

---

## P1 — 아키텍처 / 배포 구조 개선

### P1-1. 번들 크기 794KB — dayjs·sud-icons 번들링 + 단일 파일 출력

- **파일**: `vite.config.js`, `package.json`
- **현재**: `dist/index.js`가 **794KB(minified)** 단일 ESM 파일. external이 react/react-dom뿐이라 `dayjs`, `sud-icons`가 통째로 인라인됨. 사용자가 Button 하나만 써도 전체 코드를 파싱하며, 사용자 앱에 dayjs가 이미 있어도 중복 포함됨.
- **수정**:
  1. external 확장:
     ```js
     rollupOptions: {
       external: ["react", "react-dom", "react/jsx-runtime", "dayjs", /^dayjs\//, "sud-icons"]
     }
     ```
     `dayjs`, `sud-icons`는 dependencies에 이미 있으므로 external로 빼도 사용자 설치에 문제 없음.
  2. **모듈 보존 출력**(트리셰이킹 극대화):
     ```js
     output: {
       preserveModules: true,
       preserveModulesRoot: "src",
       entryFileNames: "[name].js"
     }
     ```
     이 경우 P0-4의 banner 대신 파일별 `"use client"` 보존 플러그인 필요. `sideEffects`는 `["**/*.css"]` 유지.
  3. 소스 곳곳의 `import "../../index.css"`(예: Button.jsx 2행) 제거 — 진입점 `src/index.js`의 1회 import로 충분하며, preserveModules 시 각 파일이 CSS를 중복 참조하게 되는 원인.
- **검증**: 빌드 후 `dist` 용량 비교, 데모 앱에서 Button만 import한 번들 사이즈 측정.

### P1-2. 테스트 인프라 부재

- **현재**: 테스트 러너·테스트 파일이 전무. `Harden TimePicker selection state` 같은 회귀성 커밋이 반복되는 프로젝트인데 안전망이 없음.
- **수정**:
  1. `vitest` + `@testing-library/react` + `@testing-library/user-event` + `jsdom` devDependencies 추가.
  2. `vite.config.js`에 `test: { environment: "jsdom", setupFiles: "./test/setup.js" }` 추가.
  3. 우선순위 테스트 (P0 수정 사항의 회귀 방지 겸):
     - Button: form 내부 클릭 시 submit 미발생, disabled/loading 시 onClick 미호출, rest props 전달.
     - Modal: ESC 닫힘, overlay 클릭 닫힘, 패널 클릭 시 닫히지 않음, body 스크롤 락, 포커스 복원.
     - toast/notification: 호출→렌더→duration 후 제거, unmount 후 호출 시 무에러.
     - resolveColor/parseColorString/adjustBrightness 유닛 테스트 (`src/theme/themeUtils.js`).
     - Select/DatePicker/TimePicker: 키보드 내비게이션 스모크 테스트.
  4. `package.json` scripts에 `"test": "vitest run"`, `"test:watch": "vitest"` 추가.

### P1-3. 수기 `.d.ts` 관리 → JSDoc 기반 자동 생성 또는 TS 마이그레이션

- **현재**: 모든 컴포넌트가 `.jsx` + 수기 `.d.ts` 쌍으로 관리됨. `scripts/check-exports.mjs`로 누락만 검사하는데, **props 시그니처 불일치는 잡지 못함** (예: P0-1에서 `type` prop을 추가하면 .d.ts를 수동으로 고쳐야 함). `src/index.d.ts`에는 실제 구현에 없는 `export { default as ... }` 패턴이 다수 있어 (구현은 전부 named export) 타입과 런타임이 이미 어긋나 있을 가능성이 큼.
- **수정 (단계적)**:
  1. **1단계(저비용)**: `typescript`를 devDependency로 추가하고 `tsc --noEmit`으로 `.d.ts`↔`.jsx` cross-check하는 타입 테스트 파일 작성 — `import { Button } from "../src"` 후 대표 사용례를 타입 체크. CI/`check:exports`에 편입.
  2. **2단계(권장)**: `allowJs + checkJs` 켜고 파일 단위로 `.jsx → .tsx` 점진 전환, `vite-plugin-dts`로 `.d.ts` 자동 생성. 전환 순서: `theme/` → `utils/` → leaf 컴포넌트 → 복합 컴포넌트.
  3. `src/index.d.ts`의 `export { default as X }` 라인 전수 검증: 구현이 named export만 있으면 해당 라인 제거(현재 존재하지 않는 default export를 선언 중).

### P1-4. 유틸 중복: `applyPulseEffect` / `pulseThumbScaleWithBounce`가 두 곳에 다른 구현으로 존재

- **파일**: `src/utils/styleUtils.js` (DOM 노드 생성 방식) vs `src/theme/themeUtils.js` (CSS animation 방식)
- **현재**: 동일한 이름의 함수가 서로 다른 구현으로 양쪽에 export됨. 어느 쪽을 import하느냐에 따라 동작이 달라지고, 둘 다 public API(`export * from "./theme"`)로 새어 나갈 수 있음.
- **수정**:
  1. 실제 사용처를 grep으로 조사 (`grep -rn "applyPulseEffect\|pulseThumbScaleWithBounce" src/`).
  2. 한쪽 구현으로 통일하고(효과가 다르면 이름을 분리: `applyPulseOverlay` vs `applyPulseAnimation`), 나머지는 삭제.
  3. `themeUtils.js`는 순수 테마 계산만 남기고 DOM 조작 유틸은 `styleUtils.js`로 이동.
  4. public export에서 내부 유틸이 새는지 확인: `src/theme/index.js`가 `themeUtils`를 `export *` 하고 있다면 공개 범위를 명시적 named export로 축소.

### P1-5. ThemeProvider의 body 스타일 직접 변이 — cleanup·SSR·중첩 문제

- **파일**: `src/theme/ThemeContext.jsx`
- **현재**: `useEffect`에서 `document.body.style.backgroundColor/color`를 직접 대입. cleanup이 없어 Provider unmount 후에도 스타일이 남고, Provider를 앱 일부에만 감싸도 body 전체가 바뀌며, 두 Provider 중첩 시 마지막 것이 이김.
- **수정**:
  1. cleanup에서 이전 값 복원:
     ```js
     useEffect(() => {
       const prev = { bg: document.body.style.backgroundColor, color: document.body.style.color };
       document.body.style.backgroundColor = ...;
       document.body.style.color = ...;
       return () => {
         document.body.style.backgroundColor = prev.bg;
         document.body.style.color = prev.color;
       };
     }, [activeTheme]);
     ```
  2. body 변이를 opt-out할 수 있게 `applyBodyStyles = true` prop 추가 (부분 적용 사용자 대응).
  3. `isDarkMode`가 인라인 스타일 기반이라 컴포넌트 색상만 바뀜 — 장기적으로는 CSS 변수(`--sud-*`)로 테마 값을 내려서 다크모드 전환 시 리렌더 비용을 줄이는 방향 검토(P2-4와 연계).

### P1-6. z-index 하드코딩 산재

- **현재**: Modal `9999`, Popup `10000`, Toast `10000`, pulse `9999` 등 매직 넘버가 파일마다 하드코딩. Modal 위에 Select 드롭다운(팝업)이 뜨는 것은 우연히 10000 > 9999라 동작하는 구조.
- **수정**: `src/theme/defaultTheme.js`에 `zIndex: { modal: 1000, popup: 1100, toast: 1200, ... }` 토큰 추가, theme에서 읽도록 전환. `grep -rn "zIndex: 9999\|zIndex: 10000\|z-index" src/` 전수 치환.

---

## P2 — 품질 / 일관성 개선

### P2-1. Button 세부 정리

- **파일**: `src/components/general/Button.jsx`
- `role = "button"` 기본값 제거 — `<button>`에 `role="button"`은 중복이며, prop으로 남기되 기본값은 `undefined`.
- `aria-disabled={disabled || loading}` — 실제 `disabled` 속성이 있으면 중복. `disabled` 대신 `aria-disabled` + 클릭 가드 방식(포커스 유지)을 쓸지 하나로 정책 통일.
- `onClick={!disabled ? handleClick : undefined}` — `handleClick` 내부에서 이미 `disabled || loading` 가드하므로 `onClick={handleClick}`로 단순화.
- `iconPosition = icon ? "left" : ""` — 기본값이 다른 prop에 의존하는 패턴은 혼란. `iconPosition = "left"` 고정으로 단순화 (icon 없으면 어차피 렌더 안 함).
- 스피너 스타일(19~70행 문자열 CSS)을 `injectStyleOnce` 런타임 주입 대신 `src/index.css`로 이동 — SSR 첫 페인트에서 스타일 누락 방지, CSP(unsafe-inline) 환경 호환. 라이브러리 전반의 `injectStyleOnce` 사용처 전수 조사 후 동일 처리.
- 사이즈 분기(`if (size === "sm") ...`)를 객체 룩업으로:
  ```js
  const SIZE_STYLES = { sm: {...}, md: {...}, lg: {...} };
  const sizeStyle = SIZE_STYLES[size] || SIZE_STYLES.md;
  ```

### P2-2. `styleUtils.injectStyleOnce`의 `innerText` → `textContent`

- **파일**: `src/utils/styleUtils.js`
- `innerText`는 레이아웃을 유발하고 jsdom에서 미구현인 경우가 있음. `styleSheet.textContent = css`로 교체.

### P2-3. `applyPulseEffect`(styleUtils 버전)의 인라인 position 변이

- **파일**: `src/utils/styleUtils.js` 27행 `el.style.position = el.style.position || "relative"`
- 요소의 computed position이 `absolute`여도 inline style이 비어 있으면 `relative`를 덮어씀. `getComputedStyle(el).position === "static"`일 때만 relative 지정으로 수정.

### P2-4. `resolveColor`의 색상 해석 견고화

- **파일**: `src/theme/themeUtils.js`
- `parseColorString("blue-gray-5")`처럼 색상명에 하이픈이 들어가면 `(.+)-(\d+)` 정규식이 잘 처리하는지 확인 필요(현재는 greedy라 동작함 — 테스트로 고정).
- `intensity ? theme.colors[color][intensity] : ...` — `intensity`가 0이면 falsy로 무시됨. `intensity !== undefined` 체크로 변경.
- `rgb(...)`, `hsl(...)`, CSS 변수(`var(--x)`) 입력이 그대로 통과되는지 유닛 테스트 추가.

### P2-5. ToastItem의 `React.cloneElement(icon, { size: 18 })` 방어

- **파일**: `src/components/feedback/ToastRoot.jsx` 124행
- 사용자가 icon으로 DOM 요소(`<img/>`)나 문자열을 넘기면 `size` prop이 무의미하거나 경고 발생. `React.isValidElement(icon)` 체크 후 cloneElement, 아니면 그대로 렌더.
- toast id `Date.now() + Math.random()`은 유지 가능하나, `crypto.randomUUID?.() ?? fallback`으로 교체하면 더 안전.

### P2-6. 대형 컴포넌트 분할

- **현재**: `Input.jsx` 933행(Input/Textarea/OTP 동거), `Calendar.jsx` 842행, `ColorPicker.jsx` 725행, `Select.jsx` 720행.
- **수정**: 동작 변경 없이 파일 분리부터:
  - `Input.jsx` → `Input.jsx` / `Textarea.jsx` / `OTP.jsx` + 공용 로직 `useInputBase.js`.
  - `Calendar.jsx` → 날짜 계산 로직을 `src/utils/dateUtils.js`로 추출 (dayjs 의존 집중, 테스트 용이).
  - 분리 후 `src/index.js` re-export 경로 갱신 및 `pnpm check:exports` 통과 확인.

### P2-7. ESLint 훅 규칙 점검 + CI

- `eslint.config.js`에 `react-hooks` 플러그인이 있으니 `pnpm lint`를 CI(GitHub Actions)에 추가: `lint` + `build` + `check:exports` + (P1-2 이후) `test`.
- `.github/workflows/ci.yml` 신규 작성 — push/PR to main에서 실행, Node 20, pnpm 캐시.
- 참고: 저장소에 `package-lock.json`과 `pnpm-lock.yaml`이 **둘 다** 존재함. pnpm을 쓰기로 했다면 `package-lock.json` 삭제 + `packageManager` 필드 추가:
  ```json
  "packageManager": "pnpm@9.x.x"
  ```

### P2-8. `files` 필드에서 `docs` 포함 여부 재검토

- **파일**: `package.json` `"files": ["dist", "docs"]`
- `docs/`(가이드라인 md)가 npm 패키지에 포함됨. 의도된 것이 아니면 제거해 패키지 용량 절감. `README.md`, `LICENSE`는 자동 포함되므로 별도 지정 불필요 (현재 LICENSE 파일이 저장소에 없음 — license: MIT 명시했으므로 `LICENSE` 파일 추가 권장).

---

## P3 — 장기 과제 (방향 제안)

1. **인라인 스타일 → CSS 변수 + 클래스 하이브리드**: 현재 거의 모든 스타일이 인라인이라 사용자가 CSS로 오버라이드하기 어렵고(명시도 최상), 리렌더마다 스타일 객체가 재생성됨. 테마 토큰을 `--sud-*` CSS 변수로 루트에 주입하고 정적 스타일은 클래스로 이동하면 다크모드 전환도 변수 스왑만으로 처리 가능.
2. **접근성 감사**: Select에 aria가 일부 있으나(listbox 패턴), Menu/Dropdown/Tabs/Accordion의 키보드 내비게이션(방향키, Home/End), `aria-selected`/`aria-activedescendant` 일관성을 WAI-ARIA APG 기준으로 감사. axe-core를 vitest에 붙여 자동 검사.
3. **Changeset 도입**: 수동 버전 범프(`Bump package version...` 커밋) 대신 `@changesets/cli`로 버전·CHANGELOG·publish 자동화.
4. **문서 사이트의 props 표를 .d.ts에서 자동 생성**: P1-3의 TS 전환이 끝나면 react-docgen-typescript로 sud.co.kr 문서와 코드 동기화.

---

## 권장 작업 순서 (Codex 실행 가이드)

| 순서 | 항목 | 이유 |
|---|---|---|
| 1 | P1-2 테스트 인프라 | 이후 모든 수정의 안전망 |
| 2 | P0-1 ~ P0-3 (Button/폼 컴포넌트 type·rest·forwardRef) | 사용자 영향 최대, 테스트와 함께 커밋 |
| 3 | P0-6, P0-7 (Toast 수명주기, Modal 스크롤락/포커스) | 독립적, 공용 훅 신설 |
| 4 | P0-4, P0-5 (use client banner, exports 순서) | 빌드 설정만 수정, 빠름 |
| 5 | P1-1 (external + preserveModules) | P0-4와 같은 파일이므로 연달아 |
| 6 | P1-4 ~ P1-6, P2 전반 | 리팩터링 |
| 7 | P1-3 (TS 마이그레이션) | 가장 큰 작업, 마지막 |

각 단계 완료 시 검증: `pnpm lint && pnpm build && pnpm check:exports && pnpm test` (test는 1단계 이후부터).
