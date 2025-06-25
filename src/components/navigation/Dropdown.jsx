"use client";

import { PopupBase } from "./base/PopupBase";
import { Menu } from "./Menu";
import { mergeClassNames, resolveColor } from "../../theme/themeUtils";
import { useTheme } from "../../theme/ThemeContext";
import { useRef } from "react";

export const Dropdown = ({
  children, // Dropdown 트리거 역할
  title, // Dropdown 제목
  trigger = "hover", // "click" | "hover" | "contextMenu"
  open: controlledOpen, // Dropdown 열림 상태 (제어용)
  defaultOpen = false, // Dropdown 기본 열림 상태
  onOpenChange, // Dropdown 열림 상태 변경 콜백
  closeOnClick = false, // Dropdown 클릭 시 닫기 여부
  disabled = false, // Dropdown 비활성화 여부
  className = "", // Dropdown 클래스 이름
  items = [], // Dropdown 메뉴 항목
  // 스타일 관련 props
  background,
  color,
  border,
  borderColor,
  borderType,
  borderWeight,
  shape = "rounded",
  shadow,
  expandType = "popover",
  popupPlacement = "bottom",
  placement = ["right", "right"],
  colorType,
  style = {},
  ...rest
}) => {
  const theme = useTheme();
  const contentRef = useRef(null);

  return (
    <PopupBase
      trigger={trigger}
      placement={popupPlacement}
      open={controlledOpen}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      closeOnClick={closeOnClick}
      disabled={disabled}
      className={mergeClassNames("sud-dropdown", className)}
      background={background}
      color={color}
      borderColor={borderColor}
      borderType={borderType}
      borderWeight={borderWeight}
      shape={shape}
      shadow={shadow}
      variant="dropdown"
      title={title}
      role="menu"
      aria-label={title || "드롭다운 메뉴"}
      aria-haspopup="true"
      aria-expanded={controlledOpen}
      style={{
        ...style,
        padding: "4px"
      }}
      {...rest}
      content={
        <Menu
          items={items}
          expandType={expandType}
          placement={placement}
          colorType={colorType}
          parentContentRef={contentRef}
          className="sud-dropdown__menu"
        />
      }
      children={children}
      border={border}
      colorType={colorType}
      contentRef={contentRef}
    />
  );
};
