"use client";

import { PopupBase } from "../navigation/base/PopupBase";

export const Tooltip = ({
  children,
  content,
  trigger = "hover",
  placement = "top",
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  closeOnClick = true,
  disabled = false,
  className,
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
  // --- PopupBase의 호환 속성 추가 ---
  arrow,
  followTrigger,
  contentRef,
  parentRef,
  // --------------------------------
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
      className={`sud-tooltip ${className}`}
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
      // --- 전달받은 속성들 추가 ---
      arrow={arrow}
      followTrigger={followTrigger}
      contentRef={contentRef}
      parentRef={parentRef}
      // --------------------------
      style={{
        ...style
      }}
      {...rest}
    />
  );
};
