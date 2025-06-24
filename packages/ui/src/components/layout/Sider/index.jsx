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

// Sider 컴포넌트
export const Sider = forwardRef(
  (
    {
      children,
      background,
      colorType = "default",
      color,
      borderColor,
      borderType = "solid",
      borderWeight = "1",
      className = "",
      shape = "square",
      width = 200,
      FullHeight = true,
      shadow = "",
      onWidthChange,
      siderPosition = "below-header",
      headerHeight = 0,
      footerHeight = 0,
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
        onWidthChange?.(realRef.current.offsetWidth);
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
        ? { borderRadius: "0 15px 15px 0" }
        : { borderRadius: "0" };

    return (
      <div
        ref={realRef}
        className={mergeClassNames(
          "sud-sider",
          "relative flex flex-col gap-10 jus-start Pretendard-R",
          `z-${siderPosition === "below-header" ? 999 : 1000}`,
          siderPosition === "below-header" ? `pd-t-${headerHeight}` : "",
          className
        )}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: "100%",
          width: typeof width === "number" ? `${width}px` : width,
          minWidth: 0, // ✅ 내부 요소가 밀리지 않도록
          backgroundColor: finalBgColor,
          color: finalTxtColor,
          overflowX: "hidden", // ✅ 가로 스크롤 방지
          overflowY: width === 0 ? "hidden" : "auto", // ✅ width:0일 때 스크롤 제거
          borderRight: width === 0 ? "none" : finalBorStyle, // ✅ 선 없애기
          boxShadow: width === 0 ? "none" : boxShadow, // ✅ 그림자 없애기
          visibility: width === 0 ? "hidden" : "visible", // ✅ 요소 숨김
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

Sider.displayName = "SUSider";
