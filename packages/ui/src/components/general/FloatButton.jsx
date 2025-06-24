"use client";

import { useState } from "react";
import { Button } from "../general/Button";
import { mergeClassNames } from "../../theme/themeUtils";

const POSITION_MAP = {
  "bottom-right": { bottom: 24, right: 24, direction: "up" },
  "bottom-left": { bottom: 24, left: 24, direction: "up" },
  "bottom-center": {
    bottom: 24,
    left: "50%",
    transform: "translateX(-50%)",
    direction: "up"
  },
  "top-right": { top: 24, right: 24, direction: "down" },
  "top-left": { top: 24, left: 24, direction: "down" },
  "top-center": {
    top: 24,
    left: "50%",
    transform: "translateX(-50%)",
    direction: "down"
  },
  "left-center": {
    left: 24,
    top: "50%",
    transform: "translateY(-50%)",
    direction: "right"
  },
  "right-center": {
    right: 24,
    top: "50%",
    transform: "translateY(-50%)",
    direction: "left"
  }
};

export const FloatButton = ({
  icon,
  onClick,
  actions = [],
  placement = "bottom-right",
  shape = "circle",
  colorType = "primary",
  background,
  color,
  border = false,
  borderColor,
  borderType = "solid",
  borderWeight = 1,
  disabled = false,
  shadow = "md",
  style = {},
  ariaLabel,
  ariaPressed,
  ariaExpanded,
  ariaControls,
  role = "button",
  subColorType = "default",
  size = "md",
  isExample = false,
  direction,
  className
}) => {
  const [open, setOpen] = useState(false);
  const hasActions = actions.length > 0;

  const anchorStyle = POSITION_MAP[placement] || POSITION_MAP["bottom-right"];
  const finalDirection = direction || anchorStyle.direction;

  const sizeMap = {
    xs: 32,
    sm: 40,
    md: 48,
    lg: 56,
    xl: 64
  };

  const buttonSize = sizeMap[size];

  return (
    <div
      className="sud-float-button__container"
      style={{
        position: isExample ? "absolute" : "fixed",
        zIndex: 1000,
        ...anchorStyle
      }}
    >
      {/* 확장 버튼들 */}
      {hasActions &&
        actions.map((action, idx) => {
          const offset = (idx + 1) * (buttonSize * 1.2);
          const delay = `${idx * 40}ms`;

          let transform;
          switch (finalDirection) {
            case "up":
              transform = `translateY(-${offset}px)`;
              break;
            case "down":
              transform = `translateY(${offset}px)`;
              break;
            case "left":
              transform = `translateX(-${offset}px)`;
              break;
            case "right":
              transform = `translateX(${offset}px)`;
              break;
            default:
              transform = "none";
          }

          return (
            <div
              key={idx}
              className="sud-float-button__action-container"
              style={{
                position: "absolute",
                transition: "all 0.3s ease",
                transitionDelay: delay,
                opacity: open ? 1 : 0,
                transform: open
                  ? `${transform} scale(1)`
                  : `translate(0, 0) scale(0.9)`,
                pointerEvents: open ? "auto" : "none"
              }}
            >
              <Button
                className="sud-float-button__action"
                {...action}
                shape={shape}
                colorType={action.colorType || subColorType}
                background={action.background}
                color={action.color}
                borderColor={action.borderColor}
                borderType={action.borderType}
                borderWeight={action.borderWeight}
                disabled={action.disabled}
                shadow={action.shadow || shadow}
                style={{
                  width: buttonSize,
                  height: buttonSize,
                  ...action.style
                }}
                ariaLabel={action.ariaLabel}
                ariaPressed={action.ariaPressed}
                ariaExpanded={action.ariaExpanded}
                ariaControls={action.ariaControls}
                role={action.role || role}
              />
            </div>
          );
        })}

      {/* 메인 버튼 */}
      <Button
        className={mergeClassNames("sud-float-button", className)}
        icon={icon}
        onClick={hasActions ? () => setOpen(!open) : onClick}
        shape={shape}
        colorType={colorType}
        background={background}
        color={color}
        border={border}
        borderColor={borderColor}
        borderType={borderType}
        borderWeight={borderWeight}
        ariaLabel={ariaLabel}
        ariaPressed={ariaPressed}
        ariaExpanded={ariaExpanded}
        ariaControls={ariaControls}
        role={role}
        disabled={disabled}
        shadow={shadow}
        style={{ width: buttonSize, height: buttonSize, ...style }}
      />
    </div>
  );
};
