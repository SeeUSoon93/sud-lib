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
  mergeClassNames
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
  border = true,
  borderColor,
  borderType = "solid",
  borderWeight = 1,
  shape = "rounded",
  shadow = "sm",
  colorType = "default",
  style = {},
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

  const show = () => {
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
  };

  const hide = () => {
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
  };

  const toggle = () => {
    !disabled && setOpenState(!actualOpen);
  };

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
    if (trigger !== "click" || !actualOpen) return;
    const handleClickOutside = (e) => {
      if (
        !triggerRef.current?.contains(e.target) &&
        !contentRef.current?.contains(e.target)
      ) {
        hide();
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [trigger, actualOpen, hide]);

  const { bgColor, txtColor, borColor } = computeColorStyles({
    border,
    fallback: colorType
  });
  const finalBgColor = background ? resolveColor(background, theme) : bgColor;
  const finalTxtColor = color ? resolveColor(color, theme) : txtColor;
  const finalBorColor = borderColor
    ? resolveColor(borderColor, theme)
    : borColor;
  const finalBorStyle =
    border && finalBorColor
      ? `${borderWeight}px ${borderType} ${finalBorColor}`
      : "none";

  const boxShadow = getShadowStyle(shadow, theme);
  const shapeStyle = getShapeStyles(shape);

  const calculatePosition = useCallback(() => {
    if (!triggerRef.current || !contentRef.current) return {};
    const triggerRect = triggerRef.current.getBoundingClientRect();
    const contentRect = contentRef.current.getBoundingClientRect();
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const scrollX = window.scrollX || document.documentElement.scrollLeft;

    const base = {
      position: "fixed",
      zIndex: 10000,
      transition: "opacity 0.2s ease"
    };

    // 세부 placement 파싱
    const [mainPlacement, subPlacement] = placement.split("-");

    // 위치 계산 함수
    const getPos = (main, sub) => {
      switch (main) {
        case "top": {
          let left = triggerRect.left + triggerRect.width / 2 + scrollX;
          let transform = "translateX(-50%)";
          if (sub === "left") {
            left = triggerRect.left + scrollX;
            transform = "none";
          } else if (sub === "right") {
            left = triggerRect.right + scrollX - contentRect.width;
            transform = "none";
          }
          return {
            top:
              triggerRect.top -
              contentRect.height -
              ARROW_SIZE -
              TRIGGER_GAP +
              scrollY,
            left,
            transform
          };
        }
        case "bottom": {
          let left = triggerRect.left + triggerRect.width / 2 + scrollX;
          let transform = "translateX(-50%)";
          if (sub === "left") {
            left = triggerRect.left + scrollX;
            transform = "none";
          } else if (sub === "right") {
            left = triggerRect.right + scrollX - contentRect.width;
            transform = "none";
          }
          return {
            top: triggerRect.bottom + ARROW_SIZE + TRIGGER_GAP + scrollY,
            left,
            transform
          };
        }
        case "left": {
          let top = triggerRect.top + triggerRect.height / 2 + scrollY;
          let transform = "translateY(-50%)";
          if (sub === "top") {
            top = triggerRect.top + scrollY;
            transform = "none";
          } else if (sub === "bottom") {
            top = triggerRect.bottom + scrollY - contentRect.height;
            transform = "none";
          }
          return {
            top,
            left:
              triggerRect.left -
              contentRect.width -
              ARROW_SIZE -
              TRIGGER_GAP +
              scrollX,
            transform
          };
        }
        case "right": {
          let top = triggerRect.top + triggerRect.height / 2 + scrollY;
          let transform = "translateY(-50%)";
          if (sub === "top") {
            top = triggerRect.top + scrollY;
            transform = "none";
          } else if (sub === "bottom") {
            top = triggerRect.bottom + scrollY - contentRect.height;
            transform = "none";
          }
          return {
            top,
            left: triggerRect.right + ARROW_SIZE + TRIGGER_GAP + scrollX,
            transform
          };
        }
        default:
          return {};
      }
    };

    // 실제 위치 계산
    let pos = getPos(mainPlacement, subPlacement);

    // 화면 벗어남 보정
    const winW = window.innerWidth;
    const winH = window.innerHeight;
    let popupLeft = pos.left ?? 0;
    let popupTop = pos.top ?? 0;
    let width = contentRect.width;
    let height = contentRect.height;
    let adjusted = false;

    // 좌우 화면 벗어남 보정
    if (popupLeft < 0) {
      popupLeft = 8; // 좌측 최소 여백
      adjusted = true;
    } else if (popupLeft + width > winW) {
      popupLeft = winW - width - 8; // 우측 최소 여백
      adjusted = true;
    }
    // 상하 화면 벗어남 보정
    if (popupTop < 0) {
      popupTop = 8;
      adjusted = true;
    } else if (popupTop + height > winH) {
      popupTop = winH - height - 8;
      adjusted = true;
    }

    // transform은 중앙정렬이 필요할 때만 적용
    if (adjusted) {
      pos.transform = undefined;
    }

    return { ...base, ...pos, left: popupLeft, top: popupTop };
  }, [placement]);

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
  }, [actualOpen, isPositioned, calculatePosition]);
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

  const getDiamondStyle = useCallback(
    ({ type = "background" }) => {
      const isBorder = type === "border";
      const hasVisibleBorder = finalBorColor && borderWeight > 0;
      const size = ARROW_SIZE * 2 + (hasVisibleBorder ? borderWeight * 2 : 0);
      const pythagoras = Math.sqrt(borderWeight * borderWeight * 2);
      const offset = !isBorder && hasVisibleBorder ? pythagoras : 0;

      const gradientMap = {
        bottom: `linear-gradient(135deg, ${finalBgColor} 50%, transparent 50%)`,
        top: `linear-gradient(-45deg, ${finalBgColor} 50%, transparent 50%)`,
        left: `linear-gradient(225deg, ${finalBgColor} 50%, transparent 50%)`,
        right: `linear-gradient(45deg, ${finalBgColor} 50%, transparent 50%)`
      };

      const base = {
        width: `${size}px`,
        height: `${size}px`,
        position: "fixed",
        transform: "rotate(45deg)",
        zIndex: isBorder ? 1 : 3,
        border: isBorder ? finalBorStyle : undefined,
        borderRadius: "2px 0 0 0",
        background: !isBorder ? gradientMap[placement] : undefined,
        backgroundColor: isBorder ? finalBorColor ?? finalBgColor : undefined,
        boxShadow: isBorder ? boxShadow : undefined
      };

      const pos = {
        bottom: {
          top: `-${ARROW_SIZE - offset}px`,
          left: "50%",
          transform: "translateX(-50%) rotate(45deg)"
        },
        top: {
          bottom: `-${ARROW_SIZE - offset}px`,
          left: "50%",
          transform: "translateX(-50%) rotate(45deg)"
        },
        right: {
          left: `-${ARROW_SIZE - offset}px`,
          top: "50%",
          transform: "translateY(-50%) rotate(45deg)"
        },
        left: {
          right: `-${ARROW_SIZE - offset}px`,
          top: "50%",
          transform: "translateY(-50%) rotate(45deg)"
        }
      };

      return { ...base, ...pos[placement] };
    },
    [
      placement,
      finalBgColor,
      finalBorColor,
      finalBorStyle,
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
  }, [trigger, actualOpen, show, hide]);

  // 등록: 전역 popup 그룹에 자신을 추가 (형제 관리를 위한 새로운 방식)
  useEffect(() => {
    if (trigger === "hover") {
      // WeakSet/WeakMap에 등록
      globalActivePopupRefs.add(contentRef);

      if (parentRef) {
        // 부모-자식 관계 등록
        popupParentMap.set(contentRef, parentRef);

        // 그룹에 등록
        const siblings = popupGroup.get(parentRef) || new Set();
        siblings.add(popupId.current);
        popupGroup.set(parentRef, siblings);
      }
    }

    // 팝업 인스턴스에 정보 저장
    if (contentRef.current) {
      contentRef.current.popupInstance = {
        show,
        hide,
        toggle,
        id: popupId.current,
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
            siblings.delete(popupId.current);
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
  }, [trigger, parentRef, show, hide, toggle]);

  return (
    <div
      className={mergeClassNames(`sud-${variant}`, className)}
      style={{ position: "relative", display: "inline-block", ...style }}
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
                position: "relative"
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
                <div className="sud-popconfirm__footer flex flex-row gap-8 item-cen jus-cen">
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
