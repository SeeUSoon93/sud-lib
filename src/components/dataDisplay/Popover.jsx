"use client";

import { PopupBase } from "../navigation/base/PopupBase";

export const Popover = ({
  children,
  title,
  trigger = "hover",
  placement = "bottom",
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  closeOnClick = true,
  disabled = false,
  className = "",
  content,
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
  // --- PopupBase의 모든 속성을 받도록 아래 추가 ---
  arrow,
  footer,
  followTrigger,
  contentRef,
  parentRef,
  onCancel,
  onConfirm,
  // -----------------------------------------
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
      // --- 전달받은 속성들 추가 ---
      arrow={arrow}
      footer={footer}
      followTrigger={followTrigger}
      contentRef={contentRef}
      parentRef={parentRef}
      onCancel={onCancel}
      onConfirm={onConfirm}
      // --------------------------
      style={{
        ...style
      }}
      {...rest}
    />
  );
};
