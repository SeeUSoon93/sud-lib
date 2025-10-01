"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { Card } from "./Card";
import { useTheme } from "../../theme/ThemeContext";

export const Modal = ({
  open = false,
  onClose,
  onEsc = true,
  title,
  children,
  footer,
  colorType = "default",
  background,
  color,
  border = true,
  borderColor,
  borderType = "solid",
  borderWeight = 1,
  shape = "rounded",
  shadow = "lg",
  width = 480,
  height,
  className = "",
  divider = false,
  dividerColor,
  style = {},
  ariaLabel,
  ariaDescribedby,
  thumb,
  ...rest
}) => {
  const theme = useTheme();

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && onEsc && open) {
        onClose?.();
      }
    };
    if (open) {
      document.addEventListener("keydown", handleEsc);
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [onEsc, open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="sud-modal__overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel || title}
      aria-describedby={ariaDescribedby}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.5)",
        zIndex: 9999,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        opacity: open ? 1 : 0,
        transition: "opacity 0.3s ease",
      }}
    >
      <div onClick={(e) => e.stopPropagation()} {...rest}>
        <Card
          title={title}
          footer={footer}
          colorType={colorType}
          background={background}
          color={color}
          border={border}
          borderColor={borderColor}
          borderType={borderType}
          borderWeight={borderWeight}
          shadow={shadow}
          shape={shape}
          width={width}
          height={height}
          className={className}
          divider={divider}
          dividerColor={dividerColor}
          variant="modal"
          style={style}
          onClose={onClose}
          thumb={thumb}
        >
          {children}
        </Card>
      </div>
    </div>,
    document.body
  );
};
