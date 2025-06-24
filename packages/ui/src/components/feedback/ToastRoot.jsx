"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Card } from "../dataDisplay/Card";
import { CheckCircleFill, ErrorCircleFill, XMarkCircleFill } from "sud-icons";
import { computeColorStyles } from "../../theme/themeUtils";
import { useTheme } from "../../theme";
import React from "react";

// 아이콘 색상: bgColor 기준
const getIcon = (type, color) => {
  switch (type) {
    case "success":
      return <CheckCircleFill size={18} color={color} />;
    case "danger":
      return <XMarkCircleFill size={18} color={color} />;
    case "info":
      return (
        <div style={{ transform: "rotate(180deg)" }}>
          <ErrorCircleFill size={18} color={color} />
        </div>
      );
    case "warning":
      return <ErrorCircleFill size={18} color={color} />;
    default:
      return null;
  }
};

// 전역 등록용
let addToastHandler = null;

export const toast = {
  success: (message, options = {}) =>
    addToastHandler?.({ type: "success", message, ...options }),
  danger: (message, options = {}) =>
    addToastHandler?.({ type: "danger", message, ...options }),
  info: (message, options = {}) =>
    addToastHandler?.({ type: "info", message, ...options }),
  warning: (message, options = {}) =>
    addToastHandler?.({ type: "warning", message, ...options })
};

export const ToastRoot = ({}) => {
  const [toasts, setToasts] = useState([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    addToastHandler = ({ type = "info", message, duration = 3000, icon }) => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, type, message, duration, icon }]);
    };
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };
  useEffect(() => {
    setMounted(true); // ✅ 클라이언트에서만 createPortal 실행되게 함
  }, []);

  if (!mounted) return null;
  return createPortal(
    <div
      className="sud-toast__container"
      style={{
        position: "fixed",
        top: 24,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 10000,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        pointerEvents: "none"
      }}
    >
      {toasts.map(({ id, type, message, duration, icon }) => (
        <ToastItem
          key={id}
          id={id}
          type={type}
          message={message}
          duration={duration}
          onClose={removeToast}
          icon={icon}
        />
      ))}
    </div>,
    document.body
  );
};

const ToastItem = ({ id, type, message, duration, onClose, icon }) => {
  const [visible, setVisible] = useState(false);

  const theme = useTheme();
  useEffect(() => {
    const show = setTimeout(() => setVisible(true), 10);
    const hide = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onClose?.(id), 300);
    }, duration);

    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, [id, duration, onClose]);

  const { bgColor } = computeColorStyles({
    border: false,
    fallback: type,
    componentType: "toast"
  });

  const spacing = theme.spacing;

  const renderIcon = () => {
    if (icon) {
      return React.cloneElement(icon, { size: 18 });
    }
    return getIcon(type, bgColor);
  };

  return (
    <Card
      variant="toast"
      shape="rounded"
      shadow="lg"
      colorType="default"
      border={false}
      role="alert"
      aria-live="polite"
      aria-atomic="true"
      style={{
        padding: spacing.md,
        display: "flex",
        alignItems: "center",
        animation: undefined,
        pointerEvents: "auto",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(-12px)",
        transition: "opacity 0.3s ease, transform 0.3s ease",
        flexDirection: "row",
        justifyContent: "center",
        gap: 8
      }}
    >
      {renderIcon()}
      <div>{message}</div>
    </Card>
  );
};
