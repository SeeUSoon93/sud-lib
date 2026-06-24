"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useLayoutEffect
} from "react";
import { createPortal } from "react-dom";
import {
  computeColorStyles,
  resolveColor,
  getShadowStyle,
  getShapeStyles,
  mergeClassNames,
  resolveSurfaceStyle
} from "../../../theme/themeUtils";
import { useTheme } from "../../../theme/ThemeContext";
import {
  globalActivePopupRefs,
  popupParentMap,
  isInDescendantPopup
} from "../../../utils/popupUtils";
import { Divider } from "../Divider";
import { Typography } from "../../general/Typography";
import { Button } from "../../general/Button";

const TRIGGER_GAP = 8;
const ARROW_SIZE = 8;

// 전역 변수들을 WeakMap으로 변경
const popupGroup = new WeakMap();

export const PopupBase = ({
  children,
  content,
  title,
  arrow = true,
  trigger = "hover",
  placement = "bottom",
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  closeOnClick = true,
  disabled = false,
  className = "",
  divider = false,
  background,
  color,
  border,
  borderColor,
  borderType = "solid",
  borderWeight = 1,
  shape = "rounded",
  shadow,
  surface = "floating",
  colorType = "default",
  style = {},
  wrapperStyle = {},
  followTrigger = false,
  contentRef: externalContentRef = null,
  parentRef = null,
  variant = "popup",
  footer = false,
  onCancel,
  onConfirm,
  ...rest
}) => {
  const theme = useTheme();
  const [open, setOpen] = useState(defaultOpen);
  const triggerRef = useRef(null);
  const internalContentRef = useRef(null);
  const contentRef = externalContentRef || internalContentRef;
  const leaveTimer = useRef(null);
  const popupId = useRef({});
  const [mounted, setMounted] = useState(false);

  // 초기 스타일 (보이지 않게)
  const [positionStyle, setPositionStyle] = useState({
    position: "fixed",
    top: "-9999px",
    left: "-9999px",
    opacity: 0,
    pointerEvents: "none",
    zIndex: 10000,
    transition: "opacity 0.2s ease"
  });
  const [isPositioned, setIsPositioned] = useState(false);

  const isControlled = controlledOpen !== undefined;
  const actualOpen = isControlled ? controlledOpen : open;
  const { border: resolvedBorder, shadow: resolvedShadow } =
    resolveSurfaceStyle({
      surface,
      border,
      shadow
    });

  // 컴포넌트가 마운트된 후에만 document 객체에 접근
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const setOpenState = useCallback(
    (value) => {
      if (!isControlled) setOpen(value);
      onOpenChange?.(value);
      if (!value) {
        setIsPositioned(false);

        // 팝업이 닫힐 때 자식 팝업들도 함께 닫기
        if (contentRef.current) {
          const childPopups = popupGroup.get(contentRef.current);
          if (childPopups) {
            childPopups.forEach((childId) => {
              const childRef = Array.from(globalActivePopupRefs).find(
                (ref) => ref.current?.popupInstance?.id === childId
              );
              if (childRef?.current?.popupInstance?.hide) {
                childRef.current.popupInstance.hide();
              }
            });
          }
        }
      }
    },
    [isControlled, onOpenChange, contentRef]
  );

  const show = useCallback(() => {
    if (!disabled && !actualOpen && contentRef?.current) {
      // 타이머가 있다면 제거
      if (leaveTimer.current) {
        clearTimeout(leaveTimer.current);
        leaveTimer.current = null;
      }

      setOpenState(true);
    } else if (!disabled && !actualOpen) {
      setOpenState(true);
    }
  }, [actualOpen, contentRef, disabled, setOpenState]);

  const hide = useCallback(() => {
    if (disabled) return;

    // click 트리거일 때는 즉시 닫기
    if (trigger === "click") {
      setOpenState(false);
      return;
    }

    // hover 트리거일 때만 타이머 사용
    if (leaveTimer.current) {
      clearTimeout(leaveTimer.current);
    }

    leaveTimer.current = setTimeout(() => {
      setOpenState(false);
    }, 100);
  }, [disabled, setOpenState, trigger]);

  const toggle = useCallback(() => {
    if (!disabled) setOpenState(!actualOpen);
  }, [actualOpen, disabled, setOpenState]);

  const handleConfirm = () => {
    onConfirm?.();
    toggle();
  };

  const handleCancel = () => {
    onCancel?.();
    toggle();
  };
  // 기본 외부 클릭 (click 트리거 전용)
  useEffect(() => {
    if ((trigger !== "click" && trigger !== "contextMenu") || !actualOpen)
      return;
    const handleClickOutside = (e) => {
      if (
        !triggerRef.current?.contains(e.target) &&
        !contentRef.current?.contains(e.target)
      ) {
        hide();
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () =>
      document.removeEventListener("click", handleClickOutside, true);
  }, [trigger, actualOpen, hide, contentRef]);

  const { bgColor, txtColor, borColor } = computeColorStyles({
    theme,
    border: resolvedBorder,
    fallback: colorType
  });
  const finalBgColor = background ? resolveColor(background, theme) : bgColor;
  const finalTxtColor = color ? resolveColor(color, theme) : txtColor;
  const finalBorColor = borderColor
    ? resolveColor(borderColor, theme)
    : borColor;
  const finalBorStyle =
    resolvedBorder && finalBorColor
      ? `${borderWeight}px ${borderType} ${finalBorColor}`
      : "none";

  const boxShadow = getShadowStyle(resolvedShadow, theme);
  const shapeStyle = getShapeStyles(shape, theme);

  const calculatePosition = useCallback(() => {
    if (!triggerRef.current || !contentRef.current) return {};
    const triggerRect = triggerRef.current.getBoundingClientRect();
    const contentRect = contentRef.current.getBoundingClientRect();
    const base = {
      position: "fixed",
      zIndex: 10000,
      transition: "opacity 0.2s ease"
    };

    // 세부 placement 파싱
    const [mainPlacement, subPlacement] = placement.split("-");

    // 위치 계산 함수
    const getPos = (main, sub) => {
      let left = 0, top = 0;
      switch (main) {
        case "top":
          left = triggerRect.left + triggerRect.width / 2 - contentRect.width / 2;
          if (sub === "left") left = triggerRect.left;
          else if (sub === "right") left = triggerRect.right - contentRect.width;
          return { top: triggerRect.top - contentRect.height - ARROW_SIZE - TRIGGER_GAP, left };
        case "bottom":
          left = triggerRect.left + triggerRect.width / 2 - contentRect.width / 2;
          if (sub === "left") left = triggerRect.left;
          else if (sub === "right") left = triggerRect.right - contentRect.width;
          return { top: triggerRect.bottom + ARROW_SIZE + TRIGGER_GAP, left };
        case "left":
          top = triggerRect.top + triggerRect.height / 2 - contentRect.height / 2;
          if (sub === "top") top = triggerRect.top;
          else if (sub === "bottom") top = triggerRect.bottom - contentRect.height;
          return { top, left: triggerRect.left - contentRect.width - ARROW_SIZE - TRIGGER_GAP };
        case "right":
          top = triggerRect.top + triggerRect.height / 2 - contentRect.height / 2;
          if (sub === "top") top = triggerRect.top;
          else if (sub === "bottom") top = triggerRect.bottom - contentRect.height;
          return { top, left: triggerRect.right + ARROW_SIZE + TRIGGER_GAP };
        default:
          return {};
      }
    };

    // 실제 위치 계산
    const pos = getPos(mainPlacement, subPlacement);

    const winW = window.innerWidth;
    const winH = window.innerHeight;
    const width = contentRect.width;
    const height = contentRect.height;
    
    let popupLeft = pos.left ?? 0;
    let popupTop = pos.top ?? 0;

    // 화면 벗어남 보정
    const clampedLeft = Math.min(Math.max(popupLeft, 8), Math.max(8, winW - width - 8));
    const clampedTop = Math.min(Math.max(popupTop, 8), Math.max(8, winH - height - 8));

    // 화살표 상대 위치 계산
    let arrowX = "50%";
    let arrowY = "50%";

    if (mainPlacement === "top" || mainPlacement === "bottom") {
      const triggerCenterX = triggerRect.left + triggerRect.width / 2;
      let relativeX = triggerCenterX - clampedLeft;
      // 둥근 모서리를 벗어나지 않도록 제한
      relativeX = Math.max(16, Math.min(relativeX, width - 16));
      arrowX = `${relativeX}px`;
    } else {
      const triggerCenterY = triggerRect.top + triggerRect.height / 2;
      let relativeY = triggerCenterY - clampedTop;
      relativeY = Math.max(16, Math.min(relativeY, height - 16));
      arrowY = `${relativeY}px`;
    }

    return {
      ...base,
      top: clampedTop,
      left: clampedLeft,
      '--arrow-x': arrowX,
      '--arrow-y': arrowY
    };
  }, [placement, contentRef]);

  useLayoutEffect(() => {
    if (
      actualOpen &&
      contentRef.current &&
      triggerRef.current &&
      !isPositioned
    ) {
      const style = calculatePosition();
      setPositionStyle({
        ...style,
        opacity: 1,
        pointerEvents: "auto"
      });
      setIsPositioned(true);
    } else if (!actualOpen) {
      setPositionStyle((prev) => ({
        ...prev,
        top: "-9999px",
        left: "-9999px",
        opacity: 0,
        pointerEvents: "none"
      }));
    }
  }, [actualOpen, isPositioned, calculatePosition, contentRef]);
  useEffect(() => {
    if (!actualOpen) return;

    const updatePosition = () => {
      const newStyle = calculatePosition();
      setPositionStyle((prev) => ({
        ...prev,
        ...newStyle,
        opacity: 1,
        pointerEvents: "auto"
      }));
    };

    // 캡처 단계에서 스크롤도 잡아야 trigger 내부 스크롤링도 반영됩니다.
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [actualOpen, calculatePosition]);

  useEffect(() => {
    if (!actualOpen || !followTrigger) return;

    let rafId = null;

    const syncPosition = () => {
      const newStyle = calculatePosition();
      setPositionStyle((prev) => ({
        ...prev,
        ...newStyle,
        opacity: 1,
        pointerEvents: "auto"
      }));
      rafId = requestAnimationFrame(syncPosition);
    };

    rafId = requestAnimationFrame(syncPosition);

    return () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [actualOpen, followTrigger, calculatePosition]);

  const getDiamondStyle = useCallback(
    ({ type = "background" }) => {
      const isBorder = type === "border";
      const hasVisibleBorder = resolvedBorder && finalBorColor && borderWeight > 0;
      const size = ARROW_SIZE * 2 + (hasVisibleBorder ? borderWeight * 2 : 0);
      const pythagoras = Math.sqrt(borderWeight * borderWeight * 2);
      const offset = !isBorder && hasVisibleBorder ? pythagoras : 0;

      const [mainPlacement, subPlacement] = placement.split("-");

      const gradientMap = {
        bottom: `linear-gradient(135deg, ${finalBgColor} 50%, transparent 50%)`,
        top: `linear-gradient(-45deg, ${finalBgColor} 50%, transparent 50%)`,
        left: `linear-gradient(225deg, ${finalBgColor} 50%, transparent 50%)`,
        right: `linear-gradient(45deg, ${finalBgColor} 50%, transparent 50%)`
      };

      const base = {
        width: `${size}px`,
        height: `${size}px`,
        position: "absolute",
        zIndex: isBorder ? 1 : 3,
        border: isBorder ? finalBorStyle : undefined,
        borderRadius: "2px 0 0 0",
        background: !isBorder ? gradientMap[mainPlacement] : undefined,
        backgroundColor: isBorder ? (finalBorColor ?? finalBgColor) : undefined,
        boxShadow: isBorder ? boxShadow : undefined
      };

      const posMap = {
        bottom: {
          top: `-${ARROW_SIZE - offset}px`,
          left: subPlacement === "left" ? `16px` : subPlacement === "right" ? undefined : "var(--arrow-x, 50%)",
          right: subPlacement === "right" ? `16px` : undefined,
          transform: subPlacement === "left" || subPlacement === "right" ? "rotate(45deg)" : "translateX(-50%) rotate(45deg)"
        },
        top: {
          bottom: `-${ARROW_SIZE - offset}px`,
          left: subPlacement === "left" ? `16px` : subPlacement === "right" ? undefined : "var(--arrow-x, 50%)",
          right: subPlacement === "right" ? `16px` : undefined,
          transform: subPlacement === "left" || subPlacement === "right" ? "rotate(45deg)" : "translateX(-50%) rotate(45deg)"
        },
        right: {
          left: `-${ARROW_SIZE - offset}px`,
          top: subPlacement === "top" ? `16px` : subPlacement === "bottom" ? undefined : "var(--arrow-y, 50%)",
          bottom: subPlacement === "bottom" ? `16px` : undefined,
          transform: subPlacement === "top" || subPlacement === "bottom" ? "rotate(45deg)" : "translateY(-50%) rotate(45deg)"
        },
        left: {
          right: `-${ARROW_SIZE - offset}px`,
          top: subPlacement === "top" ? `16px` : subPlacement === "bottom" ? undefined : "var(--arrow-y, 50%)",
          bottom: subPlacement === "bottom" ? `16px` : undefined,
          transform: subPlacement === "top" || subPlacement === "bottom" ? "rotate(45deg)" : "translateY(-50%) rotate(45deg)"
        }
      };

      return { ...base, ...posMap[mainPlacement] };
    },
    [
      placement,
      finalBgColor,
      finalBorColor,
      finalBorStyle,
      resolvedBorder,
      borderWeight,
      boxShadow
    ]
  );

  // 기존의 포인터 이동/나감 이벤트 대신 전역 이벤트로 관리합니다.
  useEffect(() => {
    if (trigger !== "hover") return;

    const handlePointer = (e) => {
      const target = document.elementFromPoint(e.clientX, e.clientY);

      const isInsideTrigger = triggerRef.current?.contains(target);
      const isInsidePopup = contentRef.current?.contains(target);

      const isInMyDescendant = isInDescendantPopup(
        contentRef,
        target,
        popupParentMap,
        globalActivePopupRefs
      );

      if (!actualOpen) {
        if (isInsideTrigger) show();
        return;
      }

      if (!isInsideTrigger && !isInsidePopup && !isInMyDescendant) {
        if (!leaveTimer.current) {
          leaveTimer.current = setTimeout(() => {
            hide();
          }, 100);
        }
      } else {
        clearTimeout(leaveTimer.current);
        leaveTimer.current = null;
      }
    };

    document.addEventListener("pointermove", handlePointer);
    return () => {
      document.removeEventListener("pointermove", handlePointer);
      clearTimeout(leaveTimer.current);
    };
  }, [trigger, actualOpen, show, hide, contentRef]);

  // 등록: 전역 popup 그룹에 자신을 추가 (형제 관리를 위한 새로운 방식)
  useEffect(() => {
    const currentPopupId = popupId.current;

    if (trigger === "hover") {
      // WeakSet/WeakMap에 등록
      globalActivePopupRefs.add(contentRef);

      if (parentRef) {
        // 부모-자식 관계 등록
        popupParentMap.set(contentRef, parentRef);

        // 그룹에 등록
        const siblings = popupGroup.get(parentRef) || new Set();
        siblings.add(currentPopupId);
        popupGroup.set(parentRef, siblings);
      }
    }

    // 팝업 인스턴스에 정보 저장
    if (contentRef.current) {
      contentRef.current.popupInstance = {
        show,
        hide,
        toggle,
        id: currentPopupId,
        parentRef: parentRef
      };
    }

    return () => {
      if (trigger === "hover") {
        globalActivePopupRefs.delete(contentRef);
        popupParentMap.delete(contentRef);

        if (parentRef) {
          const siblings = popupGroup.get(parentRef);
          if (siblings) {
            siblings.delete(currentPopupId);
            if (siblings.size === 0) {
              popupGroup.delete(parentRef);
            }
          }
        }

        // 타이머 정리
        if (leaveTimer.current) {
          clearTimeout(leaveTimer.current);
          leaveTimer.current = null;
        }
      }
    };
  }, [trigger, parentRef, show, hide, toggle, contentRef]);

  return (
    <div
      className={mergeClassNames(`sud-${variant}`, className)}
      style={{
        position: "relative",
        display: "inline-block",
        ...wrapperStyle
      }}
      {...rest}
    >
      <div
        ref={triggerRef}
        onClick={trigger === "click" ? toggle : undefined}
        onContextMenu={
          trigger === "contextMenu"
            ? (e) => {
                e.preventDefault();
                toggle();
              }
            : undefined
        }
      >
        {children}
      </div>

      {mounted &&
        actualOpen &&
        createPortal(
          <div
            ref={contentRef}
            style={positionStyle}
            onClick={(e) => {
              e.stopPropagation();
              if (closeOnClick) hide();
            }}
            onMouseEnter={() => {
              if (leaveTimer.current) {
                clearTimeout(leaveTimer.current);
                leaveTimer.current = null;
              }
            }}
            onMouseLeave={() => {
              if (trigger === "click") return;
              if (!leaveTimer.current) {
                leaveTimer.current = setTimeout(() => {
                  hide();
                }, 100);
              }
            }}
          >
            {arrow && (
              <div
                className="back"
                style={getDiamondStyle({ type: "border" })}
              />
            )}
            <div
              className={`sud-${variant}__content`}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                backgroundColor: finalBgColor,
                color: finalTxtColor,
                border: finalBorStyle,
                padding: "8px",
                width: "max-content",
                whiteSpace: "nowrap",
                ...shapeStyle,
                boxShadow,
                zIndex: 2,
                position: "relative",
                ...style
              }}
            >
              {title &&
                (typeof title === "string" ? (
                  <Typography
                    as="span"
                    pretendard="B"
                    size="lg"
                    color={color}
                    style={{ whiteSpace: "nowrap" }}
                  >
                    {title}
                  </Typography>
                ) : (
                  title
                ))}
              {title && content && divider && <Divider style={{ margin: 0 }} />}
              {typeof content === "function" ? (
                content()
              ) : content ? (
                typeof content === "string" ? (
                  <Typography
                    as="span"
                    color={finalTxtColor}
                    style={{ whiteSpace: "nowrap" }}
                  >
                    {content}
                  </Typography>
                ) : (
                  content
                )
              ) : (
                content
              )}
              {variant === "popconfirm" &&
              (footer === true || footer === undefined) ? (
                <div className="sud-popconfirm__footer flex flex-row items-center justify-center gap-[8px]">
                  <Button colorType="primary" onClick={handleConfirm}>
                    okay
                  </Button>
                  <Button colorType="danger" onClick={handleCancel}>
                    cancel
                  </Button>
                </div>
              ) : footer === true || footer !== undefined ? (
                footer
              ) : null}
            </div>
            {arrow && (
              <div
                className="front"
                style={getDiamondStyle({ type: "background" })}
              />
            )}
          </div>,
          document.body
        )}
    </div>
  );
};
