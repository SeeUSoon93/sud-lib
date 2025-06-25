"use client";

import { PopupBase } from "../navigation/base/PopupBase";
import { useTheme } from "../../theme/ThemeContext";

export const Tooltip = ({
  children, // Tooltip의 트리거 역할
  content, // Tooltip의 내용
  trigger = "hover", // "click" | "hover" | "contextMenu"
  placement = "top", // "top" | "bottom" | "left" | "right"
  open: controlledOpen, // Tooltip의 열림 상태 (제어용)
  defaultOpen = false, // Tooltip의 기본 열림 상태
  onOpenChange, // Tooltip의 열림 상태 변경 콜백
  closeOnClick = true, // Tooltip 클릭 시 닫기 여부
  disabled = false, // Tooltip 비활성화 여부
  className, // Tooltip의 클래스 이름
  // 스타일 관련 props
  background,
  color,
  border,
  borderColor,
  borderType,
  borderWeight,
  shape,
  shadow,
  colorType = "sub",
  style = {},
  ...rest
}) => {
  const theme = useTheme();

  return (
    <PopupBase
      trigger={trigger}
      placement={placement}
      open={controlledOpen}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      closeOnClick={closeOnClick}
      disabled={disabled}
      className={`tooltip ${className}`}
      background={background}
      color={color}
      borderColor={borderColor}
      borderType={borderType}
      borderWeight={borderWeight}
      shape={shape}
      shadow={shadow}
      content={content}
      children={children}
      border={border}
      colorType={colorType}
      variant="tooltip"
      role="tooltip"
      aria-describedby={content ? `tooltip-${content}` : undefined}
      style={{
        ...style
      }}
      {...rest}
    />
  );
};
