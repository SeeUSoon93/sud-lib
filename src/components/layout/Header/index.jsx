"use client";
import React, { forwardRef } from "react";
import "../../../index.css";

import { useTheme } from "../../../theme/ThemeContext";
import {
  computeColorStyles,
  getShadowStyle,
  mergeClassNames,
  resolveColor
} from "../../../theme/themeUtils";

export const Header = forwardRef(
  (
    {
      children,
      background,
      color,
      colorType = "default",
      borderColor,
      borderType = "solid",
      borderWeight = "1",
      className = "",
      shape = "square",
      height = 80,
      shadow = "",
      siderPosition = "below-header",
      siderWidth = 0,
      border = true,
      style = {},
      ...rest
    },
    ref
  ) => {
    const theme = useTheme();
    const { bgColor, txtColor, borColor } = computeColorStyles({
      border,
      fallback: colorType
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

    // Header shape 스타일 처리 (rounded or square)
    const shapeStyle =
      shape === "rounded"
        ? { borderRadius: "0 0 15px 15px" }
        : { borderRadius: "0" };

    const boxShadow = getShadowStyle(shadow, theme);

    return (
      <div
        ref={ref}
        className={mergeClassNames(
          "sud-header",
          "flex flex-row gap-10 item-cen Pretendard-R",
          `z-${siderPosition === "above-header" ? 999 : 1000}`,
          siderPosition === "above-header" ? `pd-l-${siderWidth}` : "",
          className
        )}
        style={{
          left: 0,
          right: 0,
          width: "100%",
          height: typeof height === "number" ? `${height}px` : height,
          backgroundColor: finalBgColor,
          color: finalTxtColor,
          borderBottom: finalBorStyle,
          position: "absolute",
          top: 0,
          boxShadow,
          ...shapeStyle,
          ...style
        }}
        {...rest}
      >
        {children}
      </div>
    );
  }
);

Header.displayName = "SUHeader";
