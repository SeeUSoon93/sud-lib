"use client";
import "../../index.css";
import React, { useEffect, useRef } from "react";
import { Typography } from "./Typography";
import {
  applyPulseEffect,
  injectStyleOnce,
  getSpinnerClass
} from "../../utils/styleUtils";
import { useTheme } from "../../theme/ThemeContext";
import {
  computeColorStyles,
  resolveColor,
  getShapeStyles,
  getShadowStyle,
  mergeClassNames
} from "../../theme/themeUtils";

const styles = `
.loading-spinner {
  border: 2px solid #f3f3f3;
  border-radius: 50%;
  display: inline-block;
  animation: spin 1s linear  infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.elastic-spin {
  border: 2px solid #f3f3f3;
  border-radius: 50%;
  display: inline-block;
  animation: elasticSpin 1s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite;
}

@keyframes elasticSpin {
  0% {
    transform: rotate(0deg) scale(1);
  }
  50% {
    transform: rotate(180deg) scale(1.1);
  }
  100% {
    transform: rotate(360deg) scale(1);
  }
}

.brush-spin {
  border: 2px solid #f3f3f3;
  border-radius: 50%;
  display: inline-block;
  animation: brushSpin 1.5s linear infinite;
}

@keyframes brushSpin {
  0% { transform: rotate(0deg); }
  25% { transform: rotate(90deg); }
  50% { transform: rotate(180deg); }
  75% { transform: rotate(180deg); }
  80% { transform: rotate(270deg); }
  100% { transform: rotate(360deg); }
}
`;

export const Button = ({
  children,
  colorType = "default",
  background,
  color,
  border = true,
  borderColor,
  borderType = "solid",
  borderWeight = 1,
  onClick = null,
  className = "",
  icon = null,
  iconPosition = icon ? "left" : "",
  disabled = false,
  loading = false,
  loadingText = "",
  loadingType = "default",
  loadingPosition = "right",
  shape = "rounded",
  shadow = "sm",
  style = {},
  ariaLabel,
  ariaPressed,
  ariaExpanded,
  ariaControls,
  role = "button",
  size
}) => {
  const theme = useTheme();
  const ref = useRef();

  const { bgColor, txtColor, borColor } = computeColorStyles({
    border,
    fallback: disabled ? "disabled" : colorType
  });
  const finalBgColor = background ? resolveColor(background, theme) : bgColor;

  const finalTxtColor = color ? resolveColor(color, theme) : txtColor;

  const finalBorColor = borderColor
    ? resolveColor(borderColor, theme)
    : borColor;
  const finalBorStyle =
    border && finalBorColor
      ? `${borderWeight}px ${borderType} ${finalBorColor}`
      : "none";

  const shapeStyle = getShapeStyles(shape, theme);
  const boxShadow = getShadowStyle(shadow, theme);

  // size별 스타일 분기
  let sizeStyle = {};
  if (typeof size === "string") {
    if (size === "sm")
      sizeStyle = { padding: "4px 10px", fontSize: "0.875rem" };
    else if (size === "md")
      sizeStyle = { padding: "6px 16px", fontSize: "1rem" };
    else if (size === "lg")
      sizeStyle = { padding: "10px 20px", fontSize: "1.125rem" };
  }

  useEffect(() => {
    injectStyleOnce("sud-button-styles", styles);
  }, []);

  const handleClick = (e) => {
    if (disabled || loading) return;
    applyPulseEffect(e.currentTarget);
    if (onClick) onClick(e);
  };

  const contents =
    typeof children === "string" ? (
      <Typography className="sud-button__label">{children}</Typography>
    ) : (
      children
    );

  return (
    <button
      className={mergeClassNames(
        "sud-button",
        disabled || loading ? "" : "sud-hover",
        className,
        `cursor-${disabled ? "not-allowed" : "pointer"}`
      )}
      ref={ref}
      style={{
        display: "inline-flex",
        flexDirection: "row",
        justifyContent: "center",
        gap: 8,
        alignItems: "center",
        background: finalBgColor,
        color: finalTxtColor,
        border: finalBorStyle,
        boxShadow: colorType === "text" ? "none" : boxShadow,
        ...shapeStyle,
        ...sizeStyle,
        ...style
      }}
      onClick={!disabled ? handleClick : undefined}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-pressed={ariaPressed}
      aria-expanded={ariaExpanded}
      aria-controls={ariaControls}
      role={role}
      aria-disabled={disabled || loading}
    >
      {loading ? (
        <>
          {loadingPosition === "left" && (
            <div
              className={mergeClassNames(
                "sud-button__spinner",
                getSpinnerClass(loadingType)
              )}
              style={{
                borderColor: finalTxtColor,
                width: "16px",
                height: "16px",
                borderTopColor: finalBgColor
              }}
            />
          )}
          <div className="sud-button__label">{loadingText || contents}</div>
          {loadingPosition === "right" && (
            <div
              className={mergeClassNames(
                "sud-button__spinner",
                getSpinnerClass(loadingType)
              )}
              style={{
                borderColor: finalTxtColor,
                width: "16px",
                height: "16px",
                borderTopColor: finalBgColor
              }}
            />
          )}
        </>
      ) : (
        <>
          {icon && iconPosition === "left" && (
            <span
              className="sud-button__icon sud-button__icon--left"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              {icon}
            </span>
          )}
          {contents && <div className="sud-button__label">{contents}</div>}
          {icon && iconPosition === "right" && (
            <span
              className="sud-button__icon sud-button__icon--right"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              {icon}
            </span>
          )}
        </>
      )}
    </button>
  );
};
