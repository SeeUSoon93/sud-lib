// 로딩 스피너 클래스 반환
export const getSpinnerClass = (type = "") =>
  `loading-spinner ${type ? `${type}-spin` : ""}`;

// pulse 클릭 애니메이션 효과
export const applyPulseEffect = (el) => {
  if (!el) return;

  const pulse = document.createElement("div");
  const rect = el.getBoundingClientRect();

  pulse.style.position = "absolute";
  pulse.style.top = 0;
  pulse.style.left = 0;
  pulse.style.width = `${rect.width}px`;
  pulse.style.height = `${rect.height}px`;
  pulse.style.borderRadius = el.style.borderRadius || "50%";
  pulse.style.pointerEvents = "none";
  pulse.style.background = "rgba(0, 0, 0, 0.1)";
  pulse.style.transform = "scale(1)";
  pulse.style.transformOrigin = "center center";
  pulse.style.opacity = "1";
  pulse.style.transition = "transform 0.3s ease-out, opacity 0.3s ease-out";
  pulse.style.zIndex = 9999;

  // 부모 기준으로 위치 잡기
  el.style.position = el.style.position || "relative";
  el.appendChild(pulse);

  requestAnimationFrame(() => {
    pulse.style.transform = "scale(1.2)";
    pulse.style.opacity = "0";
  });

  // 제거
  setTimeout(() => {
    pulse.remove();
  }, 400);
};

// bounce 효과가 있는 pulse 애니메이션
export const pulseThumbScaleWithBounce = (el) => {
  el.style.transition = "transform 0.15s ease-out";
  el.style.transform = "scale(1.1)";
  setTimeout(() => {
    el.style.transition = "transform 0.1s ease-in";
    el.style.transform = "scale(0.95)";
    setTimeout(() => {
      el.style.transition = "transform 0.1s ease-in-out";
      el.style.transform = "scale(1)";
    }, 100);
  }, 150);
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
