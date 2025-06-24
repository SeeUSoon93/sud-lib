"use client";
import "../../../index.css";
import { forwardRef, useEffect, useRef } from "react";

import { useTheme } from "../../../theme/ThemeContext";
import {
  computeColorStyles,
  getShadowStyle,
  mergeClassNames,
  resolveColor
} from "../../../theme/themeUtils";

export const Footer = forwardRef(
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
      height = "80",
      FullWidth = true,
      shadow = "",
      onHeightChange,
      siderPosition = "below-header",
      siderWidth = 0,
      border = true,
      style = {},
      ...rest
    },
    ref
  ) => {
    const innerRef = useRef(null);
    const realRef = ref || innerRef;
    const theme = useTheme();

    useEffect(() => {
      if (realRef.current) {
        onHeightChange?.(realRef.current.offsetHeight);
      }
    }, []);

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

    const boxShadow = getShadowStyle(shadow, theme);
    const shapeStyle =
      shape === "rounded"
        ? { borderRadius: "15px 15px 0 0" }
        : { borderRadius: "0" };

    return (
      <div
        ref={realRef}
        className={mergeClassNames(
          "sud-footer",
          "flex flex-row Pretendard-R pd-10",
          `z-${siderPosition === "above-header" ? 999 : 1000}`,
          className
        )}
        style={{
          width: FullWidth
            ? siderPosition === "above-header"
              ? `calc(100% - ${siderWidth}px)`
              : "100%"
            : "100%",
          height: `${height}px`,
          backgroundColor: finalBgColor,
          color: finalTxtColor,
          borderTop: finalBorStyle,
          position: "absolute",
          left: siderPosition === "above-header" ? `${siderWidth}px` : 0,
          bottom: 0,
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

Footer.displayName = "SUFooter";
