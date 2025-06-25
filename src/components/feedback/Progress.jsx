"use client";

import React from "react";
import { useTheme } from "../../theme/ThemeContext";
import { Typography } from "../general/Typography";
import {
  computeColorStyles,
  resolveColor,
  mergeClassNames,
  getFontStyles
} from "../../theme/themeUtils";

export const Progress = ({
  type = "bar",
  value = 0,
  max = 100,
  unit,
  showText = true,
  iconWhenFull,
  iconWhenNotFull,
  colorType = "cerulean",
  backgroundColor,
  color,
  valuePosition = "inside-end",
  size = "md",
  fontSize: fontSizeProp,
  className = "",
  style = {},
  ...rest
}) => {
  const theme = useTheme();
  const percent = Math.min(100, Math.max(0, (value / max) * 100));

  const { borColor: defaultTxtColor, bgColor: gaugeTxtColor } =
    computeColorStyles({
      fallback: colorType,
      componentType: "tag"
    });

  const finalGaugeColor = color ? resolveColor(color, theme) : defaultTxtColor;

  const { bgColor } = computeColorStyles({
    fallback: "hovered",
    componentType: "etc"
  });

  const finalBgColor = backgroundColor
    ? resolveColor(backgroundColor, theme)
    : bgColor;

  const sizeMap = {
    sm: {
      barHeight: 8,
      circleSize: 80,
      strokeWidth: 6,
      fontSize: getFontStyles({ size: "xs", theme }).fontSize,
      unitFontSize: getFontStyles({ size: "xs", theme }).fontSize * 0.7
    },
    md: {
      barHeight: 12,
      circleSize: 120,
      strokeWidth: 8,
      fontSize: getFontStyles({ size: "sm", theme }).fontSize,
      unitFontSize: getFontStyles({ size: "sm", theme }).fontSize * 0.7
    },
    lg: {
      barHeight: 16,
      circleSize: 160,
      strokeWidth: 10,
      fontSize: getFontStyles({ size: "base", theme }).fontSize,
      unitFontSize: getFontStyles({ size: "base", theme }).fontSize * 0.7
    }
  };

  const { barHeight, circleSize, strokeWidth, fontSize } = sizeMap[size];
  const resolvedFontSize =
    typeof fontSizeProp === "number" ? fontSizeProp : fontSize;
  const { unitFontSize } = sizeMap[size];
  if (type === "bar") {
    const isInside = valuePosition.startsWith("inside");
    const contentColor = isInside ? gaugeTxtColor : finalGaugeColor;

    const valueContent =
      value === max ? (
        iconWhenFull &&
        React.cloneElement(iconWhenFull, { color: contentColor })
      ) : iconWhenNotFull ? (
        React.cloneElement(iconWhenNotFull, { color: contentColor })
      ) : (
        <div
          className="sud-progress__text-container"
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "wrap"
          }}
        >
          <Typography
            size={resolvedFontSize}
            color={contentColor}
            pretendard="M"
            className="sud-progress__text"
          >
            {percent.toFixed(0)}
          </Typography>
          <Typography
            size={unitFontSize}
            color={contentColor}
            pretendard="L"
            className="sud-progress__unit"
          >
            {unit ? `${unit}` : ""}
          </Typography>
        </div>
      );

    const justifyMap = {
      "inside-start": "flex-start",
      "inside-center": "center",
      "inside-end": "flex-end",
      "outside-left": "flex-start",
      "outside-right": "flex-end"
    };

    return (
      <div
        className={mergeClassNames("sud-progress sud-progress-bar", className)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          width: "100%",
          ...style
        }}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={`Progress: ${percent.toFixed(0)}${unit ? ` ${unit}` : ""}`}
        {...rest}
      >
        {valuePosition === "outside-left" && showText && valueContent}
        <div
          className="sud-progress__bar"
          style={{
            flex: 1,
            minHeight: barHeight,
            backgroundColor: finalBgColor,
            borderRadius: 9999,
            overflow: "hidden",
            position: "relative"
          }}
        >
          <div
            className="sud-progress__gauge"
            style={{
              width: `${percent}%`,
              backgroundColor: finalGaugeColor,
              minHeight: barHeight,
              transition: "width 0.3s",
              display: "flex",
              alignItems: "center",
              justifyContent: justifyMap[valuePosition],
              color: isInside ? gaugeTxtColor : "transparent",
              fontSize: resolvedFontSize,
              paddingInline: 4,
              boxSizing: "border-box",
              whiteSpace: "nowrap",
              borderRadius: 9999
            }}
          >
            {isInside && showText && valueContent}
          </div>
        </div>
        {valuePosition === "outside-right" && showText && valueContent}
      </div>
    );
  }

  // circle/dashboard
  const center = circleSize / 2;
  const radius = center - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;

  const isDashboard = type === "dashboard";
  const arcLength = isDashboard ? 270 : 360;
  const arcRatio = arcLength / 360;

  const arcLengthPx = arcRatio * circumference;
  const strokeDasharray = isDashboard
    ? `${arcLengthPx} ${circumference}`
    : `${circumference}`;

  const strokeDashoffset = isDashboard
    ? arcLengthPx * (1 - percent / 100)
    : circumference * (1 - percent / 100);

  const rotation = isDashboard ? "rotate(135deg)" : "rotate(-90deg)";

  const centerContent =
    value === max
      ? iconWhenFull &&
        React.cloneElement(iconWhenFull, { color: finalGaugeColor })
      : iconWhenNotFull
      ? React.cloneElement(iconWhenNotFull, { color: finalGaugeColor })
      : showText && (
          <div
            className="sud-progress__text-container"
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Typography
              as="span"
              size={resolvedFontSize}
              color={finalGaugeColor}
              pretendard="M"
              align="center"
            >
              {percent.toFixed(0)}
            </Typography>
            <Typography
              as="span"
              size={unitFontSize}
              color={finalGaugeColor}
              pretendard="L"
              align="center"
            >
              {unit ? `${unit}` : ""}
            </Typography>
          </div>
        );

  return (
    <div
      className={mergeClassNames("sud-progress sud-progress-circle", className)}
      style={{
        width: circleSize,
        height: circleSize,
        position: "relative",
        display: "inline-block",
        ...style
      }}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={`Progress: ${percent.toFixed(0)}${unit ? ` ${unit}` : ""}`}
      {...rest}
    >
      <svg
        className="sud-progress__circle"
        width={circleSize}
        height={circleSize}
        aria-hidden="true"
      >
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke={finalBgColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={0}
          strokeLinecap="round"
          style={{
            ...(isDashboard && {
              transform: "rotate(135deg)",
              transformOrigin: "center center"
            })
          }}
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke={finalGaugeColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{
            transition: "stroke-dashoffset 0.3s",
            ...(isDashboard
              ? { transform: "rotate(135deg)", transformOrigin: "center" }
              : { transform: "rotate(-90deg)", transformOrigin: "center" })
          }}
        />
      </svg>

      {showText && (
        <div
          className="sud-progress__text"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            lineHeight: 1
          }}
        >
          {centerContent}
        </div>
      )}
    </div>
  );
};
