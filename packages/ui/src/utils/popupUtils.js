// utils/popupUtils.js

// 전역 팝업 추적용 구조들 (PopupBase와 PopoverItem 양쪽에서 공유)
export const globalActivePopupRefs = new Set(); // 각 팝업 contentRef (ref)
export const popupParentMap = new WeakMap(); // 자식 ref -> 부모 ref

/**
 * 팝업 트리거 기준으로 자식 popup들 중 하나에 마우스가 올라가 있는지 확인
 * @param {React.RefObject} ancestorRef - 현재 triggerRef
 * @param {HTMLElement} targetElement - pointermove에서의 e.target
 * @param {WeakMap} popupParentMap - 자식 → 부모 ref 매핑
 * @param {Set} globalActivePopupRefs - 모든 contentRef 모음
 * @returns {boolean}
 */
export const isInDescendantPopup = (
  ancestorRef,
  targetElement,
  popupParentMap,
  globalActivePopupRefs
) => {
  for (const ref of globalActivePopupRefs) {
    if (!ref.current?.contains(targetElement)) continue;

    let current = popupParentMap.get(ref);
    while (current) {
      if (current === ancestorRef) return true;
      current = popupParentMap.get(current);
    }
  }
  return false;
};
