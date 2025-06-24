// Notification.jsx
"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Card } from "../dataDisplay/Card";
import { Close } from "sud-icons";
import { Button } from "../general/Button";
import { Typography } from "../general/Typography";

const POSITIONS = [
  "top-left",
  "top-center",
  "top-right",
  "bottom-left",
  "bottom-center",
  "bottom-right"
];

// 🔥 전역 핸들러
let pushNotification = () => {};

export const notification = {
  open: ({
    title,
    message,
    footer,
    duration = 3000,
    position = "top-right",
    onClose,
    colorType,
    color,
    background,
    borderType,
    borderColor,
    borderWeight,
    border,
    shape,
    shadow,
    width
  }) => {
    if (!POSITIONS.includes(position)) position = "top-right";
    pushNotification({
      title,
      message,
      footer,
      duration,
      position,
      onClose,
      colorType,
      color,
      background,
      borderType,
      borderColor,
      borderWeight,
      border,
      shape,
      shadow,
      width
    });
  }
};

export const NotificationRoot = ({}) => {
  const [mounted, setMounted] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    setMounted(true);
    pushNotification = ({
      title,
      message,
      footer,
      duration,
      position,
      onClose,
      colorType,
      color,
      background,
      borderType,
      borderColor,
      borderWeight,
      border,
      shape,
      shadow,
      width
    }) => {
      const id = Date.now() + Math.random();
      setNotifications((prev) => [
        ...prev,
        {
          id,
          title,
          message,
          footer,
          duration,
          position,
          onClose,
          colorType,
          color,
          background,
          borderType,
          borderColor,
          borderWeight,
          border,
          shape,
          shadow,
          width
        }
      ]);
    };
  }, []);

  const remove = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  if (!mounted) return null;

  return createPortal(
    <div>
      {POSITIONS.map((pos) => {
        const items = notifications.filter((n) => n.position === pos);
        if (!items.length) return null;

        const [vertical, align] = pos.split("-");

        const containerStyle = {
          position: "fixed",
          zIndex: 10000,
          display: "flex",
          flexDirection: "column",
          gap: 8,
          pointerEvents: "none",
          ...(vertical === "top" ? { top: 24 } : { bottom: 24 }),
          ...(align === "left"
            ? { left: 24, alignItems: "flex-start" }
            : align === "right"
            ? { right: 24, alignItems: "flex-end" }
            : {
                left: "50%",
                transform: "translateX(-50%)",
                alignItems: "center"
              })
        };

        return (
          <div key={pos} style={containerStyle}>
            {items.map((n) => (
              <NotificationItem
                key={n.id}
                {...n}
                onClose={() => remove(n.id)}
              />
            ))}
          </div>
        );
      })}
    </div>,
    document.body
  );
};

const NotificationItem = ({
  id,
  title,
  message,
  footer,
  duration,
  onClose,
  colorType = "default",
  color,
  background,
  borderType = "solid",
  borderColor,
  border = false,
  borderWeight = 1,
  shape = "rounded",
  shadow = "md",
  width = 320
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const show = setTimeout(() => setVisible(true), 10);
    let hide;
    if (duration !== false) {
      hide = setTimeout(() => {
        setVisible(false);
        setTimeout(() => onClose?.(id), 300);
      }, duration);
    }

    return () => {
      clearTimeout(show);
      if (hide) clearTimeout(hide);
    };
  }, [id, duration, onClose]);

  return (
    <Card
      className="sud-notification"
      variant="notification"
      shape={shape}
      shadow={shadow}
      colorType={colorType}
      color={color}
      background={background}
      borderType={borderType}
      borderColor={borderColor}
      borderWeight={borderWeight}
      border={border}
      width={width}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(-12px)",
        transition: "opacity 0.3s ease, transform 0.3s ease",
        pointerEvents: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 8
      }}
    >
      {/* Title + Close */}
      {title && (
        <div
          className="sud-notification__header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <Typography
            className="sud-notification__title"
            as="h3"
            pretendard="SB"
            size="lg"
          >
            {title}
          </Typography>
          <Button
            className="sud-notification__close"
            colorType="text"
            size="sm"
            icon={<Close size={14} />}
            onClick={onClose}
          />
        </div>
      )}

      {/* Message */}
      {message && (
        <Typography className="sud-notification__message" as="p" size="base">
          {message}
        </Typography>
      )}
      {/* Footer */}
      {footer && (
        <div
          className="sud-notification__footer"
          style={{ display: "flex", justifyContent: "flex-end" }}
        >
          {footer}
        </div>
      )}
    </Card>
  );
};
