"use client";

import { useState, useCallback } from "react";
import { CheckCircleFill, ErrorCircleFill, XMarkCircleFill } from "sud-icons";
import { Button } from "../general/Button";
import { PopupBase } from "../navigation/base/PopupBase";
import { useTheme } from "../../theme/ThemeContext";
import { Typography } from "../general/Typography";
import { Div } from "../Div/Div";

export const PopConfirm = ({
  children,
  title,
  trigger = "click",
  placement = "top",
  open, // controlled
  defaultOpen = false, // uncontrolled fallback
  onOpenChange,
  closeOnClick = false,
  disabled = false,
  className = "",
  content,
  background,
  divider = false,
  color,
  border = true,
  borderColor,
  borderType,
  borderWeight,
  shape = "rounded",
  shadow,
  colorType,
  type = "primary",
  onCancel,
  onConfirm,
  footer = true,
  style = {},
  ...rest
}) => {
  const theme = useTheme();
  // 내부 open 상태 (uncontrolled용)
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isControlled = open !== undefined;
  const actualOpen = isControlled ? open : internalOpen;

  const setOpen = useCallback(
    (value) => {
      if (!isControlled) {
        setInternalOpen(value);
      }
      onOpenChange?.(value);
    },
    [isControlled, onOpenChange]
  );

  const icons = () => {
    if (type === "success")
      return (
        <Div color="blue">
          <CheckCircleFill />
        </Div>
      );
    if (type === "danger")
      return (
        <Div color="red">
          <XMarkCircleFill />
        </Div>
      );
    if (type === "warning")
      return (
        <Div color="amber">
          <ErrorCircleFill />
        </Div>
      );
    return null;
  };

  const titleWithIcon = () => {
    if (!title) return null;

    return (
      <div
        className="sud-popconfirm__title"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          gap: "5px",
          fontSize: "16px"
        }}
      >
        {icons()}
        {typeof title === "string" ? (
          <Typography
            as="span"
            pretendard="B"
            className="sud-popconfirm__title-text"
            color={color}
            style={{ whiteSpace: "nowrap" }}
          >
            {title}
          </Typography>
        ) : (
          title
        )}
      </div>
    );
  };

  return (
    <PopupBase
      trigger={trigger}
      placement={placement}
      open={actualOpen}
      defaultOpen={defaultOpen}
      onOpenChange={setOpen}
      closeOnClick={closeOnClick}
      disabled={disabled}
      className={`sud-popconfirm ${className}`}
      background={background}
      color={color}
      border={border}
      borderColor={borderColor}
      borderType={borderType}
      borderWeight={borderWeight}
      shape={shape}
      shadow={shadow}
      divider={divider}
      title={titleWithIcon()}
      content={content}
      children={children}
      colorType={colorType}
      variant="popconfirm"
      footer={footer}
      onCancel={onCancel}
      onConfirm={onConfirm}
      style={{
        ...style
      }}
      role="alertdialog"
      aria-labelledby="popconfirm-title"
      aria-describedby="popconfirm-content"
      aria-modal="true"
      {...rest}
    />
  );
};
