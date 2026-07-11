"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Card } from "./Card";
import { useDialogFocus } from "../../utils/useDialogFocus";

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
  border,
  borderColor,
  borderType = "solid",
  borderWeight = 1,
  shape = "rounded",
  shadow,
  surface = "overlay",
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
  const [mounted, setMounted] = useState(false);
  const dialogRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useDialogFocus({
    open: open && mounted,
    containerRef: dialogRef,
    onClose,
    closeOnEscape: onEsc
  });

  if (!open || !mounted) return null;

  return createPortal(
    <div
      className="sud-modal__overlay"
      onClick={onClose}
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
      <div
        {...rest}
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={
          ariaLabel || (typeof title === "string" ? title : undefined)
        }
        aria-describedby={ariaDescribedby}
        tabIndex={rest.tabIndex ?? -1}
        onClick={(e) => e.stopPropagation()}
      >
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
          surface={surface}
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
