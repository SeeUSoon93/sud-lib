"use client";
import "../../../index.css";
import { forwardRef, useRef } from "react";

import {
  computeColorStyles,
  mergeClassNames,
  resolveColor
} from "../../../theme/themeUtils";
import { useTheme } from "../../../theme/ThemeContext";

export const Content = forwardRef(
  (
    {
      children,
      className = "",
      background,
      color,
      layoutOffset = { header: 0, footer: 0, sider: 0 },
      style = {},
      ...rest
    },
    ref
  ) => {
    const innerRef = useRef(null);
    const realRef = ref || innerRef;
    const theme = useTheme();
    const { header = 0, footer = 0, sider = 0 } = layoutOffset;

    const { bgColor, txtColor } = computeColorStyles({
      border: false
    });
    const finalBgColor = background ? resolveColor(background, theme) : bgColor;
    const finalTxtColor = color ? resolveColor(color, theme) : txtColor;

    return (
      <div
        ref={realRef}
        className={mergeClassNames("sud-content", className)}
        style={{
          position: "absolute",
          top: `${header}px`,
          left: `${sider}px`,
          right: 0,
          bottom: `${footer}px`,
          width: `calc(100% - ${sider}px)`,
          height: `calc(100% - ${header}px - ${footer}px)`,
          overflowY: "auto",
          backgroundColor: finalBgColor,
          color: finalTxtColor,
          boxSizing: "border-box",
          ...style
        }}
        {...rest}
      >
        {children}
      </div>
    );
  }
);

Content.displayName = "SUContent";
