"use client";
import "../../index.css";
import React from "react";
import { applyPulseEffect } from "../../utils/styleUtils";
import { useTheme } from "../../theme/ThemeContext";
import {
  computeColorStyles,
  resolveColor,
  mergeClassNames
} from "../../theme/themeUtils";

export const Div = ({
  children,
  colorType = null,
  background = null,
  color = null,
  onClick,
  style,
  className,
  ...rest
}) => {
  const theme = useTheme();

  const { bgColor, txtColor } = computeColorStyles({
    border: false,
    fallback: colorType
  });
  const finalBgColor = background ? resolveColor(background, theme) : bgColor;
  const finalTxtColor = color ? resolveColor(color, theme) : txtColor;

  const handleClick = (e) => {
    if (onClick) onClick(e);
  };

  return (
    <div
      className={mergeClassNames("sud-div", className)}
      style={{
        margin: 0,
        padding: 0,
        border: 0,
        color: finalTxtColor,
        backgroundColor: finalBgColor,
        ...style
      }}
      onClick={handleClick}
      {...rest}
    >
      {children}
    </div>
  );
};
