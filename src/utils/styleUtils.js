// 로딩 스피너 클래스 반환
export const getSpinnerClass = (type = "") =>
  `loading-spinner ${type ? `${type}-spin` : ""}`;

const activePulseCounts = new WeakMap();
const originalPulsePositions = new WeakMap();
const activeBounceStates = new WeakMap();

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// pulse 클릭 애니메이션 효과
export const applyPulseEffect = (el) => {
  if (!el || prefersReducedMotion()) return;

  const pulse = document.createElement("div");
  const rect = el.getBoundingClientRect();
  const computedStyle = window.getComputedStyle(el);
  const activeCount = activePulseCounts.get(el) ?? 0;

  pulse.style.position = "absolute";
  pulse.style.top = 0;
  pulse.style.left = 0;
  pulse.style.width = `${rect.width}px`;
  pulse.style.height = `${rect.height}px`;
  pulse.style.borderRadius = computedStyle.borderRadius || "50%";
  pulse.style.pointerEvents = "none";
  pulse.style.background = "rgba(0, 0, 0, 0.1)";
  pulse.style.transform = "scale(1)";
  pulse.style.transformOrigin = "center center";
  pulse.style.opacity = "1";
  pulse.style.transition = "transform 0.3s ease-out, opacity 0.3s ease-out";
  pulse.style.zIndex = 9999;

  // static 요소만 임시 기준점으로 만들고 마지막 pulse가 끝나면 원래 값으로 복원한다.
  if (activeCount === 0) {
    originalPulsePositions.set(el, el.style.position);
  }
  if (computedStyle.position === "static") {
    el.style.position = "relative";
  }
  activePulseCounts.set(el, activeCount + 1);
  el.appendChild(pulse);

  requestAnimationFrame(() => {
    pulse.style.transform = "scale(1.2)";
    pulse.style.opacity = "0";
  });

  // 제거
  setTimeout(() => {
    pulse.remove();
    const remainingCount = (activePulseCounts.get(el) ?? 1) - 1;
    if (remainingCount <= 0) {
      el.style.position = originalPulsePositions.get(el) ?? "";
      activePulseCounts.delete(el);
      originalPulsePositions.delete(el);
    } else {
      activePulseCounts.set(el, remainingCount);
    }
  }, 400);
};

// bounce 효과가 있는 pulse 애니메이션
export const pulseThumbScaleWithBounce = (el) => {
  if (!el || prefersReducedMotion()) return;

  const previousState = activeBounceStates.get(el);
  if (previousState) {
    previousState.timers.forEach(clearTimeout);
  }

  const original = previousState?.original ?? {
    transition: el.style.transition,
    transform: el.style.transform
  };
  const timers = [];
  activeBounceStates.set(el, { original, timers });

  el.style.transition = "transform 0.15s ease-out";
  el.style.transform = "scale(1.1)";
  timers.push(setTimeout(() => {
    el.style.transition = "transform 0.1s ease-in";
    el.style.transform = "scale(0.95)";
    timers.push(setTimeout(() => {
      el.style.transition = original.transition;
      el.style.transform = original.transform;
      activeBounceStates.delete(el);
    }, 100));
  }, 150));
};
// style 태그 동적 삽입 (중복 방지)
export const injectStyleOnce = (id, css) => {
  if (!document.getElementById(id)) {
    const styleSheet = document.createElement("style");
    styleSheet.id = id;
    styleSheet.innerText = css;
    document.head.appendChild(styleSheet);
  }
};
