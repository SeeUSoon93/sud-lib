"use client";
import "../../index.css";
import { useMemo, useRef, useState, useEffect } from "react";
import { Card } from "./Card";
import { Close } from "sud-icons";
import { useTheme } from "../../theme/ThemeContext";
import { getShapeStyles } from "../../theme/themeUtils";
import { Typography } from "../general/Typography";
import { Button } from "../general/Button";
import { createPortal } from "react-dom";

export const Drawer = ({
  open = false,
  onClose,
  title,
  children,
  footer,
  colorType = "default",
  divider = true,
  dividerColor,
  background,
  color,
  border = true,
  borderColor,
  borderType = "solid",
  borderWeight = 1,
  shape = "rounded",
  shadow = "sm",
  width = 300,
  height = 300,
  className = "",
  placement = "right", // "left" | "right" | "top" | "bottom"
  style = {},
  ariaLabel,
  ariaDescribedby,
  ...rest
}) => {
  const theme = useTheme();

  const shapeStyle = getShapeStyles(shape, theme);
  const zIndex = 9999;
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const drawerRef = useRef();

  useEffect(() => {
    if (open) {
      setMounted(true);
      // requestAnimationFrame을 사용하여 다음 프레임에서 visible을 true로 설정
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setVisible(true);
        });
      });
    } else {
      setVisible(false);
      // 애니메이션이 완료된 후에 mounted를 false로 설정
      const timer = setTimeout(() => {
        setMounted(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [open]);

  // 위치에 따른 위치, border-radius 조정
  const positionStyle = useMemo(() => {
    const base = {
      position: "fixed",
      zIndex,
      transition:
        "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      pointerEvents: visible ? "auto" : "none",
      opacity: visible ? 1 : 0,
      visibility: mounted ? "visible" : "hidden",
      willChange: "transform, opacity"
    };

    const radius = shapeStyle.borderRadius;

    switch (placement) {
      case "left":
        return {
          ...base,
          top: 0,
          left: 0,
          height: "100vh",
          width: width,
          transform: visible ? "translateX(0)" : "translateX(-100%)",
          borderTopRightRadius: radius,
          borderBottomRightRadius: radius,
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0
        };
      case "right":
        return {
          ...base,
          top: 0,
          right: 0,
          height: "100vh",
          width: width,
          transform: visible ? "translateX(0)" : "translateX(100%)",
          borderTopLeftRadius: radius,
          borderBottomLeftRadius: radius,
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0
        };
      case "top":
        return {
          ...base,
          top: 0,
          left: 0,
          width: "100vw",
          height: height,
          transform: visible ? "translateY(0)" : "translateY(-100%)",
          borderBottomLeftRadius: radius,
          borderBottomRightRadius: radius,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0
        };
      case "bottom":
        return {
          ...base,
          bottom: 0,
          left: 0,
          width: "100vw",
          height: height,
          transform: visible ? "translateY(0)" : "translateY(100%)",
          borderTopLeftRadius: radius,
          borderTopRightRadius: radius,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0
        };
      default:
        return {};
    }
  }, [placement, shapeStyle.borderRadius, width, height, visible, mounted]);

  const finalTitle =
    title &&
    (typeof title === "string" ? (
      <div
        className="sud-drawer__title"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <Typography as="h2" size="lg" pretendard="SB" color={color}>
          {title}
        </Typography>
        <Button
          className="sud-drawer__close"
          colorType="text"
          icon={<Close size={14} />}
          onClick={onClose}
        />
      </div>
    ) : (
      <div
        className="sud-drawer__title"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        {title}
        <Button
          className="sud-drawer__close"
          colorType="text"
          icon={<Close />}
          onClick={onClose}
        />
      </div>
    ));

  return mounted
    ? createPortal(
        <>
          <div
            className="sud-drawer__overlay"
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.5)",
              zIndex: zIndex,
              opacity: visible ? 1 : 0,
              transition: "opacity 0.3s ease"
            }}
            aria-hidden="true"
          />
          <Card
            ref={drawerRef}
            title={finalTitle}
            children={children}
            divider={divider}
            dividerColor={dividerColor}
            footer={footer}
            shape="square"
            colorType={colorType}
            background={background}
            color={color}
            border={border}
            borderColor={borderColor}
            borderType={borderType}
            borderWeight={borderWeight}
            shadow={shadow}
            width={width}
            height={height}
            className={className}
            placement={placement}
            isDrawer={true}
            variant="drawer"
            role="dialog"
            aria-modal="true"
            aria-label={ariaLabel || title}
            aria-describedby={ariaDescribedby}
            style={{
              ...positionStyle,
              ...style,
              zIndex: zIndex + 1
            }}
            {...rest}
          />
        </>,
        document.body
      )
    : null;
};
