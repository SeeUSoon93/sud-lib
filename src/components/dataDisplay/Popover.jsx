"use client";

import { PopupBase } from "../navigation/base/PopupBase";

export const Popover = ({
  children, // Popover 트리거 역할
  title, // Popover 제목
  trigger = "hover", // "click" | "hover" | "contextMenu"
  placement = "bottom", // "top" | "bottom" | "left" | "right"
  open: controlledOpen, // Popover 열림 상태 (제어용)
  defaultOpen = false, // Popover 기본 열림 상태
  onOpenChange, // Popover 열림 상태 변경 콜백
  closeOnClick = true, // Tooltip 클릭 시 닫기 여부
  disabled = false, // Tooltip 비활성화 여부
  className = "", // Popover 클래스 이름
  content,
  // 스타일 관련 props
  divider = false,
  background,
  color,
  border = true,
  borderColor,
  borderType,
  borderWeight,
  shape = "rounded",
  shadow,
  colorType,
  style = {},
  ...rest
}) => {
  return (
    <PopupBase
      trigger={trigger}
      placement={placement}
      open={controlledOpen}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      closeOnClick={closeOnClick}
      disabled={disabled}
      className={`sud-popover ${className}`}
      background={background}
      color={color}
      borderColor={borderColor}
      borderType={borderType}
      borderWeight={borderWeight}
      shape={shape}
      shadow={shadow}
      divider={divider}
      title={title}
      content={content}
      children={children}
      border={border}
      colorType={colorType}
      variant="popover"
      role="dialog"
      aria-labelledby={title ? `popover-title-${title}` : undefined}
      aria-describedby={content ? `popover-content-${content}` : undefined}
      style={{
        ...style
      }}
      {...rest}
    />
  );
};
